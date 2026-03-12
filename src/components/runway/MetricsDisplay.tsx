"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Activity, Timer, Zap, Clock, ShieldCheck } from 'lucide-react';

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
    <Card className="p-6 border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Fleet Efficiency</h2>
        </div>
        <div className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded border border-indigo-100">
          REAL-TIME
        </div>
      </div>

      <div className="space-y-4">
        <div className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition-colors shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Wait Delay</p>
                <p className="text-2xl font-mono font-bold text-slate-900">{avgWaiting.toFixed(2)}<span className="text-sm ml-0.5 text-slate-400">s</span></p>
              </div>
            </div>
            <ShieldCheck className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Timer className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Cycle Time</p>
                <p className="text-2xl font-mono font-bold text-slate-900">{avgTurnaround.toFixed(2)}<span className="text-sm ml-0.5 text-slate-400">s</span></p>
              </div>
            </div>
          </div>
        </div>

        <div className="group bg-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Response</p>
                <p className="text-2xl font-mono font-bold text-slate-900">{avgResponse.toFixed(2)}<span className="text-sm ml-0.5 text-slate-400">s</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Mission Duration</span>
          <span className="font-mono text-lg font-bold text-slate-900">{ticks}<span className="text-xs ml-0.5 uppercase">sec</span></span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 w-full animate-pulse origin-left"></div>
        </div>
      </div>
    </Card>
  );
}
