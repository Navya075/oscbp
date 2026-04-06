"use client";

import React, { useState, useEffect } from 'react';
import { SystemEvent } from '@/types/simulation';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventLogProps {
  logs: SystemEvent[];
}

export function EventLog({ logs }: EventLogProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatTime = (timestamp: number) => {
    if (!isMounted) return "--:--:--";
    return new Date(timestamp).toLocaleTimeString([], { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <Card className="p-6 border-none shadow-sm bg-white rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
          <FileText className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">System Log</h2>
      </div>
      <ScrollArea className="h-[250px] pr-4">
        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="py-10 text-center text-slate-300 text-sm font-medium italic">
              System log is empty.
            </div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-3 text-xs p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <span className="text-slate-400 font-bold shrink-0">
                  {formatTime(log.timestamp)}
                </span>
                <span className={cn(
                  "font-medium",
                  log.type === 'SUCCESS' ? 'text-green-600' :
                  log.type === 'ALERT' ? 'text-red-600' :
                  log.type === 'WARNING' ? 'text-orange-600' :
                  'text-slate-600'
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
