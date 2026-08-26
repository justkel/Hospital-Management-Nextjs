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
    pill: '!bg-[#EFF5FF] !border-[#D6E4FB] !text-[#1D6FE0]',
    bar: '!bg-[#1D6FE0]',
  },
  [TheatreAvailabilityType.Emergency]: {
    label: 'Emergency',
    icon: Flame,
    pill: '!bg-[#FEF2F2] !border-[#FBD5D5] !text-[#DC2626]',
    bar: '!bg-[#DC2626]',
  },
  [TheatreAvailabilityType.SpecialSession]: {
    label: 'Special',
    icon: Zap,
    pill: '!bg-[#F5F2FF] !border-[#E5DCFC] !text-[#7C5CFC]',
    bar: '!bg-[#7C5CFC]',
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
      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
        <p className="text-sm font-medium !text-[#767570]">
          {hasAny
            ? `${availabilities.length} active slot${availabilities.length !== 1 ? 's' : ''} across the week`
            : 'No availability configured'}
        </p>

        <button
          onClick={onEditRequest}
          className="inline-flex items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 py-2.5 text-xs font-semibold !text-white transition hover:!bg-[#16211B]"
        >
          <Edit3 size={13} />
          Edit schedule
        </button>
      </div>

      {!hasAny ? (
        <EmptyState onEditRequest={onEditRequest} />
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
          <div className="flex gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
            {Array.from({ length: 7 }, (_, d) => (
              <div key={d} className="w-[240px] shrink-0 sm:w-auto">
                <DayColumn
                  day={d}
                  slots={grouped[d]}
                  onEditRequest={onEditRequest}
                />
              </div>
            ))}
          </div>
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
      className={`h-full overflow-hidden rounded-2xl border ${
        isEmpty ? '!border-[#E8E6E0] !bg-[#FAFAF8]' : '!border-[#E8E6E0] !bg-white'
      }`}
    >
      <div className="flex items-center justify-between border-b !border-[#E8E6E0] px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold tracking-wide ${
              isEmpty
                ? '!bg-[#F7F7F5] !text-[#B4B2A9]'
                : '!bg-[#ECFBF5] !text-[#1D9E75]'
            }`}
          >
            {DAY_SHORT[day]}
          </div>

          <span
            className={`text-sm font-semibold ${
              isEmpty ? '!text-[#B4B2A9]' : '!text-[#16211B]'
            }`}
          >
            {DAY_LABELS[day]}
          </span>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            isEmpty ? '!bg-[#F7F7F5] !text-[#B4B2A9]' : '!bg-[#ECFBF5] !text-[#1D9E75]'
          }`}
        >
          {slots.length}
        </span>
      </div>

      <div className="space-y-2 p-3">
        {isEmpty ? (
          <p className="py-4 text-center text-xs font-medium !text-[#B4B2A9]">
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
    <div className="relative overflow-hidden rounded-xl border !border-[#E8E6E0] !bg-white p-3.5 transition hover:!border-[#D3D1C7]">

      <div className="pl-2.5">
        <div className="mb-2 flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.pill}`}
          >
            <Icon size={9} />
            {config.label}
          </span>

          <span className="text-[10px] font-medium !text-[#B4B2A9]">
            {dur}m
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Clock size={11} className="shrink-0 !text-[#B4B2A9]" />
          <span className="text-xs font-semibold !text-[#16211B]">
            {formatTime(slot.startTime)}
          </span>
          <span className="text-xs !text-[#B4B2A9]">→</span>
          <span className="text-xs font-semibold !text-[#16211B]">
            {formatTime(slot.endTime)}
          </span>
        </div>

        {slot.notes && (
          <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed !text-[#767570]">
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed !border-[#E8E6E0] !bg-white py-16 text-center sm:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl !bg-[#F7F7F5]">
        <CalendarX className="h-6 w-6 !text-[#B4B2A9]" />
      </div>

      <p className="text-base font-semibold !text-[#16211B]">
        No schedule yet
      </p>

      <p className="mt-1.5 max-w-sm px-6 text-sm !text-[#767570]">
        This theatre has no weekly availability configured. Set operating
        windows to enable bookings.
      </p>

      <button
        onClick={onEditRequest}
        className="mt-6 inline-flex items-center gap-2 rounded-xl !bg-[#0c1a12] px-5 py-2.5 text-sm font-semibold !text-white transition hover:!bg-[#16211B]"
      >
        Configure schedule
      </button>
    </div>
  );
}