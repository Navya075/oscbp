"use client";

import React from 'react';
import { Plane } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QueueDisplayProps {
  planes: Plane[];
}

export function QueueDisplay({ planes }: QueueDisplayProps) {
  const displayPlanes = planes.filter(p => p.status !== 'COMPLETED');

  return (
    <Card className="p-6 border-none shadow-sm bg-white rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-50 rounded-lg text-orange-500">
          <List className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Planes Waiting</h2>
      </div>

      <div className="max-h-[350px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-50 hover:bg-transparent">
              <TableHead className="font-bold text-slate-400">Plane ID</TableHead>
              <TableHead className="font-bold text-slate-400">Operation</TableHead>
              <TableHead className="font-bold text-slate-400">Priority</TableHead>
              <TableHead className="font-bold text-slate-400">Runway Time</TableHead>
              <TableHead className="font-bold text-slate-400 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayPlanes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-slate-400 text-sm italic">
                  Queue is clear! No planes waiting.
                </TableCell>
              </TableRow>
            ) : (
              displayPlanes.map(plane => (
                <TableRow key={plane.id} className="border-slate-50 hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-900">{plane.id}</TableCell>
                  <TableCell className="font-medium text-slate-600">{plane.operation}</TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "border-none font-bold text-[10px]",
                      plane.priority === 'EMERGENCY' ? "bg-red-100 text-red-600" :
                      plane.priority === 'HIGH' ? "bg-orange-100 text-orange-600" :
                      "bg-slate-100 text-slate-500"
                    )}>
                      {plane.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-slate-600">
                    {plane.remainingTime}s / {plane.burstTime}s
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-bold",
                      plane.status === 'WAITING' ? 'text-orange-700 bg-orange-100' : 
                      plane.status === 'RUNNING' ? 'text-blue-700 bg-blue-100' : 
                      'text-green-700 bg-green-100'
                    )}>
                      {plane.status === 'RUNNING' ? 'ON RUNWAY' : plane.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
