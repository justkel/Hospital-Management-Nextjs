'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

import {
  ArrowRight,
  Building2,
  CalendarSearch,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Layers3,
  Search,
  Siren,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';

import {
  TheatreBookingPriority,
  TheatreDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

interface TheatreItem {
  id: string;
  name: string;
  code?: string | null;
  floor?: string | null;
  department: string;
  capacity?: number | null;
  isActive: boolean;
}

interface PaginatedResult {
  items: TheatreItem[];
  total: number;
  page: number;
  pageCount: number;
}

const PRIORITY_OPTIONS = [
  {
    value: '',
    label: 'Any Priority',
    icon: Sparkles,
    pill: 'border-slate-200 text-slate-600 bg-white',
    active: 'bg-slate-900 text-white border-slate-900',
  },
  {
    value: TheatreBookingPriority.Elective,
    label: 'Elective',
    icon: CalendarSearch,
    pill: 'border-slate-200 text-slate-600 bg-white',
    active: 'bg-cyan-600 text-white border-cyan-600',
  },
  {
    value: TheatreBookingPriority.Urgent,
    label: 'Urgent',
    icon: Zap,
    pill: 'border-slate-200 text-slate-600 bg-white',
    active: 'bg-amber-500 text-white border-amber-500',
  },
  {
    value: TheatreBookingPriority.Emergency,
    label: 'Emergency',
    icon: Siren,
    pill: 'border-slate-200 text-slate-600 bg-white',
    active: 'bg-rose-600 text-white border-rose-600',
  },
];

const DEPT_LABELS: Record<string, string> = Object.fromEntries(
  Object.values(TheatreDepartment).map((d) => [d, d.replace(/_/g, ' ')]),
);

function getNow(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function getDefaultEnd(): string {
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TheatreAvailabilityClient() {
  const [startTime, setStartTime] = useState(getNow());
  const [endTime, setEndTime] = useState(getDefaultEnd());
  const [priority, setPriority] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const limit = 12;

  const [result, setResult] = useState<PaginatedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const search = useCallback(
    async (p = 1) => {
      setError(null);

      if (!startTime || !endTime) {
        setError('Please set both start and end times.');
        return;
      }
      if (new Date(startTime) >= new Date(endTime)) {
        setError('Start time must be before end time.');
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const params = new URLSearchParams({
          startTime,
          endTime,
          page: String(p),
          limit: String(limit),
        });
        if (priority) params.set('priority', priority);
        if (department) params.set('department', department);

        const res = await clientFetch(
          `/api/theatre/available-for-time-range?${params.toString()}`,
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to fetch available theatres');
        }

        setResult(json.theatres);
        setPage(p);
      } catch (err: any) {
        setError(err.message ?? 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    },
    [startTime, endTime, priority, department, limit],
  );

  const durationMins = startTime && endTime
    ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
    : null;

  const durationLabel = durationMins != null && durationMins > 0
    ? durationMins < 60
      ? `${durationMins}m window`
      : `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''} window`.trim()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="relative overflow-hidden rounded-[2rem] border border-violet-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/70 via-white to-cyan-50/50" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-700">
                  <CalendarSearch className="h-3.5 w-3.5" />
                  Availability Search
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  Find Available Theatres
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-500">
                  Search for operating theatres with open scheduling windows for a
                  specific time range, priority level, and department.
                </p>
              </div>

              {result && (
                <div className="flex flex-wrap gap-3">
                  <Chip label="Results" value={result.total} color="violet" />
                  <Chip label="Page" value={`${result.page} / ${result.pageCount || 1}`} color="cyan" />
                  {durationLabel && (
                    <Chip label="Window" value={durationLabel} color="slate" isText />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                <Filter className="h-4 w-4 text-violet-700" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Search Filters</h2>
                <p className="text-xs text-slate-500">Set your criteria and find open theatres</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Time Window
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FieldBox label="Start Date & Time">
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                  />
                </FieldBox>

                <FieldBox label="End Date & Time">
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                    />
                    {durationLabel && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700">
                        {durationLabel}
                      </span>
                    )}
                  </div>
                </FieldBox>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Booking Priority
              </p>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = priority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition active:scale-95 ${
                        selected ? `${opt.active} !text-white` : `${opt.pill} hover:border-slate-300`
                      }`}
                    >
                      <Icon size={12} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <p className="mb-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Department
                </p>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">All Departments</option>
                  {Object.values(TheatreDepartment).map((d) => (
                    <option key={d} value={d}>
                      {DEPT_LABELS[d]}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => search(1)}
                disabled={loading}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-violet-600 px-8 py-3 text-sm font-bold !text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60 active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search size={15} />
                    Search Theatres
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
                <Siren size={15} className="mt-0.5 shrink-0 text-rose-500" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
              </div>
            )}
          </div>
        </div>

        {!searched && !loading && (
          <SearchPrompt />
        )}

        {loading && (
          <LoadingSkeleton count={limit} />
        )}

        {!loading && searched && result && result.items.length === 0 && (
          <NoResults />
        )}

        {!loading && result && result.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((theatre) => (
                <TheatreCard key={theatre.id} theatre={theatre} />
              ))}
            </div>

            {result.pageCount > 1 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => search(page - 1)}
                  disabled={page <= 1 || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-300 hover:text-violet-600 disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: result.pageCount }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === result.pageCount)
                    .reduce<(number | '…')[]>((acc, p, i, arr) => {
                      if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '…' ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-slate-400 text-xs">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => search(p as number)}
                          className={`h-10 w-10 rounded-full text-xs font-bold transition ${
                            p === page
                              ? 'bg-violet-600 text-white shadow-sm'
                              : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600'
                          }`}
                        >
                          {p}
                        </button>
                      ),
                    )}
                </div>

                <button
                  onClick={() => search(page + 1)}
                  disabled={page >= result.pageCount || loading}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-violet-300 hover:text-violet-600 disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TheatreCard({ theatre }: { theatre: TheatreItem }) {
  return (
    <div className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-100/60">
      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
        <CheckCircle2 size={10} className="text-emerald-600" />
        <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700">
          Available
        </span>
      </div>

      <div className="px-5 pb-5 pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50">
            <Building2 size={20} className="text-violet-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-black text-slate-900">
              {theatre.name}
            </p>
            <p className="text-[11px] font-mono text-slate-400">
              {theatre.code ?? 'No code'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <MetaPill
            icon={<Layers3 size={10} />}
            label={theatre.floor ? `Floor ${theatre.floor}` : 'Floor —'}
            color="slate"
          />
          <MetaPill
            icon={<Users size={10} />}
            label={theatre.capacity ? `Cap. ${theatre.capacity}` : 'Cap. —'}
            color="cyan"
          />
          <MetaPill
            icon={<Sparkles size={10} />}
            label={theatre.department.replace(/_/g, ' ')}
            color="violet"
          />
        </div>

        <Link
          href={`/dashboard/theatres/${theatre.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 py-2.5 text-xs font-bold text-violet-700 transition hover:bg-violet-100 active:scale-95"
        >
          View Theatre
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function MetaPill({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: 'slate' | 'cyan' | 'violet';
}) {
  const c = {
    slate: 'bg-slate-50 border-slate-200 text-slate-600',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
  }[color];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${c}`}>
      {icon}
      {label}
    </span>
  );
}

function FieldBox({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  label,
  value,
  color,
  isText,
}: {
  label: string;
  value: number | string;
  color: 'violet' | 'cyan' | 'slate';
  isText?: boolean;
}) {
  const palette = {
    violet: 'bg-violet-50 border-violet-200 text-violet-700',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    slate: 'bg-slate-50 border-slate-200 text-slate-600',
  }[color];

  return (
    <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 ${palette}`}>
      {!isText && (
        <span className="text-2xl font-black leading-none">{value}</span>
      )}
      {isText && (
        <span className="text-sm font-black leading-none">{value}</span>
      )}
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50">
        <CalendarSearch className="h-8 w-8 text-violet-400" />
      </div>
      <p className="text-lg font-black text-slate-800">Set your window</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        Choose a date/time range and hit Search to see which theatres have open
        availability slots with no active blocks.
      </p>
    </div>
  );
}

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50">
        <Clock className="h-8 w-8 text-slate-400" />
      </div>
      <p className="text-lg font-black text-slate-800">No theatres available</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        No theatres match your time window and filters. Try adjusting the range,
        priority, or department.
      </p>
    </div>
  );
}

function LoadingSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count > 6 ? 6 : count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white"
        >
          <div className="h-[3px] w-full animate-pulse bg-gradient-to-r from-violet-200 to-cyan-200" />
          <div className="space-y-3 p-5">
            <div className="flex gap-3">
              <div className="h-11 w-11 animate-pulse rounded-2xl bg-slate-100" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
                <div className="h-2 w-1/2 animate-pulse rounded-full bg-slate-100" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
            </div>
            <div className="h-9 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}