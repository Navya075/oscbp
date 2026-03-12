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
              "p-6 transition-all duration-500",
              runway.status === 'BUSY' ? "runway-card-busy shadow-lg shadow-primary/5" : "runway-card-free"
            )}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase text-muted-foreground tracking-widest">
                  Runway {runway.id.toString().padStart(2, '0')}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    runway.status === 'BUSY' ? "bg-accent animate-pulse" : "bg-muted"
                  )}></div>
                  <span className={cn(
                    "text-lg font-headline font-bold uppercase",
                    runway.status === 'BUSY' ? "text-accent" : "text-muted-foreground"
                  )}>
                    {runway.status}
                  </span>
                </div>
              </div>
              {runway.status === 'BUSY' && currentPlane && (
                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono text-muted-foreground">TIME REMAINING</span>
                  <div className="flex items-center gap-1 text-accent font-mono text-xl font-bold">
                    <Clock className="w-4 h-4" />
                    {currentPlane.remainingTime}s
                  </div>
                </div>
              )}
            </div>

            {runway.status === 'BUSY' && currentPlane ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-4 bg-background/40 p-3 rounded border border-white/5">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <PlaneIcon className={cn(
                      "w-6 h-6",
                      currentPlane.operation === 'LANDING' ? "rotate-180" : ""
                    )} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-mono font-bold">{currentPlane.id}</span>
                      {currentPlane.priority === 'EMERGENCY' && (
                        <span className="flex items-center gap-1 text-[10px] bg-destructive/20 text-destructive border border-destructive/50 px-1.5 rounded uppercase font-bold">
                          <AlertCircle className="w-3 h-3" />
                          Emergency
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      {currentPlane.operation} CLEARANCE GRANTED
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold">
                    <span>Task Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1.5 bg-secondary" />
                </div>
              </div>
            ) : (
              <div className="h-[110px] flex items-center justify-center border-2 border-dashed border-white/5 rounded">
                <span className="text-muted-foreground/30 font-headline font-bold uppercase tracking-widest text-sm italic">
                  Runway Available
                </span>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
