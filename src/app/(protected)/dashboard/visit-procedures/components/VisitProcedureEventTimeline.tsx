'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Ban,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  FileText,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Sparkles,
  TimerReset,
} from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';
import {
  GetVisitProcedureEventsQuery,
} from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';

type EventItem =
  GetVisitProcedureEventsQuery['visitProcedureEvents']['items'][number];

type Props = {
  procedureId: string;
  refreshKey?: number;
  initialData?: GetVisitProcedureEventsQuery['visitProcedureEvents'];
};

const EVENT_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    pill: string;
    dot: string;
    label: string;
  }
> = {
  ORDERED: {
    icon: Sparkles,
    pill: 'bg-teal-50 border-teal-300 text-teal-800',
    dot: 'bg-teal-500',
    label: 'Ordered',
  },
  STARTED: {
    icon: PlayCircle,
    pill: 'bg-blue-50 border-blue-300 text-blue-800',
    dot: 'bg-blue-500',
    label: 'Started',
  },
  STEP_COMPLETED: {
    icon: CheckCircle2,
    pill: 'bg-green-50 border-green-300 text-green-800',
    dot: 'bg-green-600',
    label: 'Step Completed',
  },
  NOTE: {
    icon: FileText,
    pill: 'bg-violet-50 border-violet-300 text-violet-800',
    dot: 'bg-violet-500',
    label: 'Note',
  },
  PAUSED: {
    icon: PauseCircle,
    pill: 'bg-amber-50 border-amber-300 text-amber-800',
    dot: 'bg-amber-500',
    label: 'Paused',
  },
  RESUMED: {
    icon: Activity,
    pill: 'bg-indigo-50 border-indigo-300 text-indigo-800',
    dot: 'bg-indigo-500',
    label: 'Resumed',
  },
  COMPLETED: {
    icon: CheckCircle2,
    pill: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    dot: 'bg-emerald-600',
    label: 'Completed',
  },
  CANCELLED: {
    icon: Ban,
    pill: 'bg-red-50 border-red-300 text-red-800',
    dot: 'bg-red-500',
    label: 'Cancelled',
  },
  COMPLICATION: {
    icon: ShieldAlert,
    pill: 'bg-orange-50 border-orange-300 text-orange-800',
    dot: 'bg-orange-500',
    label: 'Complication',
  },
};

const DEFAULT_CONFIG = {
  icon: TimerReset,
  pill: 'bg-slate-50 border-slate-300 text-slate-700',
  dot: 'bg-slate-400',
  label: '',
};

const PAGE_SIZE_OPTIONS = [5, 10, 25];

function StatCard({ num, label }: { num: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 text-center">
      <p className="font-mono text-lg font-semibold leading-none text-slate-900">
        {num}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wide !text-slate-400">
        {label}
      </p>
    </div>
  );
}

function DayDivider({ day, count }: { day: string; count: number }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400 whitespace-nowrap">
        {day}
      </span>
      <span className="h-px flex-1 bg-slate-100" />
      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-400">
        {count}
      </span>
    </div>
  );
}

