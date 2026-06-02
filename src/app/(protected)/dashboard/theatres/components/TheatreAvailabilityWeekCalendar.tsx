'use client';

import { Clock } from 'lucide-react';

import {
  TheatreAvailabilitiesQuery,
  TheatreAvailabilityType,
} from '@/shared/graphql/generated/graphql';

type Availability =
  TheatreAvailabilitiesQuery['theatreAvailabilities'][number];

interface Props {
  availabilities: Availability[];
}

const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TYPE_COLORS: Record<TheatreAvailabilityType, string> = {
  [TheatreAvailabilityType.Regular]:
    'bg-cyan-100 border-cyan-300 text-cyan-800',
  [TheatreAvailabilityType.Emergency]:
    'bg-rose-100 border-rose-300 text-rose-800',
  [TheatreAvailabilityType.SpecialSession]:
    'bg-violet-100 border-violet-300 text-violet-800',
};

const TYPE_DOT: Record<TheatreAvailabilityType, string> = {
  [TheatreAvailabilityType.Regular]: 'bg-cyan-500',
  [TheatreAvailabilityType.Emergency]: 'bg-rose-500',
  [TheatreAvailabilityType.SpecialSession]: 'bg-violet-500',
};

const GRID_START = 6 * 60;
const GRID_END   = 22 * 60;
const GRID_SPAN  = GRID_END - GRID_START;

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function topPercent(t: string): number {
  const mins = Math.max(toMinutes(t), GRID_START);
  return ((mins - GRID_START) / GRID_SPAN) * 100;
}

function heightPercent(start: string, end: string): number {
  const s = Math.max(toMinutes(start), GRID_START);
  const e = Math.min(toMinutes(end), GRID_END);
  return (Math.max(e - s, 0) / GRID_SPAN) * 100;
}

function fmtHour(h: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}${ampm}`;
}

const HOUR_MARKS = [6, 8, 10, 12, 14, 16, 18, 20, 22];

export default function TheatreAvailabilityWeekCalendar({
  availabilities,
}: Props) {
  const grouped: Record<number, Availability[]> = {};
  for (let d = 0; d <= 6; d++) {
    grouped[d] = availabilities.filter((a) => a.dayOfWeek === d);
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
            <Clock className="h-4 w-4 text-violet-700" />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-900">
              Weekly Time Grid
            </h2>
            <p className="text-xs text-slate-500">
              06:00 – 22:00 operating window
            </p>
          </div>

          <div className="ml-auto flex items-center gap-4">
            {Object.entries(TYPE_DOT).map(([type, dot]) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${dot}`} />
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  {type.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-slate-100 bg-slate-50/60">
            <div />
            {DAY_SHORT.map((d) => (
              <div
                key={d}
                className="border-l border-slate-100 px-3 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-500"
              >
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[56px_repeat(7,1fr)]">
            <div className="relative" style={{ height: 480 }}>
              {HOUR_MARKS.map((h) => {
                const pct = ((h * 60 - GRID_START) / GRID_SPAN) * 100;
                return (
                  <div
                    key={h}
                    className="absolute right-3 -translate-y-1/2 text-[10px] font-semibold tabular-nums text-slate-400"
                    style={{ top: `${pct}%` }}
                  >
                    {fmtHour(h)}
                  </div>
                );
              })}
            </div>

            {Array.from({ length: 7 }, (_, d) => (
              <DayCell
                key={d}
                slots={grouped[d]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DayCell({ slots }: { slots: Availability[] }) {
  return (
    <div
      className="relative border-l border-slate-100"
      style={{ height: 480 }}
    >
      {HOUR_MARKS.map((h) => {
        const pct = ((h * 60 - GRID_START) / GRID_SPAN) * 100;
        return (
          <div
            key={h}
            className="absolute left-0 right-0 border-t border-slate-100"
            style={{ top: `${pct}%` }}
          />
        );
      })}

      {slots.map((slot) => {
        const top = topPercent(slot.startTime);
        const height = heightPercent(slot.startTime, slot.endTime);
        const colorClass =
          TYPE_COLORS[slot.type] ??
          TYPE_COLORS[TheatreAvailabilityType.Regular];

        if (height < 0.5) return null;

        return (
          <div
            key={slot.id}
            className={`absolute left-1 right-1 overflow-hidden rounded-xl border px-2 py-1.5 text-[10px] font-semibold leading-tight shadow-sm ${colorClass}`}
            style={{
              top: `${top}%`,
              height: `${height}%`,
              minHeight: 24,
            }}
            title={`${slot.startTime} – ${slot.endTime}${slot.notes ? ` · ${slot.notes}` : ''}`}
          >
            <span className="block truncate">
              {slot.startTime.slice(0, 5)}
            </span>
            <span className="block truncate opacity-70">
              {slot.endTime.slice(0, 5)}
            </span>
          </div>
        );
      })}
    </div>
  );
}