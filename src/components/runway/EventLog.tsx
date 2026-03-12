"use client";

import React from 'react';
import { SystemEvent } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventLogProps {
  logs: SystemEvent[];
}

export function EventLog({ logs }: EventLogProps) {
  return (
    <Card className="p-6 border-slate-200 shadow-sm bg-white">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
        <div className="p-1 bg-slate-100 rounded text-slate-600">
          <Terminal className="w-3.5 h-3.5" />
        </div>
        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">System Diagnostics</h2>
      </div>
      <ScrollArea className="h-[220px] pr-4">
        <div className="space-y-3">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-2">
              <div className="w-1 h-1 bg-slate-200 rounded-full animate-ping"></div>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Listening for events...</p>
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-[10px] leading-relaxed group">
                <span className="text-slate-400 font-mono shrink-0 font-bold">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className={cn(
                  "font-medium border-l-2 pl-3 py-0.5 transition-colors",
                  log.type === 'SUCCESS' ? 'text-emerald-600 border-emerald-500 bg-emerald-50/30' :
                  log.type === 'ALERT' ? 'text-red-600 border-red-500 bg-red-50/30' :
                  log.type === 'WARNING' ? 'text-amber-600 border-amber-500 bg-amber-50/30' :
                  'text-slate-600 border-slate-200 hover:border-slate-400'
                )}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
