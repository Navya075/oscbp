"use client";

import React, { useState } from 'react';
import { Plane, OperationType, PriorityType } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Plane as PlaneIcon, Zap } from 'lucide-react';

interface PlaneFormProps {
  onAdd: (plane: Omit<Plane, 'status' | 'arrivalTime' | 'remainingTime'>) => void;
}

export function PlaneForm({ onAdd }: PlaneFormProps) {
  const [id, setId] = useState('FLIGHT-' + Math.floor(Math.random() * 900 + 100));
  const [operation, setOperation] = useState<OperationType>('LANDING');
  const [priority, setPriority] = useState<PriorityType>('NORMAL');
  const [burstTime, setBurstTime] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ id, operation, priority, burstTime });
    setId('FLIGHT-' + Math.floor(Math.random() * 900 + 100));
  };

  return (
    <Card className="p-6 border-slate-200 shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b">
        <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
          <Plus className="w-4 h-4" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">Dispatch New Flight</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="plane-id" className="text-[10px] font-extrabold uppercase text-slate-400">Callsign Identifier</Label>
          <Input 
            id="plane-id" 
            value={id} 
            onChange={e => setId(e.target.value)} 
            placeholder="e.g. AA123" 
            className="font-mono font-bold bg-slate-50 border-slate-200 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-extrabold uppercase text-slate-400">Operation</Label>
            <Select value={operation} onValueChange={(v: OperationType) => setOperation(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-xs font-bold">
                <SelectValue placeholder="Action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDING" className="text-xs font-medium">Landing</SelectItem>
                <SelectItem value="TAKEOFF" className="text-xs font-medium">Takeoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-extrabold uppercase text-slate-400">Severity</Label>
            <Select value={priority} onValueChange={(v: PriorityType) => setPriority(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 text-xs font-bold">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL" className="text-xs font-medium">Routine</SelectItem>
                <SelectItem value="EMERGENCY" className="text-xs font-medium text-red-600">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="burst-time" className="text-[10px] font-extrabold uppercase text-slate-400">Runway Duration (Seconds)</Label>
          <Input 
            id="burst-time" 
            type="number" 
            min="1" 
            max="60" 
            value={burstTime} 
            onChange={e => setBurstTime(parseInt(e.target.value) || 1)}
            className="bg-slate-50 border-slate-200 font-mono font-bold"
          />
          <p className="text-[9px] text-slate-400 italic">Estimated time required to clear the runway segment.</p>
        </div>

        <Button type="submit" className="w-full font-extrabold text-xs uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 py-6">
          <PlaneIcon className="w-4 h-4 mr-2" />
          Queue for Departure/Arrival
        </Button>
      </form>
    </Card>
  );
}
