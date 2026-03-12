"use client";

import React, { useState } from 'react';
import { Plane, OperationType, PriorityType } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Plane as PlaneIcon } from 'lucide-react';

interface PlaneFormProps {
  onAdd: (plane: Omit<Plane, 'status' | 'arrivalTime' | 'remainingTime'>) => void;
}

export function PlaneForm({ onAdd }: PlaneFormProps) {
  const [id, setId] = useState('P-' + Math.floor(Math.random() * 90 + 10));
  const [operation, setOperation] = useState<OperationType>('LANDING');
  const [priority, setPriority] = useState<PriorityType>('NORMAL');
  const [burstTime, setBurstTime] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ id, operation, priority, burstTime });
    setId('P-' + Math.floor(Math.random() * 90 + 10));
  };

  return (
    <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg text-purple-500">
          <PlusCircle className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Add Plane</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="plane-id" className="text-sm font-bold text-slate-600">Plane ID</Label>
          <Input 
            id="plane-id" 
            value={id} 
            onChange={e => setId(e.target.value)} 
            placeholder="e.g. P1" 
            className="bg-slate-50 border-slate-100 rounded-xl font-bold h-11"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-600">Operation</Label>
            <Select value={operation} onValueChange={(v: OperationType) => setOperation(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-medium">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDING">Landing</SelectItem>
                <SelectItem value="TAKEOFF">Takeoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-600">Priority</Label>
            <Select value={priority} onValueChange={(v: PriorityType) => setPriority(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-medium">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="EMERGENCY" className="text-red-600">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="burst-time" className="text-sm font-bold text-slate-600">Runway Time (seconds)</Label>
          <Input 
            id="burst-time" 
            type="number" 
            min="1" 
            max="60" 
            value={burstTime} 
            onChange={e => setBurstTime(parseInt(e.target.value) || 1)}
            className="bg-slate-50 border-slate-100 rounded-xl font-bold h-11"
          />
        </div>

        <Button type="submit" className="w-full gradient-btn font-bold py-6 rounded-xl shadow-lg">
          <PlaneIcon className="w-5 h-5 mr-2" />
          Add Plane to Queue
        </Button>
      </form>
    </Card>
  );
}
