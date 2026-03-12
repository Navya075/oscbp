"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Activity, Timer, Zap, Clock } from 'lucide-react';

interface MetricsDisplayProps {
  planes: Plane[];
  ticks: number;
}

export function MetricsDisplay({ planes, ticks }: MetricsDisplayProps) {
  const completedPlanes = planes.filter(p => p.status === 'COMPLETED');
  
  const waitingTimes = completedPlanes.map(p => (p.startTime || 0) - p.arrivalTime);
  const turnaroundTimes = completedPlanes.map(p => (p.completionTime || 0) - p.arrivalTime);
  const responseTimes = completedPlanes.map(p => (p.startTime || 0) - p.arrivalTime);

  const avgWaiting = waitingTimes.length > 0 ? waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length : 0;
  const avgTurnaround = turnaroundTimes.length > 0 ? turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length : 0;
  const avgResponse = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Efficiency Stats</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Avg Wait Time</p>
              <p className="text-2xl font-mono font-bold">{avgWaiting.toFixed(2)}<span className="text-sm ml-1">s</span></p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground italic max-w-[100px] text-right">
            Time spent waiting for a runway.
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded text-purple-600">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Avg Completion Time</p>
              <p className="text-2xl font-mono font-bold">{avgTurnaround.toFixed(2)}<span className="text-sm ml-1">s</span></p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground italic max-w-[100px] text-right">
            Total time from arrival to exit.
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded text-emerald-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Avg Response</p>
              <p className="text-2xl font-mono font-bold">{avgResponse.toFixed(2)}<span className="text-sm ml-1">s</span></p>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground italic max-w-[100px] text-right">
            Time until first runway access.
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">Simulation Time</span>
          <span className="font-mono text-xl font-bold">{ticks}s</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-full animate-pulse"></div>
        </div>
      </div>
    </Card>
  );
}
