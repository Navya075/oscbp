"use client";

import React, { useState } from 'react';
import { Plane, OperationType, PriorityType } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Plane as PlaneIcon } from 'lucide-react';

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
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Add New Flight</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plane-id">Flight Number</Label>
          <Input 
            id="plane-id" 
            value={id} 
            onChange={e => setId(e.target.value)} 
            placeholder="e.g. AA123" 
            className="font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Action</Label>
            <Select value={operation} onValueChange={(v: OperationType) => setOperation(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDING">Landing</SelectItem>
                <SelectItem value="TAKEOFF">Takeoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Urgency</Label>
            <Select value={priority} onValueChange={(v: PriorityType) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="EMERGENCY">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="burst-time">Time on Runway (Seconds)</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="burst-time" 
              type="number" 
              min="1" 
              max="60" 
              value={burstTime} 
              onChange={e => setBurstTime(parseInt(e.target.value) || 1)}
            />
          </div>
          <p className="text-[10px] text-muted-foreground italic">How long the flight occupies the runway.</p>
        </div>

        <Button type="submit" className="w-full font-bold">
          <PlaneIcon className="w-4 h-4 mr-2" />
          QUEUE FOR RUNWAY
        </Button>
      </form>
    </Card>
  );
}
