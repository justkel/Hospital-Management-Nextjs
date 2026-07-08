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
  GetVisitProcedureByIdQuery,
  TheatreBookingStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import TheatreBookingTimeline from './TheatreBookingTimeline';
import TheatreBookingCreateForm from './TheatreBookingCreateForm';
import TheatreBookingActionPanel from './TheatreBookingActionPanel';

export type Booking =
  GetProcedureTheatreBookingsQuery['getProcedureTheatreBookings'][number];
export type Procedure = GetVisitProcedureByIdQuery['visitProcedureById'];

type View = 'timeline' | 'create' | 'action';

interface Props {
  procedure: Procedure;
  initialBookings: Booking[];
}

export const STATUS_META: Record<
  TheatreBookingStatus,
  { label: string; dot: string; badge: string; text: string }
> = {
  [TheatreBookingStatus.Scheduled]: {
    label: 'Scheduled',
    dot: 'bg-sky-400',
    badge: 'bg-sky-950 border-sky-700 text-sky-300',
    text: 'text-sky-300',
  },
  [TheatreBookingStatus.Ready]: {
    label: 'Ready',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-950 border-emerald-700 text-emerald-300',
    text: 'text-emerald-300',
  },
  [TheatreBookingStatus.InProgress]: {
    label: 'In Progress',
    dot: 'bg-amber-400 animate-pulse',
    badge: 'bg-amber-950 border-amber-600 text-amber-300',
    text: 'text-amber-300',
  },
  [TheatreBookingStatus.Delayed]: {
    label: 'Delayed',
    dot: 'bg-orange-400',
    badge: 'bg-orange-950 border-orange-700 text-orange-300',
    text: 'text-orange-300',
  },
  [TheatreBookingStatus.Completed]: {
    label: 'Completed',
    dot: 'bg-teal-400',
    badge: 'bg-teal-950 border-teal-700 text-teal-300',
    text: 'text-teal-300',
  },
  [TheatreBookingStatus.Cancelled]: {
    label: 'Cancelled',
    dot: 'bg-slate-500',
    badge: 'bg-slate-900 border-slate-600 text-slate-400',
    text: 'text-slate-400',
  },
  [TheatreBookingStatus.Aborted]: {
    label: 'Aborted',
    dot: 'bg-rose-500',
    badge: 'bg-rose-950 border-rose-700 text-rose-300',
    text: 'text-rose-400',
  },
  [TheatreBookingStatus.PendingReallocation]: {
    label: 'Pending Reallocation',
    dot: 'bg-violet-400',
    badge: 'bg-violet-950 border-violet-700 text-violet-300',
    text: 'text-violet-300',
  },
  [TheatreBookingStatus.Postponed]: {
    label: 'Postponed',
    dot: 'bg-indigo-400',
    badge: 'bg-indigo-950 border-indigo-700 text-indigo-300',
    text: 'text-indigo-300',
  },
};

export default function TheatreBookingWorkspace({ procedure, initialBookings }: Props) {
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

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827]">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)',
          }}
        />
        <div className="absolute -top-24 left-1/4 h-48 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative px-6 py-6 sm:px-8 sm:py-7">
          <Link
            href={`/dashboard/visit-procedures/${procedure.id}`}
            className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/10 !hover:text-white"
          >
            <ArrowLeft size={12} />
            Back to Procedure
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20">
                  <Stethoscope className="h-3.5 w-3.5 text-teal-400" />
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400">
                  Theatre Booking Console
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight !text-white sm:text-3xl">
                {(procedure as any).name ?? `Procedure ${procedure.id.slice(0, 8)}`}
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Manage theatre allocations, scheduling, delays, and status transitions
                for this procedure.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <StatPill
                icon={<Calendar size={12} />}
                label="Total"
                value={totalBookings}
                accent="slate"
              />
              <StatPill
                icon={<Activity size={12} />}
                label="Completed"
                value={completedCount}
                accent="teal"
              />
              {activeBooking && (
                <StatPill
                  icon={<CircleDot size={12} className="animate-pulse" />}
                  label={STATUS_META[activeBooking.status]?.label ?? 'Active'}
                  value={activeBooking.theatre?.name ?? '—'}
                  accent="amber"
                  isText
                />
              )}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1 rounded-xl border border-white/[0.07] bg-black/30 p-1 w-fit">
            <ConsoleTab
              active={view === 'timeline'}
              onClick={() => { setView('timeline'); setSelectedBooking(null); }}
              label="Booking History"
            />
            <ConsoleTab
              active={view === 'create'}
              onClick={() => { setView('create'); setSelectedBooking(null); }}
              label="New Booking"
              accent
            />
            {view === 'action' && selectedBooking && (
              <ConsoleTab
                active
                onClick={() => {}}
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
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/10 !hover:text-white disabled:opacity-40"
        >
          <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {view === 'timeline' && (
        <TheatreBookingTimeline
          bookings={bookings}
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
    slate: 'border-white/10 bg-white/5 text-slate-300',
    teal: 'border-teal-700/50 bg-teal-950/60 text-teal-300',
    amber: 'border-amber-700/50 bg-amber-950/60 text-amber-300',
  };
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${colors[accent]}`}>
      {icon}
      {isText ? (
        <span className="max-w-[120px] truncate text-xs font-bold">{value}</span>
      ) : (
        <span className="text-lg font-black leading-none tabular-nums">{value}</span>
      )}
      <span className="text-[10px] font-semibold uppercase tracking-wide opacity-60">{label}</span>
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
        className={`rounded-lg px-4 py-1.5 text-xs font-bold transition ${
          accent
            ? 'bg-teal-500 text-black'
            : 'bg-white/10 !text-white'
        }`}
      >
        {label}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-1.5 text-xs font-medium transition ${
        accent
          ? 'text-teal-400 hover:bg-teal-500/10'
          : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
      }`}
    >
      {label}
    </button>
  );
}