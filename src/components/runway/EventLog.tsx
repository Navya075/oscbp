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
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">System Log</h2>
      </div>
      <ScrollArea className="h-[250px] pr-4">
        <div className="space-y-2">
          {logs.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">System listening for events...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 text-[11px] leading-relaxed border-l border-white/5 pl-2">
                <span className="text-muted-foreground font-mono shrink-0">
                  [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                </span>
                <span className={cn(
                  "font-medium",
                  log.type === 'SUCCESS' ? 'text-emerald-400' :
                  log.type === 'ALERT' ? 'text-destructive' :
                  log.type === 'WARNING' ? 'text-amber-400' :
                  'text-white'
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
