'use client';

import {
  AlertTriangle,
  CalendarX2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Hourglass,
  Layers,
  PauseCircle,
  Play,
  Plus,
  Settings2,
  XCircle,
} from 'lucide-react';

import {
  TheatreBookingPriority,
  TheatreBookingStatus,
} from '@/shared/graphql/generated/graphql';

import { STATUS_META, type Booking } from './TheatreBookingWorkspace';

interface Props {
  bookings: Booking[];
  onCreateRequest: () => void;
  onManageRequest: (booking: Booking) => void;
}

const PRIORITY_BADGE: Record<TheatreBookingPriority, string> = {
  [TheatreBookingPriority.Elective]: 'border-slate-600/50 text-slate-400 bg-slate-900/70',
  [TheatreBookingPriority.Urgent]: 'border-amber-600/50 text-amber-300 bg-amber-950/70',
  [TheatreBookingPriority.Emergency]: 'border-rose-600/50 text-rose-300 bg-rose-950/70',
};

const PRIORITY_LABEL: Record<TheatreBookingPriority, string> = {
  [TheatreBookingPriority.Elective]: 'Elective',
  [TheatreBookingPriority.Urgent]: 'Urgent',
  [TheatreBookingPriority.Emergency]: 'Emergency',
};

const STATUS_ICON: Record<TheatreBookingStatus, React.ElementType> = {
  [TheatreBookingStatus.Scheduled]: Clock,
  [TheatreBookingStatus.Ready]: CheckCircle2,
  [TheatreBookingStatus.InProgress]: Play,
  [TheatreBookingStatus.Delayed]: Hourglass,
  [TheatreBookingStatus.Completed]: CheckCircle2,
  [TheatreBookingStatus.Cancelled]: XCircle,
  [TheatreBookingStatus.Aborted]: AlertTriangle,
  [TheatreBookingStatus.PendingReallocation]: Layers,
  [TheatreBookingStatus.Postponed]: PauseCircle,
};

const TERMINAL_STATUSES: TheatreBookingStatus[] = [
  TheatreBookingStatus.Completed,
  TheatreBookingStatus.Cancelled,
  TheatreBookingStatus.Aborted,
  TheatreBookingStatus.Postponed,
];

function fmt(dt: string) {
  const [datePart, timePart] = dt.replace('T', ' ').split(' ');

  const [year, month, day] = datePart.split('-');

  return {
    date: `${day} ${new Date(Number(year), Number(month) - 1).toLocaleString(
      'en-GB',
      { month: 'short' },
    )} ${year}`,
    time: timePart.slice(0, 5),
  };
}

function durLabel(start: string, end: string) {
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export default function TheatreBookingTimeline({
  bookings,
  onCreateRequest,
  onManageRequest,
}: Props) {
  const hasBookings = bookings.length > 0;
  const active = bookings.filter((b) => !TERMINAL_STATUSES.includes(b.status));
  const terminal = bookings.filter((b) => TERMINAL_STATUSES.includes(b.status));

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
        <p className="font-mono text-xs text-slate-500">
          {hasBookings
            ? `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} on record`
            : 'No bookings recorded'}
        </p>
        <button
          onClick={onCreateRequest}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 px-4 text-xs font-bold text-black shadow-[0_8px_20px_-8px_rgba(45,212,191,0.65)] transition hover:from-teal-300 hover:to-teal-400 active:scale-[0.97]"
        >
          <Plus size={13} strokeWidth={2.75} />
          Book Theatre
        </button>
      </div>

      {!hasBookings ? (
        <Empty onCreateRequest={onCreateRequest} />
      ) : (
        <div className="space-y-6 sm:space-y-7">
          {active.length > 0 && (
            <Group
              label="Active"
              dot="bg-teal-400"
              bookings={active}
              onManage={onManageRequest}
            />
          )}
          {terminal.length > 0 && (
            <Group
              label="History"
              dot="bg-slate-600"
              bookings={terminal}
              onManage={onManageRequest}
              dimmed
            />
          )}
        </div>
      )}
    </div>
  );
}

