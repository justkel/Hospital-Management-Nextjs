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
  bookingDisabled: boolean;
  onCreateRequest: () => void;
  onManageRequest: (booking: Booking) => void;
}

const PRIORITY_BADGE: Record<TheatreBookingPriority, string> = {
  [TheatreBookingPriority.Elective]: 'border-[#E8E6E0] text-[#767570] bg-[#F7F7F5]',
  [TheatreBookingPriority.Urgent]: 'border-[#F5E3C0] text-[#B9770E] bg-[#FFF8EC]',
  [TheatreBookingPriority.Emergency]: 'border-[#FBD5D5] text-[#DC2626] bg-[#FEF2F2]',
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
  bookingDisabled,
}: Props) {
  const hasBookings = bookings.length > 0;
  const active = bookings.filter((b) => !TERMINAL_STATUSES.includes(b.status));
  const terminal = bookings.filter((b) => TERMINAL_STATUSES.includes(b.status));

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
        <p className="font-mono text-xs !text-[#B4B2A9]">
          {hasBookings
            ? `${bookings.length} booking${bookings.length !== 1 ? 's' : ''} on record`
            : 'No bookings recorded'}
        </p>
        {bookingDisabled ? (
          <div className="group relative">
            <button
              disabled
              className="inline-flex h-10 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 text-xs font-semibold !text-[#1D9E75]/60 xs:w-auto"
            >
              <CheckCircle2 size={13} />
              Procedure Completed
            </button>

            <p className="mt-2 text-right text-[11px] !text-[#B4B2A9]">
              Theatre booking is locked because this procedure has been completed.
            </p>
          </div>
        ) : (
          <button
            onClick={onCreateRequest}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 text-xs font-semibold !text-white transition hover:!bg-[#16211B]"
          >
            <Plus size={13} strokeWidth={2.75} />
            Book Theatre
          </button>
        )}
      </div>

      {!hasBookings ? (
        <Empty onCreateRequest={onCreateRequest} bookingDisabled={bookingDisabled} />
      ) : (
        <div className="space-y-6 sm:space-y-7">
          {active.length > 0 && (
            <Group
              label="Active"
              dot="!bg-[#1D9E75]"
              bookings={active}
              onManage={onManageRequest}
            />
          )}
          {terminal.length > 0 && (
            <Group
              label="History"
              dot="!bg-[#B4B2A9]"
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
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
          {label}
        </span>
        <span className="rounded-full border !border-[#E8E6E0] !bg-[#F7F7F5] px-2 py-0.5 font-mono text-[10px] font-semibold !text-[#767570]">
          {bookings.length}
        </span>
      </div>

      <div className={`space-y-2.5 ${dimmed ? 'opacity-80' : ''}`}>
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
    <div className="rounded-xl border !border-[#E8E6E0] !bg-white transition hover:!bg-[#FAFAF8]">
      <div className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-start gap-3.5 sm:gap-4">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${meta.badge}`}>
            <StatusIcon size={15} />
          </div>

          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold !text-[#16211B]">
                {booking.theatre?.name ?? 'Theatre'}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${meta.badge}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${priorityBadge}`}>
                {priorityLabel}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono">
              <span className="flex items-center gap-1.5 text-[11px] !text-[#767570]">
                <Clock size={10} className="!text-[#B4B2A9]" />
                <span className="font-semibold !text-[#16211B]">{start.time}</span>
                <span className="!text-[#B4B2A9]">{start.date}</span>
              </span>
              <ChevronRight size={10} className="!text-[#D3D1C7]" />
              <span className="flex items-center gap-1.5 text-[11px] !text-[#767570]">
                <span className="font-semibold !text-[#16211B]">{end.time}</span>
                <span className="!text-[#B4B2A9]">{end.date}</span>
              </span>
              <span className="rounded-md !bg-[#F7F7F5] px-2 py-0.5 text-[10px] font-semibold !text-[#767570]">
                {dur}
              </span>
            </div>

            {(booking.notes || booking.delayReason || booking.cancellationReason) && (
              <p className="max-w-lg text-[11px] leading-relaxed !text-[#767570]">
                {booking.cancellationReason ?? booking.delayReason ?? booking.notes}
              </p>
            )}
          </div>
        </div>

        {!isTerminal && (
          <button
            onClick={onManage}
            className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-lg border !border-[#E8E6E0] !bg-white px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!border-[#CFF0E1] hover:!bg-[#ECFBF5] hover:!text-[#1D9E75]"
          >
            <Settings2 size={12} />
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

function Empty({ onCreateRequest, bookingDisabled }: { onCreateRequest: () => void; bookingDisabled: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed !border-[#E8E6E0] !bg-white py-16 text-center sm:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl !bg-[#F7F7F5]">
        <CalendarX2 className="h-6 w-6 !text-[#B4B2A9]" />
      </div>
      <p className="text-base font-semibold !text-[#16211B]">No theatre bookings</p>
      <p className="mt-1.5 max-w-sm px-6 text-sm !text-[#767570]">
        This procedure hasn&apos;t been allocated a theatre slot yet. Create a
        booking to schedule operating time.
      </p>
      <button
        onClick={onCreateRequest}
        disabled={bookingDisabled}
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl !bg-[#0c1a12] px-5 text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus size={14} strokeWidth={2.75} />
        Book Theatre
      </button>
    </div>
  );
}