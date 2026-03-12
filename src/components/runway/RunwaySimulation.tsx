"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plane, Runway, SchedulingAlgorithm, SystemEvent, PriorityType } from '@/types/simulation';
import { PlaneForm } from './PlaneForm';
import { RunwayDisplay } from './RunwayDisplay';
import { QueueDisplay } from './QueueDisplay';
import { MetricsDisplay } from './MetricsDisplay';
import { EventLog } from './EventLog';
import { SimulationControls } from './SimulationControls';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';

const INITIAL_RUNWAYS: Runway[] = [
  { id: 1, status: 'FREE' },
  { id: 2, status: 'FREE' },
  { id: 3, status: 'FREE' },
];

const PRIORITY_VALUES: Record<PriorityType, number> = {
  'EMERGENCY': 0,
  'HIGH': 1,
  'NORMAL': 2,
};

export function RunwaySimulation() {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [runways, setRunways] = useState<Runway[]>(INITIAL_RUNWAYS);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [numRunways, setNumRunways] = useState(2);
  const [quantum, setQuantum] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [ticks, setTicks] = useState(0);
  const [logs, setLogs] = useState<SystemEvent[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((message: string, type: SystemEvent['type'] = 'INFO') => {
    setLogs(prev => [{ timestamp: Date.now(), message, type }, ...prev].slice(0, 50));
  }, []);

  const handleAddPlane = (planeData: Omit<Plane, 'status' | 'arrivalTime' | 'remainingTime'>) => {
    const newPlane: Plane = {
      ...planeData,
      arrivalTime: ticks,
      remainingTime: planeData.burstTime,
      status: 'WAITING',
    };
    setPlanes(prev => [...prev, newPlane]);
    addLog(`Plane ${newPlane.id} added to queue.`, 'INFO');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTicks(0);
    setPlanes([]);
    setRunways(prev => prev.map(r => ({ ...r, status: 'FREE', currentPlaneId: undefined })));
    setLogs([]);
    addLog('Simulation reset.', 'WARNING');
  };

  const getBestWaitingPlane = useCallback((waitingPlanes: Plane[]) => {
    if (waitingPlanes.length === 0) return null;

    let sorted = [...waitingPlanes];

    switch (algorithm) {
      case 'FCFS':
      case 'ROUND_ROBIN':
        sorted.sort((a, b) => a.arrivalTime - b.arrivalTime);
        break;
      case 'SJF_NON_PREEMPTIVE':
      case 'SJF_PREEMPTIVE':
        sorted.sort((a, b) => {
          if (a.remainingTime === b.remainingTime) return a.arrivalTime - b.arrivalTime;
          return a.remainingTime - b.remainingTime;
        });
        break;
      case 'PRIORITY_NON_PREEMPTIVE':
      case 'PRIORITY_PREEMPTIVE':
        sorted.sort((a, b) => {
          const pa = PRIORITY_VALUES[a.priority];
          const pb = PRIORITY_VALUES[b.priority];
          if (pa === pb) return a.arrivalTime - b.arrivalTime;
          return pa - pb;
        });
        break;
    }

    return sorted[0];
  }, [algorithm]);

  const tick = useCallback(() => {
    setPlanes(prevPlanes => {
      let updatedPlanes = [...prevPlanes];
      let updatedRunways = [...runways];
      const currentTime = ticks;

      // 1. Process running planes
      updatedPlanes = updatedPlanes.map(p => {
        if (p.status === 'RUNNING') {
          const newRemaining = p.remainingTime - 1;
          const newQuantumUsed = (p.quantumUsed || 0) + 1;

          if (newRemaining <= 0) {
            addLog(`Plane ${p.id} completed its ${p.operation.toLowerCase()}.`, 'SUCCESS');
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            return { ...p, status: 'COMPLETED', remainingTime: 0, completionTime: currentTime + 1 };
          }

          // Preemption Check for Round Robin
          if (algorithm === 'ROUND_ROBIN' && newQuantumUsed >= quantum) {
            addLog(`Time slice ended for ${p.id}. Returning to queue.`, 'WARNING');
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            return { ...p, status: 'WAITING', quantumUsed: 0, arrivalTime: currentTime + 1 };
          }

          return { ...p, remainingTime: newRemaining, quantumUsed: newQuantumUsed };
        }
        return p;
      });

      // 2. Preemption Check for Preemptive Algorithms
      if (algorithm === 'SJF_PREEMPTIVE' || algorithm === 'PRIORITY_PREEMPTIVE') {
        updatedRunways.slice(0, numRunways).forEach((r, idx) => {
          if (r.status === 'BUSY' && r.currentPlaneId) {
            const runningPlaneIdx = updatedPlanes.findIndex(p => p.id === r.currentPlaneId);
            const runningPlane = updatedPlanes[runningPlaneIdx];
            const waitingPlanes = updatedPlanes.filter(p => p.status === 'WAITING');
            const bestWaiting = getBestWaitingPlane(waitingPlanes);

            if (bestWaiting) {
              let shouldPreempt = false;
              if (algorithm === 'SJF_PREEMPTIVE') {
                shouldPreempt = bestWaiting.remainingTime < runningPlane.remainingTime;
              } else {
                shouldPreempt = PRIORITY_VALUES[bestWaiting.priority] < PRIORITY_VALUES[runningPlane.priority];
              }

              if (shouldPreempt) {
                addLog(`Preempting ${runningPlane.id} for higher priority ${bestWaiting.id}.`, 'ALERT');
                updatedPlanes[runningPlaneIdx] = { ...runningPlane, status: 'WAITING', runwayId: undefined };
                updatedRunways[idx] = { ...r, status: 'FREE', currentPlaneId: undefined };
              }
            }
          }
        });
      }

      // 3. Assign new planes to free runways
      const activeRunways = updatedRunways.slice(0, numRunways);
      activeRunways.forEach((r, idx) => {
        if (r.status === 'FREE') {
          const waitingPlanes = updatedPlanes.filter(p => p.status === 'WAITING');
          const nextPlane = getBestWaitingPlane(waitingPlanes);
          
          if (nextPlane) {
            const planeIdx = updatedPlanes.findIndex(p => p.id === nextPlane.id);
            if (planeIdx !== -1) {
              addLog(`Plane ${nextPlane.id} assigned to Runway ${r.id}.`, 'SUCCESS');
              updatedPlanes[planeIdx] = {
                ...updatedPlanes[planeIdx],
                status: 'RUNNING',
                runwayId: r.id,
                startTime: updatedPlanes[planeIdx].startTime ?? currentTime,
                quantumUsed: 0
              };
              updatedRunways[idx] = { ...r, status: 'BUSY', currentPlaneId: nextPlane.id };
            }
          }
        }
      });

      setRunways(updatedRunways);
      return updatedPlanes;
    });
    setTicks(t => t + 1);
  }, [ticks, algorithm, quantum, numRunways, runways, addLog, getBestWaitingPlane]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(tick, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, tick]);

  return (
    <div className="airport-grid">
      {/* LEFT PANEL */}
      <div className="space-y-6">
        <SimulationControls 
          isRunning={isRunning}
          onToggle={() => setIsRunning(!isRunning)}
          onReset={resetSimulation}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          numRunways={numRunways}
          onNumRunwaysChange={setNumRunways}
          quantum={quantum}
          onQuantumChange={setQuantum}
        />
        <PlaneForm onAdd={handleAddPlane} />
        <Card className="p-4 bg-blue-50 border-none rounded-2xl flex gap-3 items-start">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-blue-900 uppercase">Learning Tip</h4>
            <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
              A <strong>Runway</strong> is like a <strong>CPU core</strong>. Preemptive methods let higher urgency planes "bump" others off the runway.
            </p>
          </div>
        </Card>
      </div>

      {/* CENTER PANEL */}
      <div className="space-y-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Runway Status</h2>
        <RunwayDisplay runways={runways.slice(0, numRunways)} planes={planes} />
        <QueueDisplay planes={planes} />
      </div>

      {/* RIGHT PANEL */}
      <div className="space-y-6">
        <MetricsDisplay planes={planes} ticks={ticks} />
        <EventLog logs={logs} />
        <Card className="p-6 border-none shadow-sm bg-[#fff3e0] rounded-2xl">
          <h3 className="text-sm font-bold text-orange-800 mb-4">Airport Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-700 font-medium">Waiting to Land/Takeoff</span>
              <span className="font-bold text-orange-900">{planes.filter(p => p.status === 'WAITING').length}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-orange-700 font-medium">Current Load</span>
              <span className="font-bold text-orange-900">
                {Math.round((runways.slice(0, numRunways).filter(r => r.status === 'BUSY').length / numRunways) * 100)}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
