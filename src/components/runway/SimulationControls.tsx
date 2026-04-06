"use client";

import React from 'react';
import { SchedulingAlgorithm } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

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
    <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
          <Settings className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Airport Control Panel</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-600">Scheduling Method</Label>
            <Select value={algorithm} onValueChange={(v: SchedulingAlgorithm) => onAlgorithmChange(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl h-11 font-medium">
                <SelectValue placeholder="Select Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FCFS">Arrival Order (First-Come, First-Served)</SelectItem>
                <SelectItem value="SJF_NON_PREEMPTIVE">Quick Jobs First (Shortest Job First)</SelectItem>
                <SelectItem value="SJF_PREEMPTIVE">Finish Fastest First (Shortest Remaining Time First)</SelectItem>
                <SelectItem value="PRIORITY_NON_PREEMPTIVE">Priority – No Interruptions (Priority Non-Preemptive)</SelectItem>
                <SelectItem value="PRIORITY_PREEMPTIVE">Priority – Can Interrupt (Priority Preemptive)</SelectItem>
                <SelectItem value="ROUND_ROBIN">Take Turns (Round Robin)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-600 flex items-center gap-1">
                Runways
              </Label>
              <Select value={numRunways.toString()} onValueChange={(v) => onNumRunwaysChange(parseInt(v))}>
                <SelectTrigger className="bg-slate-50 border-slate-100 rounded-xl font-medium">
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
                <Label className="text-sm font-bold text-slate-600">Time Slice (s)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={quantum} 
                  onChange={e => onQuantumChange(parseInt(e.target.value) || 1)}
                  className="bg-slate-50 border-slate-100 rounded-xl font-bold"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button 
            onClick={onToggle}
            className={`flex-1 font-bold rounded-xl py-6 h-auto ${
              isRunning 
                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 border-none' 
                : 'gradient-btn'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="border-slate-100 bg-slate-50 hover:bg-slate-100 rounded-xl px-4"
          >
            <RotateCcw className="w-5 h-5 text-slate-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
