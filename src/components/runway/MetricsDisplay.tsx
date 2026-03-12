"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Activity, Clock, CheckCircle, Timer } from 'lucide-react';

interface MetricsDisplayProps {
  planes: Plane[];
  ticks: number;
}

export function MetricsDisplay({ planes, ticks }: MetricsDisplayProps) {
  const completedPlanes = planes.filter(p => p.status === 'COMPLETED');
  
  const waitingTimes = completedPlanes.map(p => (p.startTime || 0) - p.arrivalTime);
  const turnaroundTimes = completedPlanes.map(p => (p.completionTime || 0) - p.arrivalTime);

  const avgWaiting = waitingTimes.length > 0 ? waitingTimes.reduce((a, b) => a + b, 0) / waitingTimes.length : 0;
  const avgTurnaround = turnaroundTimes.length > 0 ? turnaroundTimes.reduce((a, b) => a + b, 0) / turnaroundTimes.length : 0;

  return (
    <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-green-50 rounded-lg text-green-500">
          <Activity className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Performance Stats</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-[#e8f5e9] p-4 rounded-2xl border-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/50 rounded-xl text-green-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 uppercase">Planes Completed</p>
              <p className="text-2xl font-bold text-green-900">{completedPlanes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#e3f2fd] p-4 rounded-2xl border-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/50 rounded-xl text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 uppercase">Avg. Waiting Time</p>
              <p className="text-2xl font-bold text-blue-900">{avgWaiting.toFixed(1)}s</p>
            </div>
          </div>
        </div>

        <div className="bg-[#f3e5f5] p-4 rounded-2xl border-none">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/50 rounded-xl text-purple-600">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-700 uppercase">Avg. Cycle Time</p>
              <p className="text-2xl font-bold text-purple-900">{avgTurnaround.toFixed(1)}s</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-400">Simulation Time</span>
        <span className="text-lg font-bold text-slate-900">{ticks}s</span>
      </div>
    </Card>
  );
}
