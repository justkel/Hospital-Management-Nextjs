'use client';

import {
  CalendarX,
  Clock,
  Edit3,
  Flame,
  Star,
  Zap,
} from 'lucide-react';

import {
  TheatreAvailabilitiesQuery,
  TheatreAvailabilityType,
} from '@/shared/graphql/generated/graphql';

type Availability =
  TheatreAvailabilitiesQuery['theatreAvailabilities'][number];

interface Props {
  availabilities: Availability[];
  onEditRequest: () => void;
}

const DAY_LABELS: Record<number, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const DAY_SHORT: Record<number, string> = {
  0: 'SUN',
  1: 'MON',
  2: 'TUE',
  3: 'WED',
  4: 'THU',
  5: 'FRI',
  6: 'SAT',
};

const TYPE_CONFIG: Record<
  TheatreAvailabilityType,
  {
    label: string;
    icon: React.ElementType;
    pill: string;
    bar: string;
  }
> = {
  [TheatreAvailabilityType.Regular]: {
    label: 'Regular',
    icon: Star,
    pill: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    bar: 'bg-cyan-400',
  },
  [TheatreAvailabilityType.Emergency]: {
    label: 'Emergency',
    icon: Flame,
    pill: 'bg-rose-50 border-rose-200 text-rose-700',
    bar: 'bg-rose-400',
  },
  [TheatreAvailabilityType.SpecialSession]: {
    label: 'Special',
    icon: Zap,
    pill: 'bg-violet-50 border-violet-200 text-violet-700',
    bar: 'bg-violet-400',
  },
};

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function durationMinutes(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export default function TheatreAvailabilityBoard({
  availabilities,
  onEditRequest,
}: Props) {
  const grouped: Record<number, Availability[]> = {};

  for (let d = 0; d <= 6; d++) {
    grouped[d] = availabilities
      .filter((a) => a.dayOfWeek === d)
      .sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );
  }

  const hasAny = availabilities.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {hasAny
            ? `${availabilities.length} active slot${availabilities.length !== 1 ? 's' : ''} across the week`
            : 'No availability configured'}
        </p>

        <button
          onClick={onEditRequest}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-violet-700 active:scale-95"
        >
          <Edit3 size={13} />
          Edit Schedule
        </button>
      </div>

      {!hasAny ? (
        <EmptyState onEditRequest={onEditRequest} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 7 }, (_, d) => (
            <DayColumn
              key={d}
              day={d}
              slots={grouped[d]}
              onEditRequest={onEditRequest}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DayColumn({
  day,
  slots,
}: {
  day: number;
  slots: Availability[];
  onEditRequest: () => void;
}) {
  const isEmpty = slots.length === 0;

  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] border transition ${
        isEmpty
          ? 'border-slate-100 bg-slate-50/60'
          : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      <div
        className={`flex items-center justify-between px-5 py-4 ${
          isEmpty
            ? 'border-b border-slate-100'
            : 'border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black tracking-wide ${
              isEmpty
                ? 'bg-slate-100 text-slate-400'
                : 'bg-violet-100 text-violet-700'
            }`}
          >
            {DAY_SHORT[day]}
          </div>

          <span
            className={`text-sm font-bold ${
              isEmpty ? 'text-slate-400' : 'text-slate-800'
            }`}
          >
            {DAY_LABELS[day]}
          </span>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            isEmpty
              ? 'bg-slate-100 text-slate-400'
              : 'bg-violet-100 text-violet-700'
          }`}
        >
          {slots.length}
        </span>
      </div>

      <div className="divide-y divide-slate-50 p-3 space-y-2">
        {isEmpty ? (
          <p className="py-4 text-center text-xs font-medium text-slate-400">
            No slots
          </p>
        ) : (
          slots.map((slot) => (
            <SlotCard key={slot.id} slot={slot} />
          ))
        )}
      </div>
    </div>
  );
}

function SlotCard({ slot }: { slot: Availability }) {
  const config =
    TYPE_CONFIG[slot.type] ?? TYPE_CONFIG[TheatreAvailabilityType.Regular];

  const Icon = config.icon;
  const dur = durationMinutes(slot.startTime, slot.endTime);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md">
      <div
        className={`absolute left-0 top-3 bottom-3 w-[0.3] rounded-r-full ${config.bar}`}
      />

      <div className="pl-3">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${config.pill}`}
          >
            <Icon size={9} />
            {config.label}
          </span>

          <span className="text-[10px] font-semibold text-slate-400">
            {dur}m
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Clock size={11} className="text-slate-400 shrink-0" />
          <span className="text-xs font-bold text-slate-800">
            {formatTime(slot.startTime)}
          </span>
          <span className="text-xs text-slate-400">→</span>
          <span className="text-xs font-bold text-slate-800">
            {formatTime(slot.endTime)}
          </span>
        </div>

        {slot.notes && (
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
            {slot.notes}
          </p>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  onEditRequest,
}: {
  onEditRequest: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50">
        <CalendarX className="h-8 w-8 text-violet-400" />
      </div>

      <p className="text-lg font-black text-slate-800">
        No schedule yet
      </p>

      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This theatre has no weekly availability configured.
        Set operating windows to enable bookings.
      </p>

      <button
        onClick={onEditRequest}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold !text-white shadow-sm transition hover:bg-violet-700 active:scale-95"
      >
        Configure Schedule
      </button>
    </div>
  );
}