"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plane, Runway, SchedulingAlgorithm, SystemEvent } from '@/types/simulation';
import { PlaneForm } from './PlaneForm';
import { RunwayDisplay } from './RunwayDisplay';
import { QueueDisplay } from './QueueDisplay';
import { MetricsDisplay } from './MetricsDisplay';
import { EventLog } from './EventLog';
import { SimulationControls } from './SimulationControls';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

const INITIAL_RUNWAYS: Runway[] = [
  { id: 1, status: 'FREE' },
  { id: 2, status: 'FREE' },
  { id: 3, status: 'FREE' },
];

export function RunwaySimulation() {
  const [planes, setPlanes] = useState<Plane[]>([]);
  const [runways, setRunways] = useState<Runway[]>(INITIAL_RUNWAYS);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [numRunways, setNumRunways] = useState(2);
  const [quantum, setQuantum] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [ticks, setTicks] = useState(0);
  const [logs, setLogs] = useState<SystemEvent[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);

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
    addLog(`Flight ${newPlane.id} entered waiting list.`, 'INFO');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTicks(0);
    setPlanes([]);
    setRunways(prev => prev.map(r => ({ ...r, status: 'FREE', currentPlaneId: undefined })));
    setLogs([]);
    setExecutionOrder([]);
    addLog('Traffic simulation reset.', 'WARNING');
  };

  const getNextPlane = useCallback((currentPlanes: Plane[], currentRunwayPlanes: string[]) => {
    const waitingPlanes = currentPlanes.filter(p => p.status === 'WAITING' && !currentRunwayPlanes.includes(p.id));
    if (waitingPlanes.length === 0) return null;

    if (algorithm === 'FCFS') {
      return waitingPlanes.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
    } else if (algorithm === 'PRIORITY') {
      return waitingPlanes.sort((a, b) => {
        if (a.priority === b.priority) return a.arrivalTime - b.arrivalTime;
        return a.priority === 'EMERGENCY' ? -1 : 1;
      })[0];
    } else if (algorithm === 'ROUND_ROBIN') {
      return waitingPlanes.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
    }
    return null;
  }, [algorithm]);

  const tick = useCallback(() => {
    setTicks(t => t + 1);

    setPlanes(prevPlanes => {
      let updatedPlanes = [...prevPlanes];
      let updatedRunways = [...runways];

      // 1. Update running planes
      updatedPlanes = updatedPlanes.map(p => {
        if (p.status === 'RUNNING') {
          const newRemaining = p.remainingTime - 1;
          const newQuantumUsed = (p.quantumUsed || 0) + 1;

          if (newRemaining <= 0) {
            addLog(`Flight ${p.id} successfully completed operation.`, 'SUCCESS');
            setExecutionOrder(prev => [...prev, p.id]);
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            return { ...p, status: 'COMPLETED', remainingTime: 0, completionTime: ticks + 1 };
          }

          if (algorithm === 'ROUND_ROBIN' && newQuantumUsed >= quantum) {
            addLog(`Time slice expired for ${p.id}. Returning to waiting list.`, 'WARNING');
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            return { ...p, status: 'WAITING', quantumUsed: 0, arrivalTime: ticks + 1 };
          }

          return { ...p, remainingTime: newRemaining, quantumUsed: newQuantumUsed };
        }
        return p;
      });

      // 2. Schedule new planes to free runways
      const activeRunways = updatedRunways.slice(0, numRunways);
      activeRunways.forEach((r, idx) => {
        if (r.status === 'FREE') {
          const nextPlane = getNextPlane(updatedPlanes, updatedRunways.map(r => r.currentPlaneId!).filter(Boolean));
          if (nextPlane) {
            const planeIdx = updatedPlanes.findIndex(p => p.id === nextPlane.id);
            if (planeIdx !== -1) {
              addLog(`Flight ${nextPlane.id} assigned to Runway ${r.id}.`, 'SUCCESS');
              updatedPlanes[planeIdx] = {
                ...updatedPlanes[planeIdx],
                status: 'RUNNING',
                runwayId: r.id,
                startTime: updatedPlanes[planeIdx].startTime ?? ticks + 1,
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
  }, [ticks, algorithm, quantum, numRunways, getNextPlane, runways, addLog]);

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
      {/* Left Column: System Control */}
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
        <Card className="p-4 bg-indigo-50 border-indigo-100 flex gap-3 items-start">
          <Info className="w-5 h-5 text-indigo-600 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-indigo-900 uppercase">OS Metaphor</h4>
            <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
              Each <strong>Flight</strong> is a Process. The <strong>Runway</strong> is a CPU core. 
              The <strong>Strategy</strong> determines which flight gets clearance first.
            </p>
          </div>
        </Card>
      </div>

      {/* Middle Column: Traffic Monitoring */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Runway Matrix</h2>
          <div className="flex gap-2">
            {Array.from({ length: numRunways }).map((_, i) => (
              <div key={i} className="px-2 py-0.5 bg-slate-200 text-slate-600 text-[10px] font-bold rounded uppercase">
                Node {i + 1}
              </div>
            ))}
          </div>
        </div>
        <RunwayDisplay runways={runways.slice(0, numRunways)} planes={planes} />
        <QueueDisplay planes={planes} executionOrder={executionOrder} />
      </div>

      {/* Right Column: Analytics & Logs */}
      <div className="space-y-6">
        <MetricsDisplay planes={planes} ticks={ticks} />
        <EventLog logs={logs} />
        <Card className="p-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Traffic Summary</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Pending Clearance</span>
              <span className="font-mono font-bold text-slate-900 text-lg">{planes.filter(p => p.status === 'WAITING').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Operational Load</span>
              <span className="font-mono font-bold text-indigo-600 text-lg">
                {Math.round((runways.filter(r => r.status === 'BUSY').length / numRunways) * 100)}%
              </span>
            </div>
          </div>
          <Separator className="my-6" />
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-tighter">Operation History</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {executionOrder.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic">No flights dispatched.</span>
              ) : (
                executionOrder.map((pid, i) => (
                  <div key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-slate-600 border border-slate-200">
                    {pid}
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
