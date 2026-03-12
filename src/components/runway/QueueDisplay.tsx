"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

interface QueueDisplayProps {
  planes: Plane[];
  executionOrder: string[];
}

export function QueueDisplay({ planes }: QueueDisplayProps) {
  const activePlanes = planes.filter(p => p.status !== 'COMPLETED');
  const completedPlanesCount = planes.filter(p => p.status === 'COMPLETED').length;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Airspace Registry</h2>
        </div>
        <div className="flex gap-4">
          <div className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span className="text-muted-foreground">Waiting</span>
          </div>
          <div className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            <span className="text-muted-foreground">Executing</span>
          </div>
          <div className="text-xs flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-muted-foreground">Complete ({completedPlanesCount})</span>
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Operation</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Burst</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activePlanes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">
                  Airspace clear. No active requests.
                </TableCell>
              </TableRow>
            ) : (
              activePlanes.map(plane => (
                <TableRow key={plane.id} className="hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono font-bold text-accent">{plane.id}</TableCell>
                  <TableCell className="text-xs uppercase font-bold">{plane.operation}</TableCell>
                  <TableCell>
                    {plane.priority === 'EMERGENCY' ? (
                      <Badge variant="destructive" className="text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        EMERGENCY
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] font-bold">
                        NORMAL
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{plane.burstTime}s</TableCell>
                  <TableCell className="font-mono text-xs">T+{plane.arrivalTime}</TableCell>
                  <TableCell className="text-right">
                    <span className={
                      plane.status === 'WAITING' ? 'plane-status-waiting' : 
                      plane.status === 'RUNNING' ? 'plane-status-running' : 
                      'plane-status-completed'
                    }>
                      {plane.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 pt-4 border-t flex items-center gap-2">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
          Registry represents the OS Ready Queue
        </span>
      </div>
    </Card>
  );
}
