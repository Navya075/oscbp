"use client";

import React from 'react';
import { Runway, Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plane as PlaneIcon, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RunwayDisplayProps {
  runways: Runway[];
  planes: Plane[];
}

export function RunwayDisplay({ runways, planes }: RunwayDisplayProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {runways.map(runway => {
        const currentPlane = planes.find(p => p.id === runway.currentPlaneId);
        const progress = currentPlane 
          ? ((currentPlane.burstTime - currentPlane.remainingTime) / currentPlane.burstTime) * 100 
          : 0;

        return (
          <Card 
            key={runway.id} 
            className={cn(
              "p-5 transition-all duration-300 border",
              runway.status === 'BUSY' ? "runway-card-busy" : "runway-card-free"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs",
                  runway.status === 'BUSY' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  R{runway.id}
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                    Status Node
                  </h3>
                  <p className={cn(
                    "text-sm font-extrabold uppercase",
                    runway.status === 'BUSY' ? "text-indigo-600" : "text-slate-400"
                  )}>
                    {runway.status === 'BUSY' ? 'Operational' : 'Idle / Available'}
                  </p>
                </div>
              </div>
              
              {runway.status === 'BUSY' && currentPlane && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Occupancy</p>
                    <div className="flex items-center gap-1.5 text-slate-900 font-mono text-lg font-bold">
                      <Clock className="w-3 h-3 text-indigo-500" />
                      {currentPlane.remainingTime}s
                    </div>
                  </div>
                </div>
              )}
            </div>

            {runway.status === 'BUSY' && currentPlane ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded shadow-sm text-indigo-600 border border-slate-200">
                      <PlaneIcon className={cn(
                        "w-5 h-5 transition-transform duration-500",
                        currentPlane.operation === 'LANDING' ? "rotate-180" : ""
                      )} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-extrabold text-slate-900">{currentPlane.id}</span>
                        {currentPlane.priority === 'EMERGENCY' && (
                          <div className="flex items-center gap-1 text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full uppercase font-bold border border-red-200">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Emergency
                          </div>
                        )}
                      </div>
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight">
                        {currentPlane.operation} Protocol Active
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 block uppercase">Progress</span>
                    <span className="text-sm font-mono font-bold text-indigo-600">{Math.round(progress)}%</span>
                  </div>
                </div>
                <Progress value={progress} className="h-1.5 bg-slate-100" />
              </div>
            ) : (
              <div className="h-[80px] flex flex-col items-center justify-center rounded-lg bg-slate-50/50">
                <p className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">Clearance Ready</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
