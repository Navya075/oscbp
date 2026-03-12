"use client";

import React from 'react';
import { Runway, Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plane as PlaneIcon, Clock, AlertCircle } from 'lucide-react';
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
              "runway-card p-6",
              runway.status === 'BUSY' ? "runway-card-busy" : "runway-card-free"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg",
                  runway.status === 'BUSY' ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {runway.id}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-700">Runway {runway.id}</h3>
                  <p className={cn(
                    "text-xs font-bold uppercase",
                    runway.status === 'BUSY' ? "text-blue-500" : "text-slate-400"
                  )}>
                    {runway.status === 'BUSY' ? 'Plane ' + currentPlane?.id + ' ' + currentPlane?.operation : 'Available'}
                  </p>
                </div>
              </div>
              
              {runway.status === 'BUSY' && currentPlane && (
                <div className="flex items-center gap-2 text-slate-900 font-bold bg-white px-3 py-1.5 rounded-full shadow-sm border border-blue-100">
                  <Clock className="w-4 h-4 text-blue-500" />
                  {currentPlane.remainingTime}s
                </div>
              )}
            </div>

            {runway.status === 'BUSY' && currentPlane ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2.5 bg-blue-100" />
                {currentPlane.priority === 'EMERGENCY' && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg border border-red-100 mt-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    EMERGENCY PRIORITY
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[64px] flex items-center justify-center">
                <p className="text-slate-400 text-sm font-medium italic">Waiting for next plane...</p>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