function EventCard({
  item,
  isLatest,
}: {
  item: EventItem;
  isLatest: boolean;
}) {
  const [jsonOpen, setJsonOpen] = useState(false);
  const config = EVENT_CONFIG[item.type] ?? DEFAULT_CONFIG;
  const Icon = config.icon;
  const hasMetadata =
    item.metadata && Object.keys(item.metadata).length > 0;

  return (
    <div className="group relative mb-3">
      <div
        className={`
          absolute -left-[36px] top-3.5 z-10
          flex h-7 w-7 items-center justify-center rounded-lg
          !text-white transition-transform duration-150
          group-hover:scale-110 ${config.dot}
        `}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div
        className="
          rounded-xl border border-slate-100 bg-white
          p-4 transition-colors duration-150
          hover:border-slate-200 hover:bg-slate-50/60
        "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-1.5">
              <span
                className={`
                  inline-flex items-center gap-1 rounded-full border
                  px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider
                  ${config.pill}
                `}
              >
                <Icon className="h-2.5 w-2.5" />
                {config.label || item.type.replace(/_/g, ' ')}
              </span>
              {isLatest && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Latest
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-700">
              {item.message}
            </p>

            {hasMetadata && (
              <div className="mt-2">
                <button
                  onClick={() => setJsonOpen((o) => !o)}
                  className="
                    inline-flex items-center gap-1 text-[11px]
                    text-slate-400 transition-colors hover:text-slate-600
                  "
                >
                  <Code2 className="h-3 w-3" />
                  metadata
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${
                      jsonOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {jsonOpen && (
                  <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-100 bg-slate-50 p-3 font-mono text-[11px] leading-relaxed text-slate-600">
                    {JSON.stringify(item.metadata, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-row flex-wrap gap-2 text-left sm:flex-col sm:items-end sm:text-right">
            <span className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600">
              <Clock className="h-3 w-3" />
              {formatDateTime(item.occurredAt)}
            </span>
            <span className="inline-flex items-center rounded-lg border border-slate-100 bg-white px-2.5 py-1.5 text-[11px] text-slate-500">
              {item.createdBy?.fullName ?? 'Unknown'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
        <Clock className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">No events yet</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-400">
        Procedure activities, transitions, and clinical notes will appear here.
      </p>
    </div>
  );
}

export default function VisitProcedureEventTimeline({
  procedureId,
  refreshKey,
  initialData,
}: Props) {
  const [list, setList] = useState<EventItem[]>(initialData?.items ?? []);
  const [page, setPage] = useState(initialData?.page ?? 1);
  const [total, setTotal] = useState(initialData?.total ?? 0);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);

  async function fetchEvents(nextPage: number, nextLimit = limit) {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(nextLimit),
        procedureId,
      });
      const res = await clientFetch(
        `/api/visit-procedure/list-event?${params.toString()}`
      );
      const json = await res.json();
      if (!res.ok) return;
      setList(json.visitProcedureEvents.items);
      setPage(json.visitProcedureEvents.page);
      setTotal(json.visitProcedureEvents.total);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const grouped = useMemo<Map<string, EventItem[]>>(() => {
    return list.reduce(
      (acc: Map<string, EventItem[]>, item) => {
        const d = new Date(item.occurredAt);
        const today = new Date();
        const diff = Math.floor(
          (today.getTime() - d.getTime()) / 86400000
        );
        const day =
          diff === 0
            ? 'Today'
            : diff === 1
            ? 'Yesterday'
            : d.toLocaleDateString([], {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
        if (!acc.has(day)) acc.set(day, []);
        acc.get(day)!.push(item);
        return acc;
      },
      new Map()
    );
  }, [list]);

  const totalPages = Math.ceil(total / limit);

  const stats = useMemo(() => {
    const c: Record<string, number> = {};
    list.forEach((e) => (c[e.type] = (c[e.type] ?? 0) + 1));
    return {
      total: list.length,
      steps: c['STEP_COMPLETED'] ?? 0,
      notes: c['NOTE'] ?? 0,
      complications: c['COMPLICATION'] ?? 0,
    };
  }, [list]);

  let globalIdx = 0;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            <Activity className="h-3 w-3" />
            Live stream
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
            Procedure Timeline
          </h2>
          <p className="mt-0.5 text-sm text-slate-400">
            Clinical activity stream — events, transitions, notes &amp;
            complications
          </p>
        </div>

        {!loading && list.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <StatCard num={stats.total} label="Events" />
            <StatCard num={stats.steps} label="Steps" />
            <StatCard num={stats.notes} label="Notes" />
            <StatCard num={stats.complications} label="Complications" />
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div
          className={`
            relative p-5 sm:p-6
            transition-opacity duration-200
            ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}
          `}
        >
          {list.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            Array.from(grouped.entries()).map(([day, items]) => (
              <div key={day} className="mb-8 last:mb-0">
                <DayDivider day={day} count={items.length} />

                <div className="relative ml-3 border-l border-dashed border-slate-100 pl-10">
                  {items.map((item) => {
                    const isLatest = globalIdx === 0;
                    globalIdx++;
                    return (
                      <EventCard
                        key={item.id}
                        item={item}
                        isLatest={isLatest}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-slate-400">
              {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{' '}
              {total}
            </span>
            <select
              value={limit}
              onChange={(e) => {
                const l = Number(e.target.value);
                setLimit(l);
                fetchEvents(1, l);
              }}
              className="
                rounded-lg border border-slate-200 bg-white
                px-2 py-1 font-mono text-xs text-slate-600
                focus:outline-none focus:ring-1 focus:ring-slate-300
              "
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} / page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fetchEvents(page - 1)}
              disabled={page <= 1 || loading}
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                border border-slate-200 bg-white text-slate-600
                transition-colors hover:border-slate-300 hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-30
              "
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === totalPages ||
                  Math.abs(p - page) <= 1
              )
              .reduce<(number | '…')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1)
                  acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-xs text-slate-400"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => fetchEvents(p as number)}
                    disabled={loading}
                    aria-current={p === page ? 'page' : undefined}
                    className={`
                      flex h-8 w-8 items-center justify-center rounded-lg
                      border text-xs font-medium transition-colors
                      disabled:cursor-not-allowed
                      ${
                        p === page
                          ? 'border-slate-900 bg-slate-900 !text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => fetchEvents(page + 1)}
              disabled={page >= totalPages || loading}
              className="
                flex h-8 w-8 items-center justify-center rounded-lg
                border border-slate-200 bg-white text-slate-600
                transition-colors hover:border-slate-300 hover:bg-slate-50
                disabled:cursor-not-allowed disabled:opacity-30
              "
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}