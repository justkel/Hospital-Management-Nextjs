'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

import {
  Activity,
  ArrowLeft,
  Calendar,
  CircleDot,
  RefreshCw,
  Stethoscope,
} from 'lucide-react';

import {
  GetProcedureTheatreBookingsQuery,
  GetTheatresQuery,
  GetVisitProcedureByIdQuery,
  TheatreBookingStatus,
  VisitProcedure,
  VisitProcedureEventType,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import TheatreBookingTimeline from './TheatreBookingTimeline';
import TheatreBookingCreateForm from './TheatreBookingCreateForm';
import TheatreBookingActionPanel from './TheatreBookingActionPanel';

export type Booking =
  GetProcedureTheatreBookingsQuery['getProcedureTheatreBookings'][number];
export type Procedure = GetVisitProcedureByIdQuery['visitProcedureById'];
type Theatre =
  GetTheatresQuery['theatres']['items'][number];

type View = 'timeline' | 'create' | 'action';

interface Props {
  procedure: Procedure;
  initialBookings: Booking[];
  theatres: Theatre[];
}

export const STATUS_META: Record<
  TheatreBookingStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  [TheatreBookingStatus.Scheduled]: {
    label: 'Scheduled',
    dot: 'bg-[#1D6FE0]',
    badge: 'bg-[#EFF5FF] border-[#D6E4FB] text-[#1D6FE0]',
    text: 'text-[#1D6FE0]',
  },
  [TheatreBookingStatus.Ready]: {
    label: 'Ready',
    dot: 'bg-[#1D9E75]',
    badge: 'bg-[#ECFBF5] border-[#CFF0E1] text-[#1D9E75]',
    text: 'text-[#1D9E75]',
  },
  [TheatreBookingStatus.InProgress]: {
    label: 'In Progress',
    dot: 'bg-[#D08A2E] animate-pulse',
    badge: 'bg-[#FFF8EC] border-[#F5E3C0] text-[#B9770E]',
    text: 'text-[#B9770E]',
  },
  [TheatreBookingStatus.Delayed]: {
    label: 'Delayed',
    dot: 'bg-[#EA6C2E]',
    badge: 'bg-[#FFF1E9] border-[#FAD9C4] text-[#C2571C]',
    text: 'text-[#C2571C]',
  },
  [TheatreBookingStatus.Completed]: {
    label: 'Completed',
    dot: 'bg-[#0F9B8E]',
    badge: 'bg-[#ECFAF8] border-[#CDEEE9] text-[#0F9B8E]',
    text: 'text-[#0F9B8E]',
  },
  [TheatreBookingStatus.Cancelled]: {
    label: 'Cancelled',
    dot: 'bg-[#B4B2A9]',
    badge: 'bg-[#F7F7F5] border-[#E8E6E0] text-[#767570]',
    text: 'text-[#767570]',
  },
  [TheatreBookingStatus.Aborted]: {
    label: 'Aborted',
    dot: 'bg-[#DC2626]',
    badge: 'bg-[#FEF2F2] border-[#FBD5D5] text-[#DC2626]',
    text: 'text-[#DC2626]',
  },
  [TheatreBookingStatus.PendingReallocation]: {
    label: 'Pending Reallocation',
    dot: 'bg-[#7C5CFC]',
    badge: 'bg-[#F5F2FF] border-[#E5DCFC] text-[#7C5CFC]',
    text: 'text-[#7C5CFC]',
  },
  [TheatreBookingStatus.Postponed]: {
    label: 'Postponed',
    dot: 'bg-[#4F63D2]',
    badge: 'bg-[#EEF1FD] border-[#DBE2FA] text-[#4F63D2]',
    text: 'text-[#4F63D2]',
  },
};

