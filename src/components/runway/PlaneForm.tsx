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
  const [id, setId] = useState('P-' + Math.floor(Math.random() * 1000));
  const [operation, setOperation] = useState<OperationType>('LANDING');
  const [priority, setPriority] = useState<PriorityType>('NORMAL');
  const [burstTime, setBurstTime] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ id, operation, priority, burstTime });
    setId('P-' + Math.floor(Math.random() * 1000));
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Plus className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Request Clearance</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="plane-id">Flight Identifier</Label>
          <Input 
            id="plane-id" 
            value={id} 
            onChange={e => setId(e.target.value)} 
            placeholder="e.g. AA123" 
            className="font-mono bg-background"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Operation</Label>
            <Select value={operation} onValueChange={(v: OperationType) => setOperation(v)}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LANDING">Landing</SelectItem>
                <SelectItem value="TAKEOFF">Takeoff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v: PriorityType) => setPriority(v)}>
              <SelectTrigger className="bg-background">
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
          <Label htmlFor="burst-time">Runway Occupancy (Seconds)</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="burst-time" 
              type="number" 
              min="1" 
              max="60" 
              value={burstTime} 
              onChange={e => setBurstTime(parseInt(e.target.value) || 1)}
              className="bg-background"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">Burst Time</span>
          </div>
        </div>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
          <PlaneIcon className="w-4 h-4 mr-2" />
          ADD TO WAITING QUEUE
        </Button>
      </form>
    </Card>
  );
}
