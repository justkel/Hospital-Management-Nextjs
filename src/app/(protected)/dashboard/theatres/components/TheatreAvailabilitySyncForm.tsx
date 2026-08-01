'use client';

import {
  useCallback,
  useState,
} from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Plus,
  Save,
  Star,
  Trash2,
  Zap,
} from 'lucide-react';

import {
  TheatreAvailabilitiesQuery,
  TheatreAvailabilityType,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type Availability =
  TheatreAvailabilitiesQuery['theatreAvailabilities'][number];

interface ScheduleRow {
  id: string; // local only
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: TheatreAvailabilityType;
  notes: string;
}

interface Props {
  theatreId: string;
  currentAvailabilities: Availability[];
  onSuccess: () => void;
  onCancel: () => void;
}

const DAY_LABELS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const TYPE_OPTIONS: {
  value: TheatreAvailabilityType;
  label: string;
  icon: React.ElementType;
  pill: string;
  ring: string;
}[] = [
    {
      value: TheatreAvailabilityType.Regular,
      label: 'Regular',
      icon: Star,
      pill: 'bg-cyan-50 border-cyan-300 text-cyan-700',
      ring: 'ring-cyan-400',
    },
    {
      value: TheatreAvailabilityType.Emergency,
      label: 'Emergency',
      icon: Flame,
      pill: 'bg-rose-50 border-rose-300 text-rose-700',
      ring: 'ring-rose-400',
    },
    {
      value: TheatreAvailabilityType.SpecialSession,
      label: 'Special',
      icon: Zap,
      pill: 'bg-violet-50 border-violet-300 text-violet-700',
      ring: 'ring-violet-400',
    },
  ];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function toScheduleRow(a: Availability): ScheduleRow {
  return {
    id: uid(),
    dayOfWeek: a.dayOfWeek,
    startTime: a.startTime.slice(0, 5),
    endTime: a.endTime.slice(0, 5),
    type: a.type,
    notes: a.notes ?? '',
  };
}

function blankRow(day: number): ScheduleRow {
  return {
    id: uid(),
    dayOfWeek: day,
    startTime: '08:00',
    endTime: '16:00',
    type: TheatreAvailabilityType.Regular,
    notes: '',
  };
}

export default function TheatreAvailabilitySyncForm({
  theatreId,
  currentAvailabilities,
  onSuccess,
  onCancel,
}: Props) {
  const [rows, setRows] = useState<ScheduleRow[]>(
    currentAvailabilities.length > 0
      ? currentAvailabilities.map(toScheduleRow)
      : [],
  );

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const rowsForDay = rows.filter((r) => r.dayOfWeek === selectedDay);
  const totalRows = rows.length;

  const addRow = useCallback(() => {
    setRows((prev) => [...prev, blankRow(selectedDay)]);
  }, [selectedDay]);

  const removeRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const updateRow = useCallback(
    (id: string, patch: Partial<ScheduleRow>) => {
      setRows((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      );
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    setError(null);

    for (const r of rows) {
      if (!r.startTime || !r.endTime) {
        setError('All rows must have start and end times.');
        return;
      }
      if (r.startTime >= r.endTime) {
        setError(
          `On ${DAY_LABELS[r.dayOfWeek]}: start time must be before end time.`,
        );
        return;
      }
    }

    setSaving(true);
    try {
      const res = await clientFetch('/api/theatre/availability/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theatreId,
          schedules: rows.map((r) => ({
            dayOfWeek: r.dayOfWeek,
            startTime: r.startTime,
            endTime: r.endTime,
            type: r.type,
            notes: r.notes || undefined,
          })),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(
          json.error ?? 'Failed to sync availability',
        );
      }

      setSaved(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
      );
    } finally {
      setSaving(false);
    }
  }, [rows, theatreId, onSuccess]);

  return (
    <div className="space-y-5">
      <div className="flex gap-5">
        <div className="flex w-36 shrink-0 flex-col gap-2">
          {Array.from({ length: 7 }, (_, d) => {
            const count = rows.filter((r) => r.dayOfWeek === d).length;
            const active = d === selectedDay;

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`group relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition ${active
                    ? 'border-violet-300 bg-violet-600 shadow-lg shadow-violet-200'
                    : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-violet-50/40'
                  }`}
              >
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-violet-200' : 'text-slate-400'
                    }`}
                >
                  {DAY_SHORT[d]}
                </p>

                <p
                  className={`mt-0.5 text-xs font-bold ${active ? 'text-white' : 'text-slate-700'
                    }`}
                >
                  {DAY_LABELS[d].slice(0, 3)}
                </p>

                {count > 0 && (
                  <span
                    className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black ${active
                        ? 'bg-white/20 text-white'
                        : 'bg-violet-100 text-violet-700'
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {DAY_LABELS[selectedDay]}
              </h3>

              <p className="text-xs text-slate-500">
                {rowsForDay.length === 0
                  ? 'No slots configured for this day'
                  : `${rowsForDay.length} slot${rowsForDay.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <button
              onClick={addRow}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-violet-700 active:scale-95"
            >
              <Plus size={13} />
              Add Slot
            </button>
          </div>

          <div className="divide-y divide-slate-50 p-5 space-y-3">
            {rowsForDay.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  No slots for {DAY_LABELS[selectedDay]}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Click &quot;Add Slot&quot; to configure an operating window.
                </p>
              </div>
            ) : (
              rowsForDay.map((row) => (
                <SlotRow
                  key={row.id}
                  row={row}
                  onChange={(patch) => updateRow(row.id, patch)}
                  onRemove={() => removeRow(row.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold text-slate-500">
            Total across all days:
          </p>
          {Array.from({ length: 7 }, (_, d) => {
            const c = rows.filter((r) => r.dayOfWeek === d).length;
            if (c === 0) return null;
            return (
              <span
                key={d}
                className="rounded-full bg-white border border-slate-200 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm"
              >
                {DAY_SHORT[d]} · {c}
              </span>
            );
          })}
          {totalRows === 0 && (
            <span className="text-xs text-slate-400">
              No slots added yet. This will clear all existing availability.
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
          <AlertTriangle
            size={16}
            className="mt-0.5 shrink-0 text-rose-600"
          />
          <p className="text-sm font-medium text-rose-800">{error}</p>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <CheckCircle2
            size={16}
            className="shrink-0 text-emerald-600"
          />
          <p className="text-sm font-medium text-emerald-800">
            Schedule synced successfully!
          </p>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <p className="text-xs text-slate-500">
          Syncing will <strong className="text-slate-700">replace</strong>{' '}
          all current availability with the schedule above.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving || saved}
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-60 active:scale-95"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Syncing…
              </>
            ) : (
              <>
                <Save size={13} />
                Sync Schedule
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SlotRow({
  row,
  onChange,
  onRemove,
}: {
  row: ScheduleRow;
  onChange: (patch: Partial<ScheduleRow>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          {TYPE_OPTIONS.map((opt) => {
            const OIcon = opt.icon;
            const selected = row.type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ type: opt.value })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide transition ${selected
                    ? `${opt.pill} ring-2 ${opt.ring}`
                    : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                  }`}
              >
                <OIcon size={9} />
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1" />

        <button
          onClick={onRemove}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
        >
          <Trash2 size={13} />
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Start
          </label>
          <input
            type="time"
            value={row.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <span className="mt-5 text-slate-400 font-bold">→</span>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            End
          </label>
          <input
            type="time"
            value={row.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-900 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1 min-w-[160px]">
          <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Notes (optional)
          </label>
          <input
            type="text"
            value={row.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="e.g. Cardiothoracic priority"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>
    </div>
  );
}