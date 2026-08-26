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
}[] = [
    {
      value: TheatreAvailabilityType.Regular,
      label: 'Regular',
      icon: Star,
      pill: '!bg-[#EFF5FF] !border-[#D6E4FB] !text-[#1D6FE0]',
    },
    {
      value: TheatreAvailabilityType.Emergency,
      label: 'Emergency',
      icon: Flame,
      pill: '!bg-[#FEF2F2] !border-[#FBD5D5] !text-[#DC2626]',
    },
    {
      value: TheatreAvailabilityType.SpecialSession,
      label: 'Special',
      icon: Zap,
      pill: '!bg-[#F5F2FF] !border-[#E5DCFC] !text-[#7C5CFC]',
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
    <div className="space-y-4 sm:space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">

        <div
          className="-mx-4 overflow-x-auto px-4 pb-1 lg:mx-0 lg:w-32 lg:shrink-0 lg:overflow-visible lg:px-0 lg:pb-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >          <div className="flex gap-2 lg:flex-col">
            {Array.from({ length: 7 }, (_, d) => {
              const count = rows.filter((r) => r.dayOfWeek === d).length;
              const active = d === selectedDay;

              return (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`relative w-[76px] shrink-0 overflow-hidden rounded-xl border px-3 py-3 text-left transition lg:w-auto ${active
                    ? '!border-[#0c1a12] !bg-[#0c1a12]'
                    : '!border-[#E8E6E0] !bg-white hover:!bg-[#F7F7F5]'
                    }`}
                >
                  <p
                    className={`text-[9px] font-semibold uppercase tracking-[0.1em] ${active ? '!text-[#8FA89D]' : '!text-[#B4B2A9]'
                      }`}
                  >
                    {DAY_SHORT[d]}
                  </p>

                  <p
                    className={`mt-0.5 text-xs font-semibold ${active ? '!text-white' : '!text-[#5F5E5A]'
                      }`}
                  >
                    {DAY_LABELS[d].slice(0, 3)}
                  </p>

                  {count > 0 && (
                    <span
                      className={`absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-semibold ${active
                        ? 'bg-white/20 !text-white'
                        : '!bg-[#ECFBF5] !text-[#1D9E75]'
                        }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="flex flex-col gap-3 border-b !border-[#E8E6E0] px-4 py-4 xs:flex-row xs:items-center xs:justify-between sm:px-6 sm:py-5">
            <div>
              <h3 className="text-base font-semibold !text-[#16211B]">
                {DAY_LABELS[selectedDay]}
              </h3>

              <p className="mt-0.5 text-xs !text-[#767570]">
                {rowsForDay.length === 0
                  ? 'No slots configured for this day'
                  : `${rowsForDay.length} slot${rowsForDay.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            <button
              onClick={addRow}
              className="inline-flex items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 py-2.5 text-xs font-semibold !text-white transition hover:!bg-[#16211B]"
            >
              <Plus size={13} />
              Add slot
            </button>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {rowsForDay.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center sm:py-14">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl !bg-[#F7F7F5]">
                  <Clock className="h-5 w-5 !text-[#B4B2A9]" />
                </div>
                <p className="text-sm font-semibold !text-[#16211B]">
                  No slots for {DAY_LABELS[selectedDay]}
                </p>
                <p className="mt-1 text-xs !text-[#B4B2A9]">
                  Tap &quot;Add slot&quot; to configure an operating window.
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

      <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] px-4 py-3.5 sm:px-5 sm:py-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium !text-[#767570]">
            Total across all days:
          </p>
          {Array.from({ length: 7 }, (_, d) => {
            const c = rows.filter((r) => r.dayOfWeek === d).length;
            if (c === 0) return null;
            return (
              <span
                key={d}
                className="rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1 text-[11px] font-semibold !text-[#5F5E5A]"
              >
                {DAY_SHORT[d]} · {c}
              </span>
            );
          })}
          {totalRows === 0 && (
            <span className="text-xs !text-[#B4B2A9]">
              No slots added yet. This will clear all existing availability.
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5 sm:px-5 sm:py-4">
          <AlertTriangle
            size={15}
            className="mt-0.5 shrink-0 !text-[#DC2626]"
          />
          <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3.5 sm:px-5 sm:py-4">
          <CheckCircle2
            size={15}
            className="shrink-0 !text-[#1D9E75]"
          />
          <p className="text-sm font-medium !text-[#1D9E75]">
            Schedule synced successfully.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-4 sm:px-5 sm:py-4">
        <p className="text-xs !text-[#767570] text-center sm:text-left">
          Syncing will <strong className="font-semibold !text-[#16211B]">replace</strong>{' '}
          all current availability with the schedule above.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onCancel}
            disabled={saving}
            className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40 order-2 sm:order-1"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving || saved}
            className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 sm:px-5 text-xs sm:text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50 order-1 sm:order-2"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                <span className="sm:hidden">Syncing…</span>
                <span className="hidden sm:inline">Syncing…</span>
              </>
            ) : (
              <>
                <Save size={14} className="sm:hidden" />
                <Save size={13} className="hidden sm:inline" />
                <span className="sm:hidden">Sync</span>
                <span className="hidden sm:inline">Sync schedule</span>
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
    <div className="overflow-hidden rounded-xl border !border-[#E8E6E0] !bg-white p-3.5 transition hover:!border-[#D3D1C7] sm:p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {TYPE_OPTIONS.map((opt) => {
            const OIcon = opt.icon;
            const selected = row.type === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ type: opt.value })}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${selected
                  ? opt.pill
                  : '!border-[#E8E6E0] !bg-[#FAFAF8] !text-[#B4B2A9] hover:!bg-[#F7F7F5]'
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
          aria-label="Remove slot"
          className="flex h-8 w-8 items-center justify-center rounded-lg border !border-[#E8E6E0] !text-[#B4B2A9] transition hover:!border-[#FBD5D5] hover:!bg-[#FEF2F2] hover:!text-[#DC2626]"
        >
          <Trash2 size={13} />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
            Start
          </label>
          <input
            type="time"
            value={row.startTime}
            onChange={(e) => onChange({ startTime: e.target.value })}
            className="w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-2 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75] sm:w-auto"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
            End
          </label>
          <input
            type="time"
            value={row.endTime}
            onChange={(e) => onChange({ endTime: e.target.value })}
            className="w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-2 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75] sm:w-auto"
          />
        </div>

        <div className="col-span-2 flex min-w-[160px] flex-1 flex-col gap-1">
          <label className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
            Notes (optional)
          </label>
          <input
            type="text"
            value={row.notes}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="e.g. Cardiothoracic priority"
            className="w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-2 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
          />
        </div>
      </div>
    </div>
  );
}