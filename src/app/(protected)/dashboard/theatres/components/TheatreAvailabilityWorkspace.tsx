'use client';

import { useState, useCallback } from 'react';

import {
  ArrowLeft,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';

import Link from 'next/link';

import {
  GetTheatreByIdQuery,
  TheatreAvailabilitiesQuery,
  TheatreAvailabilityType,
} from '@/shared/graphql/generated/graphql';

import TheatreAvailabilityBoard from './TheatreAvailabilityBoard';
import TheatreAvailabilitySyncForm from './TheatreAvailabilitySyncForm';
import TheatreAvailabilityWeekCalendar from './TheatreAvailabilityWeekCalendar';
import { clientFetch } from '@/lib/clientFetch';

type Theatre = GetTheatreByIdQuery['theatreById'];
type Availability =
  TheatreAvailabilitiesQuery['theatreAvailabilities'][number];

type View = 'board' | 'calendar' | 'sync';

interface Props {
  theatre: Theatre;
  initialAvailabilities: Availability[];
}

export default function TheatreAvailabilityWorkspace({
  theatre,
  initialAvailabilities,
}: Props) {
  const [view, setView] = useState<View>('board');
  const [availabilities, setAvailabilities] =
    useState<Availability[]>(initialAvailabilities);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await clientFetch(
        `/api/theatre/availabilities?theatreId=${theatre!.id}`,
      );
      const json = await res.json();
      if (json.availabilities) {
        setAvailabilities(json.availabilities);
      }
    } finally {
      setSyncing(false);
    }
  }, [theatre]);

  const handleSyncSuccess = useCallback(
    async () => {
      await refresh();
      setView('board');
    },
    [refresh],
  );

  if (!theatre) return null;

  const totalSlots = availabilities.length;
  const regularCount = availabilities.filter(
    (a) => a.type === TheatreAvailabilityType.Regular,
  ).length;
  const emergencyCount = availabilities.filter(
    (a) => a.type === TheatreAvailabilityType.Emergency,
  ).length;

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/60 via-white to-cyan-50/40" />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px), repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)',
          }}
        />

        <div className="relative px-6 py-6 sm:px-8 sm:py-8">
          <Link
            href={`/dashboard/theatres/${theatre.id}`}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft size={13} />
            Back to Theatre
          </Link>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
                <CalendarDays className="h-3.5 w-3.5" />
                Availability Console
              </div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {theatre.name}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                Configure weekly operating windows, session types, and
                scheduling constraints for this theatre.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatChip
                label="Total slots"
                value={totalSlots}
                color="violet"
              />
              <StatChip
                label="Regular"
                value={regularCount}
                color="cyan"
              />
              <StatChip
                label="Emergency"
                value={emergencyCount}
                color="rose"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 w-fit">
            <TabButton
              active={view === 'board'}
              onClick={() => setView('board')}
              label="Slot Board"
            />
            <TabButton
              active={view === 'calendar'}
              onClick={() => setView('calendar')}
              label="Week View"
            />
            <TabButton
              active={view === 'sync'}
              onClick={() => setView('sync')}
              label="Sync Schedule"
              accent
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={refresh}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
        >
          <RefreshCw
            size={13}
            className={syncing ? 'animate-spin' : ''}
          />
          Refresh
        </button>
      </div>

      {view === 'board' && (
        <TheatreAvailabilityBoard
          availabilities={availabilities}
          onEditRequest={() => setView('sync')}
        />
      )}

      {view === 'calendar' && (
        <TheatreAvailabilityWeekCalendar
          availabilities={availabilities}
        />
      )}

      {view === 'sync' && (
        <TheatreAvailabilitySyncForm
          theatreId={theatre.id}
          currentAvailabilities={availabilities}
          onSuccess={handleSyncSuccess}
          onCancel={() => setView('board')}
        />
      )}
    </div>
  );
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'violet' | 'cyan' | 'rose';
}) {
  const palette = {
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 ${palette[color]}`}
    >
      <span className="text-2xl font-black leading-none">
        {value}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
    </div>
  );
}

function TabButton({
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
        className={`rounded-xl px-5 py-2 text-xs font-bold shadow-sm transition ${
          accent
            ? 'bg-violet-600 !text-white'
            : 'bg-white text-slate-900'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2 text-xs font-semibold transition ${
        accent
          ? 'text-violet-600 hover:bg-violet-50'
          : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );
}