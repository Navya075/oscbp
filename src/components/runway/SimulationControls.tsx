"use client";

import React from 'react';
import { SchedulingAlgorithm } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Cpu, Settings2 } from 'lucide-react';

interface SimulationControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  algorithm: SchedulingAlgorithm;
  onAlgorithmChange: (v: SchedulingAlgorithm) => void;
  numRunways: number;
  onNumRunwaysChange: (v: number) => void;
  quantum: number;
  onQuantumChange: (v: number) => void;
}

export function SimulationControls({
  isRunning,
  onToggle,
  onReset,
  algorithm,
  onAlgorithmChange,
  numRunways,
  onNumRunwaysChange,
  quantum,
  onQuantumChange
}: SimulationControlsProps) {
  return (
    <Card className="p-6 border-primary/20 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Settings2 className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Control Panel</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2">
          <Button 
            onClick={onToggle}
            className={`flex-1 font-bold ${isRunning ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200' : 'bg-primary text-white hover:bg-primary/90'}`}
            variant={isRunning ? 'outline' : 'default'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'PAUSE TRAFFIC' : 'START SIMULATION'}
          </Button>
          <Button onClick={onReset} variant="outline" className="border-muted hover:bg-muted/50">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs uppercase text-muted-foreground font-bold">Scheduling Strategy</Label>
            <Select value={algorithm} onValueChange={(v: SchedulingAlgorithm) => onAlgorithmChange(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FCFS">First Come First Serve (FCFS)</SelectItem>
                <SelectItem value="PRIORITY">Priority (Emergency First)</SelectItem>
                <SelectItem value="ROUND_ROBIN">Time-Sharing (Round Robin)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground italic">
              {algorithm === 'FCFS' && "Flights are handled in the exact order they arrive."}
              {algorithm === 'PRIORITY' && "Emergency flights jump to the front of the line."}
              {algorithm === 'ROUND_ROBIN' && "Flights take turns on the runway for short periods."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-bold flex items-center gap-1">
                <Cpu className="w-3 h-3" /> Runways
              </Label>
              <Select value={numRunways.toString()} onValueChange={(v) => onNumRunwaysChange(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Runway</SelectItem>
                  <SelectItem value="2">2 Runways</SelectItem>
                  <SelectItem value="3">3 Runways</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {algorithm === 'ROUND_ROBIN' && (
              <div className="space-y-2">
                <Label className="text-xs uppercase text-muted-foreground font-bold">Time Slice (s)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={quantum} 
                  onChange={e => onQuantumChange(parseInt(e.target.value) || 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
