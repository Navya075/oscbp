"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { List, ShieldAlert } from 'lucide-react';

interface QueueDisplayProps {
  planes: Plane[];
  executionOrder: string[];
}

export function QueueDisplay({ planes }: QueueDisplayProps) {
  const activePlanes = planes.filter(p => p.status !== 'COMPLETED');
  const completedPlanesCount = planes.filter(p => p.status === 'COMPLETED').length;

  return (
    <Card className="p-6 border-slate-200 shadow-sm bg-white overflow-hidden">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <div className="flex items-center gap-2">
          <List className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Fleet Waiting List</h2>
        </div>
        <div className="flex gap-4">
          <div className="text-[10px] flex items-center gap-1.5 font-bold uppercase text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Queue
          </div>
          <div className="text-[10px] flex items-center gap-1.5 font-bold uppercase text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Active
          </div>
          <div className="text-[10px] flex items-center gap-1.5 font-bold uppercase text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Dispatched ({completedPlanesCount})
          </div>
        </div>
      </div>

      <div className="max-h-[400px] overflow-auto -mx-6 px-6">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-slate-100 hover:bg-transparent">
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">Identifier</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">Protocol</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">Priority</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10">Window</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-slate-400 h-10 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activePlanes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-16 text-slate-400 text-xs italic">
                  Runway queue is currently clear.
                </TableCell>
              </TableRow>
            ) : (
              activePlanes.map(plane => (
                <TableRow key={plane.id} className="border-slate-50 hover:bg-slate-50/30">
                  <TableCell className="font-mono font-extrabold text-slate-900 py-4">{plane.id}</TableCell>
                  <TableCell>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                      {plane.operation}
                    </span>
                  </TableCell>
                  <TableCell>
                    {plane.priority === 'EMERGENCY' ? (
                      <Badge variant="destructive" className="text-[9px] font-extrabold h-5 px-2 bg-red-600 hover:bg-red-600">
                        CRITICAL
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[9px] font-extrabold h-5 px-2 bg-slate-100 text-slate-500 border-slate-200">
                        ROUTINE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-slate-500">{plane.burstTime}s</TableCell>
                  <TableCell className="text-right">
                    <span className={
                      plane.status === 'WAITING' ? 'plane-status-waiting' : 
                      plane.status === 'RUNNING' ? 'plane-status-running' : 
                      'plane-status-completed'
                    }>
                      {plane.status === 'RUNNING' ? 'IN OPERATIONS' : plane.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 pt-4 border-t flex items-center gap-2">
        <ShieldAlert className="w-3.5 h-3.5 text-indigo-500" />
        <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-tight">
          System State: Operations waiting in "Ready Queue" memory segment.
        </span>
      </div>
    </Card>
  );
}
