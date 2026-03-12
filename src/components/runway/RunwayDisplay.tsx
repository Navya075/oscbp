"use client";

import React from 'react';
import { Runway, Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plane as PlaneIcon, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RunwayDisplayProps {
  runways: Runway[];
  planes: Plane[];
}

export function RunwayDisplay({ runways, planes }: RunwayDisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {runways.map(runway => {
        const currentPlane = planes.find(p => p.id === runway.currentPlaneId);
        const progress = currentPlane 
          ? ((currentPlane.burstTime - currentPlane.remainingTime) / currentPlane.burstTime) * 100 
          : 0;

        return (
          <Card 
            key={runway.id} 
            className={cn(
              "p-6 transition-all duration-500 border-2",
              runway.status === 'BUSY' ? "runway-card-busy border-primary/20" : "runway-card-free border-transparent"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                  Runway {runway.id}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    runway.status === 'BUSY' ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                  )}></div>
                  <span className={cn(
                    "text-lg font-bold uppercase",
                    runway.status === 'BUSY' ? "text-primary" : "text-muted-foreground"
                  )}>
                    {runway.status === 'BUSY' ? 'IN USE' : 'AVAILABLE'}
                  </span>
                </div>
              </div>
              {runway.status === 'BUSY' && currentPlane && (
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">Remaining</span>
                  <div className="flex items-center gap-1 text-primary font-mono text-xl font-bold">
                    <Clock className="w-4 h-4" />
                    {currentPlane.remainingTime}s
                  </div>
                </div>
              )}
            </div>

            {runway.status === 'BUSY' && currentPlane ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-muted/50 p-3 rounded-lg border">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <PlaneIcon className={cn(
                      "w-6 h-6",
                      currentPlane.operation === 'LANDING' ? "rotate-180" : ""
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono font-bold">{currentPlane.id}</span>
                      {currentPlane.priority === 'EMERGENCY' && (
                        <span className="flex items-center gap-1 text-[10px] bg-destructive text-destructive-foreground px-1.5 rounded uppercase font-bold">
                          Emergency
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      {currentPlane.operation} IN PROGRESS
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Task Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            ) : (
              <div className="h-[110px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                <span className="text-muted-foreground/40 font-bold uppercase tracking-widest text-sm italic">
                  Clear for Traffic
                </span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