function Group({
  label,
  dot,
  bookings,
  onManage,
  dimmed = false,
}: {
  label: string;
  dot: string;
  bookings: Booking[];
  onManage: (b: Booking) => void;
  dimmed?: boolean;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot} ${dot.includes('teal') ? 'shadow-[0_0_8px_1px_rgba(45,212,191,0.7)]' : ''}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </span>
        <span className="rounded-full border border-white/10 bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] font-bold text-slate-400">
          {bookings.length}
        </span>
      </div>

      <div className={`space-y-2.5 ${dimmed ? 'opacity-70' : ''}`}>
        {bookings.map((b) => (
          <BookingRow key={b.id} booking={b} onManage={() => onManage(b)} />
        ))}
      </div>
    </div>
  );
}

function BookingRow({ booking, onManage }: { booking: Booking; onManage: () => void }) {
  const meta = STATUS_META[booking.status] ?? STATUS_META[TheatreBookingStatus.Scheduled];
  const StatusIcon = STATUS_ICON[booking.status] ?? Clock;
  const start = fmt(booking.scheduledStartTime);
  const end = fmt(booking.scheduledEndTime);
  const dur = durLabel(booking.scheduledStartTime, booking.scheduledEndTime);
  const isTerminal = TERMINAL_STATUSES.includes(booking.status);
  const priorityBadge = booking.priority
    ? PRIORITY_BADGE[booking.priority]
    : PRIORITY_BADGE[TheatreBookingPriority.Elective];
  const priorityLabel = booking.priority
    ? PRIORITY_LABEL[booking.priority]
    : 'Elective';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#111827] to-[#0D131F] transition hover:border-white/[0.16] hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)]">
      <div className="flex flex-col gap-4 px-4 py-4 pl-6 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${meta.badge}`}>
            <StatusIcon size={15} />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold !text-white">
                {booking.theatre?.name ?? 'Theatre'}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${meta.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${priorityBadge}`}>
                {priorityLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock size={10} className="text-slate-600" />
                <span className="font-bold !text-white">{start.time}</span>
                <span className="text-slate-600">{start.date}</span>
              </span>
              <ChevronRight size={10} className="text-slate-700" />
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-bold text-slate-300">{end.time}</span>
                <span className="text-slate-600">{end.date}</span>
              </span>
              <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-slate-400">
                {dur}
              </span>
            </div>

            {(booking.notes || booking.delayReason || booking.cancellationReason) && (
              <p className="max-w-lg text-[11px] leading-relaxed text-slate-500">
                {booking.cancellationReason ?? booking.delayReason ?? booking.notes}
              </p>
            )}

            {/* booked by */}
            {/* {booking.bookedBy?.fullName && (
              <p className="font-mono text-[10px] text-slate-600">
                Booked by{' '}
                <span className="text-slate-400">{booking.bookedBy.fullName}</span>
              </p>
            )} */}
          </div>
        </div>

        {!isTerminal && (
          <button
            onClick={onManage}
            className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold !text-slate-300 transition hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-300"
          >
            <Settings2 size={12} />
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

function Empty({ onCreateRequest }: { onCreateRequest: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[24px] border border-dashed border-white/[0.12] bg-gradient-to-b from-[#111827] to-[#0D131F] py-16 text-center sm:py-20">
      <div className="pointer-events-none absolute -top-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl" />
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]">
        <CalendarX2 className="h-7 w-7 text-slate-600" />
      </div>
      <p className="relative text-base font-black !text-white">No theatre bookings</p>
      <p className="relative mt-2 max-w-sm px-6 text-sm text-slate-500">
        This procedure hasn't been allocated a theatre slot yet. Create a booking
        to schedule operating time.
      </p>
      <button
        onClick={onCreateRequest}
        className="relative mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 px-5 text-sm font-bold text-black shadow-[0_10px_24px_-10px_rgba(45,212,191,0.7)] transition hover:from-teal-300 hover:to-teal-400 active:scale-[0.97]"
      >
        <Plus size={14} strokeWidth={2.75} />
        Book Theatre
      </button>
    </div>
  );
}