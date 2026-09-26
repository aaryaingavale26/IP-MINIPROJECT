import React from 'react';
import { LiveActivityEvent } from '../types/attendance';
import { Activity, Clock } from 'lucide-react';

interface LiveActivityProps {
  events: LiveActivityEvent[];
}

export const LiveActivity: React.FC<LiveActivityProps> = ({ events }) => {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm no-print">
      <div className="mb-3 flex items-center justify-between border-b border-border pb-2.5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <span className="live-dot inline-block size-2 rounded-full bg-present" />
          Live Activity Feed
        </h2>
        <Activity className="size-4 text-muted-foreground" />
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground py-4 text-center">
          Changes from teachers will appear here in real-time.
        </p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {events.map(event => (
            <li
              key={event.id}
              className={`animate-tick rounded-lg border-l-4 px-3 py-2 text-xs transition ${
                event.mine
                  ? 'border-primary bg-muted/60 text-foreground'
                  : 'border-accent bg-accent/15 text-foreground'
              }`}
            >
              <p className="font-medium">{event.text}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                <Clock className="size-2.5" />
                <span>{new Date(event.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
