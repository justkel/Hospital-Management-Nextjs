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
  [TheatreBookingPriority.Elective]:  'border-slate-600 text-slate-400 bg-slate-900',
  [TheatreBookingPriority.Urgent]:    'border-amber-600 text-amber-300 bg-amber-950',
  [TheatreBookingPriority.Emergency]: 'border-rose-600 text-rose-300 bg-rose-950',
};

const PRIORITY_LABEL: Record<TheatreBookingPriority, string> = {
  [TheatreBookingPriority.Elective]:  'Elective',
  [TheatreBookingPriority.Urgent]:    'Urgent',
  [TheatreBookingPriority.Emergency]: 'Emergency',
};

const STATUS_ICON: Record<TheatreBookingStatus, React.ElementType> = {
  [TheatreBookingStatus.Scheduled]:          Clock,
  [TheatreBookingStatus.Ready]:              CheckCircle2,
  [TheatreBookingStatus.InProgress]:         Play,
  [TheatreBookingStatus.Delayed]:            Hourglass,
  [TheatreBookingStatus.Completed]:          CheckCircle2,
  [TheatreBookingStatus.Cancelled]:          XCircle,
  [TheatreBookingStatus.Aborted]:            AlertTriangle,
  [TheatreBookingStatus.PendingReallocation]: Layers,
  [TheatreBookingStatus.Postponed]:          PauseCircle,
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-slate-500">
          {hasBookings
            ? `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} on record`
            : 'No bookings recorded'}
        </p>
        <button
          onClick={onCreateRequest}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-teal-400 active:scale-95"
        >
          <Plus size={12} />
          Book Theatre
        </button>
      </div>

      {!hasBookings ? (
        <Empty onCreateRequest={onCreateRequest} />
      ) : (
        <div className="space-y-6">
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
        <span className={`h-2 w-2 rounded-full ${dot}`} />
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
          {label}
        </span>
        <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500">
          {bookings.length}
        </span>
      </div>

      <div className={`space-y-2 ${dimmed ? 'opacity-60' : ''}`}>
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
    <div className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#111827] transition hover:border-white/[0.12]">
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${meta.dot.replace('animate-pulse', '')}`} />

      <div className="flex flex-col gap-4 px-5 py-4 pl-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${meta.badge}`}>
            <StatusIcon size={14} />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold !text-white">
                {booking.theatre?.name ?? 'Theatre'}
              </span>
              <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${meta.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className={`rounded border px-2 py-0.5 font-mono text-[10px] font-bold ${priorityBadge}`}>
                {priorityLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 font-mono">
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock size={10} className="text-slate-600" />
                <span className="font-bold !text-white">{start.time}</span>
                <span className="text-slate-600">{start.date}</span>
              </span>
              <ChevronRight size={10} className="text-slate-700" />
              <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="font-bold !text-slate-300">{end.time}</span>
                <span className="text-slate-600">{end.date}</span>
              </span>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-400">
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
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-300"
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
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#111827] py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
        <CalendarX2 className="h-7 w-7 text-slate-600" />
      </div>
      <p className="text-base font-black !text-white">No theatre bookings</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This procedure hasn't been allocated a theatre slot yet. Create a booking
        to schedule operating time.
      </p>
      <button
        onClick={onCreateRequest}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-teal-400 active:scale-95"
      >
        <Plus size={14} />
        Book Theatre
      </button>
    </div>
  );
}