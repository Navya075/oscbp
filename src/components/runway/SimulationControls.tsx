"use client";

import React from 'react';
import { SchedulingAlgorithm } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Cpu, Settings2, BarChart3 } from 'lucide-react';

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
    <Card className="p-6 border-slate-200 shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b">
        <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
          <Settings2 className="w-4 h-4" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">ATC Control Center</h2>
      </div>

      <div className="space-y-6">
        <div className="flex gap-3">
          <Button 
            onClick={onToggle}
            className={`flex-1 font-extrabold text-xs uppercase tracking-widest py-6 transition-all duration-300 ${
              isRunning 
                ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200 shadow-amber-50' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
            variant={isRunning ? 'outline' : 'default'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Suspend Ops' : 'Initiate Simulation'}
          </Button>
          <Button 
            onClick={onReset} 
            variant="outline" 
            className="border-slate-200 hover:bg-slate-50 w-14 h-auto shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </Button>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">Operational Strategy</Label>
            <Select value={algorithm} onValueChange={(v: SchedulingAlgorithm) => onAlgorithmChange(v)}>
              <SelectTrigger className="bg-slate-50 border-slate-200 font-bold text-xs h-11">
                <SelectValue placeholder="Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FCFS" className="text-xs font-medium">First-In, First-Out (FIFO)</SelectItem>
                <SelectItem value="PRIORITY" className="text-xs font-medium">Preemptive Priority (Emergency)</SelectItem>
                <SelectItem value="ROUND_ROBIN" className="text-xs font-medium">Time-Sharing (Round Robin)</SelectItem>
              </SelectContent>
            </Select>
            <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 flex gap-2">
              <BarChart3 className="w-3 h-3 text-indigo-400 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-normal font-medium italic">
                {algorithm === 'FCFS' && "Standard queuing: Tasks are processed in exact order of arrival."}
                {algorithm === 'PRIORITY' && "Severity-based: Critical tasks preempt lower priority operations."}
                {algorithm === 'ROUND_ROBIN' && "Fair share: Each task receives a fixed window before yielding."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase text-slate-400 font-extrabold flex items-center gap-1 tracking-wider">
                <Cpu className="w-3 h-3" /> Core Nodes
              </Label>
              <Select value={numRunways.toString()} onValueChange={(v) => onNumRunwaysChange(parseInt(v))}>
                <SelectTrigger className="bg-slate-50 border-slate-200 font-bold text-xs">
                  <SelectValue placeholder="Count" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1" className="text-xs font-medium">1 Runway</SelectItem>
                  <SelectItem value="2" className="text-xs font-medium">2 Runways</SelectItem>
                  <SelectItem value="3" className="text-xs font-medium">3 Runways</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {algorithm === 'ROUND_ROBIN' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                <Label className="text-[10px] uppercase text-slate-400 font-extrabold tracking-wider">Time Slice (s)</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="10" 
                  value={quantum} 
                  onChange={e => onQuantumChange(parseInt(e.target.value) || 1)}
                  className="bg-slate-50 border-slate-200 font-mono font-bold"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
