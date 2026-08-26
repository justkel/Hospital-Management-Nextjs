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
    label: 'Any priority',
    icon: Sparkles,
    active: '!border-[#16211B] !bg-[#F7F7F5] !text-[#16211B]',
  },
  {
    value: TheatreBookingPriority.Elective,
    label: 'Elective',
    icon: CalendarSearch,
    active: '!border-[#16211B] !bg-[#F7F7F5] !text-[#16211B]',
  },
  {
    value: TheatreBookingPriority.Urgent,
    label: 'Urgent',
    icon: Zap,
    active: '!border-[#F5E3C0] !bg-[#FFF8EC] !text-[#B9770E]',
  },
  {
    value: TheatreBookingPriority.Emergency,
    label: 'Emergency',
    icon: Siren,
    active: '!border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626]',
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
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong',
        );
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
      ? `${durationMins}m`
      : `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''}`.trim()
    : null;

  return (
    <div className="min-h-screen !bg-[#FAFAF8] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

        <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                    Availability Search
                  </p>
                </div>

                <h1 className="mt-3 text-[26px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[32px]">
                  Find available theatres
                </h1>

                <p className="mt-2.5 text-sm leading-relaxed !text-[#767570]">
                  Search for operating theatres with open scheduling windows
                  for a specific time range, priority level, and department.
                </p>
              </div>

              {result && (
                <div className="flex divide-x !divide-[#E8E6E0] overflow-hidden rounded-xl border !border-[#E8E6E0]">
                  <div className="min-w-[84px] p-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">Results</p>
                    <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                      {String(result.total).padStart(2, '0')}
                    </p>
                  </div>
                  <div className="min-w-[84px] p-3.5">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">Page</p>
                    <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                      {result.page}/{result.pageCount || 1}
                    </p>
                  </div>
                  {durationLabel && (
                    <div className="min-w-[84px] p-3.5">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">Window</p>
                      <p className="mt-1.5 text-sm font-semibold !text-[#16211B]">{durationLabel}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg !bg-[#ECFBF5]">
                <Filter className="h-4 w-4 !text-[#1D9E75]" />
              </div>
              <div>
                <h2 className="text-sm font-semibold !text-[#16211B]">Search filters</h2>
                <p className="text-xs !text-[#767570]">Set your criteria and find open theatres</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Time window
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FieldBox label="Start date & time">
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                  />
                </FieldBox>

                <FieldBox label="End date & time">
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                    />
                    {durationLabel && (
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-full !bg-[#ECFBF5] px-2 py-0.5 text-[10px] font-semibold !text-[#1D9E75]">
                        {durationLabel}
                      </span>
                    )}
                  </div>
                </FieldBox>
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Booking priority
              </p>
              <div className="flex flex-wrap gap-2">
                {PRIORITY_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = priority === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setPriority(opt.value)}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${selected ? opt.active : '!border-[#E8E6E0] !bg-white !text-[#767570] hover:!bg-[#F7F7F5]'
                        }`}
                    >
                      <Icon size={12} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Department
                </p>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                >
                  <option value="">All departments</option>
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
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-6 text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                    Searching…
                  </>
                ) : (
                  <>
                    <Search size={14} />
                    Search theatres
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
                <Siren size={14} className="mt-0.5 shrink-0 !text-[#DC2626]" />
                <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
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
              <div className="flex items-center justify-center gap-1.5 overflow-x-auto pt-2">
                <button
                  onClick={() => search(page - 1)}
                  disabled={page <= 1 || loading}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
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
                        <span key={`ellipsis-${i}`} className="px-1 text-xs !text-[#B4B2A9]">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => search(p as number)}
                          className={`h-9 w-9 shrink-0 rounded-lg text-xs font-semibold transition ${p === page
                            ? '!bg-[#0c1a12] !text-white'
                            : 'border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] hover:!bg-[#F7F7F5]'
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
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                >
                  <ChevronRight size={15} />
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
    <div className="group relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition hover:!border-[#CFF0E1]">
      <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-2.5 py-1">
        <CheckCircle2 size={10} className="!text-[#1D9E75]" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#1D9E75]">
          Available
        </span>
      </div>

      <div className="px-5 pb-5 pt-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5]">
            <Building2 size={18} className="!text-[#5F5E5A]" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold !text-[#16211B]">
              {theatre.name}
            </p>
            <p className="font-mono text-[11px] !text-[#B4B2A9]">
              {theatre.code ?? 'No code'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <MetaPill
            icon={<Layers3 size={10} />}
            label={theatre.floor ? `Floor ${theatre.floor}` : 'Floor —'}
          />
          <MetaPill
            icon={<Users size={10} />}
            label={theatre.capacity ? `Cap. ${theatre.capacity}` : 'Cap. —'}
          />
          <MetaPill
            icon={<Sparkles size={10} />}
            label={theatre.department.replace(/_/g, ' ')}
          />
        </div>

        <Link
          href={`/dashboard/theatres/${theatre.id}`}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white py-2.5 text-xs font-semibold !text-[#5F5E5A] transition hover:!border-[#CFF0E1] hover:!bg-[#ECFBF5] hover:!text-[#1D9E75]"
        >
          View theatre
          <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

function MetaPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-[#FAFAF8] px-2.5 py-1 text-[10px] font-medium !text-[#767570]">
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
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>
      {children}
    </div>
  );
}

function SearchPrompt() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed !border-[#E8E6E0] !bg-white py-16 text-center sm:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl !bg-[#F7F7F5]">
        <CalendarSearch className="h-6 w-6 !text-[#B4B2A9]" />
      </div>
      <p className="text-base font-semibold !text-[#16211B]">Set your window</p>
      <p className="mt-1.5 max-w-sm px-6 text-sm !text-[#767570]">
        Choose a date/time range and search to see which theatres have open
        availability with no active blocks.
      </p>
    </div>
  );
}

function NoResults() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed !border-[#E8E6E0] !bg-white py-16 text-center sm:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl !bg-[#F7F7F5]">
        <Clock className="h-6 w-6 !text-[#B4B2A9]" />
      </div>
      <p className="text-base font-semibold !text-[#16211B]">No theatres available</p>
      <p className="mt-1.5 max-w-sm px-6 text-sm !text-[#767570]">
        No theatres match your time window and filters. Try adjusting the
        range, priority, or department.
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
          className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white"
        >
          <div className="space-y-3 p-5">
            <div className="flex gap-3">
              <div className="h-10 w-10 animate-pulse rounded-xl !bg-[#F7F7F5]" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-3/4 animate-pulse rounded-full !bg-[#F7F7F5]" />
                <div className="h-2 w-1/2 animate-pulse rounded-full !bg-[#F7F7F5]" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-20 animate-pulse rounded-full !bg-[#F7F7F5]" />
              <div className="h-6 w-16 animate-pulse rounded-full !bg-[#F7F7F5]" />
              <div className="h-6 w-24 animate-pulse rounded-full !bg-[#F7F7F5]" />
            </div>
            <div className="h-9 w-full animate-pulse rounded-xl !bg-[#F7F7F5]" />
          </div>
        </div>
      ))}
    </div>
  );
}