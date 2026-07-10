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
    dot: 'bg-sky-400',
    badge: 'bg-sky-950/70 border-sky-600/40 text-sky-300',
    text: 'text-sky-300',
  },
  [TheatreBookingStatus.Ready]: {
    label: 'Ready',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-950/70 border-emerald-600/40 text-emerald-300',
    text: 'text-emerald-300',
  },
  [TheatreBookingStatus.InProgress]: {
    label: 'In Progress',
    dot: 'bg-amber-400 animate-pulse',
    badge: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
    text: 'text-amber-300',
  },
  [TheatreBookingStatus.Delayed]: {
    label: 'Delayed',
    dot: 'bg-orange-400',
    badge: 'bg-orange-950/70 border-orange-600/40 text-orange-300',
    text: 'text-orange-300',
  },
  [TheatreBookingStatus.Completed]: {
    label: 'Completed',
    dot: 'bg-teal-400',
    badge: 'bg-teal-950/70 border-teal-600/40 text-teal-300',
    text: 'text-teal-300',
  },
  [TheatreBookingStatus.Cancelled]: {
    label: 'Cancelled',
    dot: 'bg-slate-500',
    badge: 'bg-slate-900/70 border-slate-600/40 text-slate-400',
    text: 'text-slate-400',
  },
  [TheatreBookingStatus.Aborted]: {
    label: 'Aborted',
    dot: 'bg-rose-500',
    badge: 'bg-rose-950/70 border-rose-600/40 text-rose-300',
    text: 'text-rose-400',
  },
  [TheatreBookingStatus.PendingReallocation]: {
    label: 'Pending Reallocation',
    dot: 'bg-violet-400',
    badge: 'bg-violet-950/70 border-violet-600/40 text-violet-300',
    text: 'text-violet-300',
  },
  [TheatreBookingStatus.Postponed]: {
    label: 'Postponed',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-950/70 border-indigo-600/40 text-indigo-300',
    text: 'text-indigo-300',
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
    <div className="space-y-5 sm:space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-gradient-to-b from-[#0D1220] to-[#0A0E17] shadow-[0_20px_60px_-25px_rgba(0,0,0,0.8)]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-1/4 h-64 w-[32rem] rounded-full bg-teal-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-64 w-96 rounded-full bg-sky-500/[0.06] blur-[100px]" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-[0.35] sm:h-28">
          <svg
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0,60 L160,60 L185,60 L200,20 L220,100 L240,60 L260,60 L420,60 L445,60 L460,15 L480,105 L500,60 L520,60 L680,60 L705,60 L720,25 L740,95 L760,60 L780,60 L1000,60"
              fill="none"
              stroke="#2DD4BF"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="ecg-trace"
            />
          </svg>
        </div>
        <style jsx>{`
          .ecg-trace {
            stroke-dasharray: 22 14;
            animation: ecgDash 2.6s linear infinite;
          }
          @keyframes ecgDash {
            to {
              stroke-dashoffset: -720;
            }
          }
        `}</style>

        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <Link
            href={`/dashboard/visit-procedures/${procedure.id}`}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-400 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 hover:!text-white"
          >
            <ArrowLeft size={12} />
            Back to Procedure
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400/25 to-teal-600/10 ring-1 ring-teal-500/30">
                  <Stethoscope className="h-4 w-4 text-teal-400" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-teal-400">
                  Theatre Booking Console
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight !text-white sm:text-3xl">
                {(procedure as VisitProcedure).customProcedureName ?? `Procedure ${procedure.id.slice(0, 8)}`}
              </h1>

              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
                Manage theatre allocations, scheduling, delays, and status transitions
                for this procedure.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              <StatPill
                icon={<Calendar size={13} />}
                label="Total"
                value={totalBookings}
                accent="slate"
              />
              <StatPill
                icon={<Activity size={13} />}
                label="Completed"
                value={completedCount}
                accent="teal"
              />
              {activeBooking && (
                <StatPill
                  icon={<CircleDot size={13} className="animate-pulse" />}
                  label={STATUS_META[activeBooking.status]?.label ?? 'Active'}
                  value={activeBooking.theatre?.name ?? '—'}
                  accent="amber"
                  isText
                />
              )}
            </div>
          </div>

          <div className="mt-7 flex w-full items-center gap-1 overflow-x-auto scrollbar-hide rounded-2xl border border-white/[0.08] bg-black/30 p-1 backdrop-blur-sm sm:w-fit">
            <ConsoleTab
              active={view === 'timeline'}
              onClick={() => { setView('timeline'); setSelectedBooking(null); }}
              label="Booking History"
            />
            {!bookingCompleted && <ConsoleTab
              active={view === 'create'}
              onClick={() => { setView('create'); setSelectedBooking(null); }}
              label="New Booking"
              accent
            />}

            {view === 'action' && selectedBooking && (
              <ConsoleTab
                active
                onClick={() => { }}
                label="Manage Booking"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          onClick={refresh}
          disabled={refreshing}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-xs font-medium !text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:!text-white disabled:opacity-40"
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

function StatPill({
  icon,
  label,
  value,
  accent,
  isText,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: 'slate' | 'teal' | 'amber';
  isText?: boolean;
}) {
  const colors = {
    slate: 'border-white/10 bg-white/[0.04] text-slate-300',
    teal: 'border-teal-600/40 bg-teal-950/50 text-teal-300',
    amber: 'border-amber-600/40 bg-amber-950/50 text-amber-300',
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 backdrop-blur-sm transition ${colors[accent]}`}>
      <span className="opacity-90">{icon}</span>
      {isText ? (
        <span className="max-w-[110px] truncate text-xs font-bold !text-white sm:max-w-[140px]">{value}</span>
      ) : (
        <span className="text-lg font-black leading-none tabular-nums !text-white">{value}</span>
      )}
      <span className="hidden text-[10px] font-semibold uppercase tracking-wide opacity-60 xs:inline sm:inline">{label}</span>
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
        className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition ${accent
          ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-black shadow-[0_4px_16px_-4px_rgba(45,212,191,0.6)]'
          : 'bg-white/[0.09] !text-white shadow-inner'
          }`}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition !text-white ${accent
        ? ' hover:bg-teal-500/10'
        : 'hover:bg-white/5 hover:text-slate-300'
        }`}
    >
      {label}
    </button>
  );
}