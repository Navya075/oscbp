"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Plane, Runway, SchedulingAlgorithm, SystemEvent, PlaneStatus } from '@/types/simulation';
import { PlaneForm } from './PlaneForm';
import { RunwayDisplay } from './RunwayDisplay';
import { QueueDisplay } from './QueueDisplay';
import { MetricsDisplay } from './MetricsDisplay';
import { EventLog } from './EventLog';
import { SimulationControls } from './SimulationControls';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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
    addLog(`New request: ${newPlane.id} (${newPlane.operation}) added to queue.`, 'INFO');
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setTicks(0);
    setPlanes([]);
    setRunways(prev => prev.map(r => ({ ...r, status: 'FREE', currentPlaneId: undefined })));
    setLogs([]);
    setExecutionOrder([]);
    addLog('System reset.', 'WARNING');
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
            addLog(`Plane ${p.id} completed ${p.operation}.`, 'SUCCESS');
            setExecutionOrder(prev => [...prev, p.id]);
            // Free the runway
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            return { ...p, status: 'COMPLETED', remainingTime: 0, completionTime: ticks + 1 };
          }

          // Round Robin check
          if (algorithm === 'ROUND_ROBIN' && newQuantumUsed >= quantum) {
            addLog(`Quantum expired for ${p.id}. Preempting.`, 'WARNING');
            updatedRunways = updatedRunways.map(r => 
              r.currentPlaneId === p.id ? { ...r, status: 'FREE', currentPlaneId: undefined } : r
            );
            // Move to end of queue essentially by marking as WAITING and updating arrival to current tick for fairness
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
              addLog(`Assigning ${nextPlane.id} to Runway ${r.id}.`, 'SUCCESS');
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
      {/* Left Column: Configuration & Input */}
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
        <EventLog logs={logs} />
      </div>

      {/* Center Column: Runway Dashboard & Status */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <RunwayDisplay runways={runways.slice(0, numRunways)} planes={planes} />
        </div>
        <QueueDisplay planes={planes} executionOrder={executionOrder} />
      </div>

      {/* Right Column: Metrics & Stats */}
      <div className="space-y-6">
        <MetricsDisplay planes={planes} ticks={ticks} />
        <Card className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Runway Protocol</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ready Queue</span>
              <span className="font-mono text-accent">{planes.filter(p => p.status === 'WAITING').length} Planes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Cores</span>
              <span className="font-mono text-accent">{numRunways} Runways</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Throughput</span>
              <span className="font-mono text-accent">{(planes.filter(p => p.status === 'COMPLETED').length / (ticks || 1)).toFixed(2)} p/sec</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-muted-foreground">Execution Flow</span>
            <div className="flex flex-wrap gap-2 pt-2">
              {executionOrder.length === 0 ? (
                <span className="text-xs text-muted-foreground italic">No completed operations yet</span>
              ) : (
                executionOrder.map((pid, i) => (
                  <div key={i} className="bg-secondary px-2 py-1 rounded text-xs font-mono border">
                    {i + 1}. {pid}
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