export default function TheatreBookingWorkspace({ procedure, initialBookings, theatres }: Props) {
  const [view, setView] = useState<View>('timeline');
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await clientFetch(
        `/api/theatre/by-procedure?procedureId=${procedure!.id}`,
      );
      const json = await res.json();
      if (json.theatreBookings) {
        setBookings(json.theatreBookings);
      }
    } finally {
      setRefreshing(false);
    }
  }, [procedure]);

  const handleCreated = useCallback(async () => {
    await refresh();
    setView('timeline');
  }, [refresh]);

  const handleActionDone = useCallback(async () => {
    await refresh();
    setSelectedBooking(null);
    setView('timeline');
  }, [refresh]);

  const openAction = useCallback((booking: Booking) => {
    setSelectedBooking(booking);
    setView('action');
  }, []);

  if (!procedure) return null;

  const activeBooking = bookings.find(
    (b) =>
      b.status === TheatreBookingStatus.InProgress ||
      b.status === TheatreBookingStatus.Scheduled ||
      b.status === TheatreBookingStatus.Ready,
  );
  const totalBookings = bookings.length;
  const completedCount = bookings.filter(
    (b) => b.status === TheatreBookingStatus.Completed,
  ).length;

  const procedureCompleted =
    bookings[0]?.procedure?.events?.some(
      (event) => event.type === VisitProcedureEventType.Completed,
    ) ?? false;

  const bookingCompleted = bookings.some(
    (booking) => booking.status === TheatreBookingStatus.Completed,
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <header className="relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <svg
          viewBox="0 0 1000 120"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full opacity-[0.06] sm:h-20"
        >
          <path
            d="M0,60 L160,60 L185,60 L200,20 L220,100 L240,60 L260,60 L420,60 L445,60 L460,15 L480,105 L500,60 L520,60 L680,60 L705,60 L720,25 L740,95 L760,60 L780,60 L1000,60"
            fill="none"
            stroke="#1D9E75"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative p-5 sm:p-8">
          <Link
            href={`/dashboard/visit-procedures/${procedure.id}`}
            className="mb-5 inline-flex items-center gap-1.5 rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-1.5 text-xs font-medium !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
          >
            <ArrowLeft size={12} />
            Back to procedure
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md !bg-[#ECFBF5]">
                  <Stethoscope size={12} className="!text-[#1D9E75]" />
                </span>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                  Theatre Booking
                </p>
              </div>

              <h1 className="mt-3 text-[22px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[28px]">
                {(procedure as VisitProcedure).customProcedureName ?? `Procedure ${procedure.id.slice(0, 8)}`}
              </h1>

              <p className="mt-2 text-sm leading-relaxed !text-[#767570]">
                Manage theatre allocations, scheduling, delays, and status
                transitions for this procedure.
              </p>
            </div>

            <div
              className={`grid divide-x !divide-[#E8E6E0] overflow-hidden rounded-xl border !border-[#E8E6E0] ${
                activeBooking ? 'grid-cols-3' : 'grid-cols-2'
              }`}
            >
              <div className="min-w-[92px] p-3.5">
                <div className="flex items-center gap-1.5">
                  <Calendar size={11} className="!text-[#B4B2A9]" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    Total
                  </p>
                </div>
                <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                  {String(totalBookings).padStart(2, '0')}
                </p>
              </div>

              <div className="min-w-[92px] p-3.5">
                <div className="flex items-center gap-1.5">
                  <Activity size={11} className="!text-[#B4B2A9]" />
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    Completed
                  </p>
                </div>
                <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                  {String(completedCount).padStart(2, '0')}
                </p>
              </div>

              {activeBooking && (
                <div className="min-w-[110px] p-3.5">
                  <div className="flex items-center gap-1.5">
                    <CircleDot size={11} className="!text-[#1D9E75]" />
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                      {STATUS_META[activeBooking.status]?.label ?? 'Active'}
                    </p>
                  </div>
                  <p className="mt-1.5 truncate text-sm font-semibold !text-[#16211B]">
                    {activeBooking.theatre?.name ?? '—'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex w-full items-center gap-1 overflow-x-auto rounded-xl border !border-[#E8E6E0] !bg-[#F7F7F5] p-1 sm:w-fit">
            <ConsoleTab
              active={view === 'timeline'}
              onClick={() => { setView('timeline'); setSelectedBooking(null); }}
              label="Booking History"
            />
            {!bookingCompleted && (
              <ConsoleTab
                active={view === 'create'}
                onClick={() => { setView('create'); setSelectedBooking(null); }}
                label="New Booking"
                accent
              />
            )}

            {view === 'action' && selectedBooking && (
              <ConsoleTab active onClick={() => {}} label="Manage Booking" />
            )}
          </div>
        </div>
      </header>

      <div className="flex items-center justify-end">
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex h-9 items-center gap-2 rounded-lg border !border-[#E8E6E0] !bg-white px-3.5 text-xs font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {view === 'timeline' && (
        <TheatreBookingTimeline
          bookings={bookings}
          bookingDisabled={procedureCompleted}
          onCreateRequest={() => setView('create')}
          onManageRequest={openAction}
        />
      )}

      {view === 'create' && (
        <TheatreBookingCreateForm
          procedureId={procedure.id}
          onSuccess={handleCreated}
          onCancel={() => setView('timeline')}
        />
      )}

      {view === 'action' && selectedBooking && (
        <TheatreBookingActionPanel
          booking={selectedBooking}
          theatres={theatres}
          onDone={handleActionDone}
          onCancel={() => { setSelectedBooking(null); setView('timeline'); }}
        />
      )}
    </div>
  );
}

function ConsoleTab({
  active,
  onClick,
  label,
  accent = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: boolean;
}) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition !bg-white shadow-sm ${
          accent ? '!text-[#1D9E75]' : '!text-[#16211B]'
        }`}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium !text-[#767570] transition hover:!text-[#16211B]"
    >
      {label}
    </button>
  );
}