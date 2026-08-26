'use client';

import { useState, useCallback } from 'react';

import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Lock,
  Search,
  SearchX,
  Siren,
  Zap,
  Sparkles,
} from 'lucide-react';

import { TheatreBookingPriority } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

interface Props {
  procedureId: string;
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}

interface TheatreOption {
  id: string;
  name: string;
  code?: string | null;
  floor?: number | null;
  department?: string | null;
}

const PRIORITY_OPTIONS: {
  value: TheatreBookingPriority;
  label: string;
  description: string;
  icon: React.ElementType;
  active: string;
  iconActive: string;
}[] = [
    {
      value: TheatreBookingPriority.Elective,
      label: 'Elective',
      description: 'Routine scheduled procedure',
      icon: Sparkles,
      active: '!border-[#16211B] !bg-[#F7F7F5]',
      iconActive: '!bg-white !text-[#16211B]',
    },
    {
      value: TheatreBookingPriority.Urgent,
      label: 'Urgent',
      description: 'Requires scheduling within 24–72h',
      icon: Zap,
      active: '!border-[#F5E3C0] !bg-[#FFF8EC]',
      iconActive: '!bg-white !text-[#B9770E]',
    },
    {
      value: TheatreBookingPriority.Emergency,
      label: 'Emergency',
      description: 'Immediate — bypasses availability rules',
      icon: Siren,
      active: '!border-[#FBD5D5] !bg-[#FEF2F2]',
      iconActive: '!bg-white !text-[#DC2626]',
    },
  ];

function toDatetimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TheatreBookingCreateForm({ procedureId, onSuccess, onCancel }: Props) {
  const now = new Date();
  const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  const [priority, setPriority] = useState<TheatreBookingPriority>(TheatreBookingPriority.Elective);
  const [startTime, setStartTime] = useState(toDatetimeLocal(now));
  const [endTime, setEndTime] = useState(toDatetimeLocal(twoHoursLater));
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [theatreId, setTheatreId] = useState('');
  const [theatreOptions, setTheatreOptions] = useState<TheatreOption[]>([]);
  const [theatreName, setTheatreName] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTheatres = useCallback(async () => {
    if (!startTime || !endTime) return;
    setSearchLoading(true);
    try {
      const params = new URLSearchParams({
        startTime,
        endTime,
        page: '1',
        limit: '20',
      });
      if (priority === TheatreBookingPriority.Emergency) {
        params.set('priority', priority);
      }
      const res = await clientFetch(`/api/theatre/available-for-time-range?${params}`);
      const json = await res.json();
      setTheatreOptions(json.theatres?.items ?? []);
    } catch {
      setTheatreOptions([]);
    } finally {
      setSearchLoading(false);
      setHasSearched(true);
    }
  }, [startTime, endTime, priority]);

  const handleSubmit = useCallback(async () => {
    setError(null);
    if (!theatreId) { setError('Please select a theatre.'); return; }
    if (!startTime || !endTime) { setError('Start and end times are required.'); return; }
    if (new Date(startTime) >= new Date(endTime)) { setError('Start time must be before end time.'); return; }

    setSaving(true);
    try {
      const res = await clientFetch('/api/theatre/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          procedureId,
          theatreId,
          scheduledStartTime: startTime,
          scheduledEndTime: endTime,
          priority,
          estimatedDurationMinutes: estimatedDuration ? parseInt(estimatedDuration) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Failed to create booking');
      }
      setSaved(true);
      await onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setSaving(false);
    }
  }, [procedureId, theatreId, startTime, endTime, priority, estimatedDuration, notes, onSuccess]);

  const durationMins = startTime && endTime
    ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
    : null;

  const updateWindow = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setHasSearched(false);
    setTheatreOptions([]);
  };

  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="border-b !border-[#E8E6E0] px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl !bg-[#ECFBF5]">
            <CalendarPlus className="h-4.5 w-4.5 !text-[#1D9E75]" />
          </div>
          <div>
            <h2 className="text-sm font-bold !text-[#16211B]">New theatre booking</h2>
            <p className="text-xs !text-[#767570]">Allocate an operating theatre slot for this procedure</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
        <div>
          <Label>Booking priority</Label>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {PRIORITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const sel = priority === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setPriority(opt.value);
                    setHasSearched(false);
                    setTheatreOptions([]);
                  }}
                  className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${sel
                    ? opt.active
                    : '!border-[#E8E6E0] !bg-white hover:!bg-[#FAFAF8]'
                    }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sel ? opt.iconActive : '!bg-[#F7F7F5] !text-[#B4B2A9]'}`}>
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold !text-[#16211B]">{opt.label}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed !text-[#767570]">{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <Label>Scheduled window</Label>
            {durationMins && durationMins > 0 && (
              <span className="rounded-md !bg-[#ECFBF5] px-2 py-0.5 font-mono text-[10px] font-semibold !text-[#1D9E75]">
                {durationMins < 60 ? `${durationMins}m` : `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''}`.trim()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Start">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => updateWindow(setStartTime)(e.target.value)}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
              />
            </Field>
            <Field label="End">
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => updateWindow(setEndTime)(e.target.value)}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
              />
            </Field>
          </div>
        </div>

        <div>
          <Label>Theatre</Label>
          <div className="mt-2.5 flex flex-wrap gap-2">
            <button
              onClick={searchTheatres}
              disabled={searchLoading || !startTime || !endTime}
              className="inline-flex h-10 items-center gap-2 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 text-xs font-semibold !text-[#1D9E75] transition hover:!bg-[#DCF5EA] disabled:opacity-40"
            >
              {searchLoading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-[#CFF0E1] !border-t-[#1D9E75]" />
              ) : (
                <Search size={12} />
              )}
              Find available
            </button>
            {theatreId && (
              <div className="flex h-10 items-center gap-2 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-3.5 text-xs font-semibold !text-[#1D9E75]">
                <CheckCircle2 size={12} />
                {theatreName}
                <button
                  type="button"
                  onClick={() => { setTheatreId(''); setTheatreName(''); }}
                  className="ml-1 !text-[#1D9E75]/60 hover:!text-[#1D9E75]"
                  aria-label="Clear selected theatre"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {searchLoading && (
            <div className="mt-3 flex items-center gap-2.5 rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] px-4 py-3.5 text-xs !text-[#767570]">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-[#E8E6E0] !border-t-[#1D9E75]" />
              Checking theatre availability…
            </div>
          )}

          {!searchLoading && theatreOptions.length > 0 && !theatreId && (
            <div className="mt-3 space-y-1.5 rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] !text-[#B4B2A9]">
                {theatreOptions.length} available
              </p>
              {theatreOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheatreId(t.id); setTheatreName(t.name); setTheatreOptions([]); }}
                  className="flex w-full items-center justify-between rounded-lg border !border-[#E8E6E0] !bg-white px-4 py-3 text-left transition hover:!border-[#CFF0E1] hover:!bg-[#ECFBF5]"
                >
                  <div>
                    <p className="text-sm font-semibold !text-[#16211B]">{t.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] !text-[#B4B2A9]">
                      {[t.code, t.department?.replace(/_/g, ' '), t.floor ? `Floor ${t.floor}` : null].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold !text-[#1D9E75]">Select →</span>
                </button>
              ))}
            </div>
          )}

          {!searchLoading && hasSearched && theatreOptions.length === 0 && !theatreId && (
            <div className="mt-3 flex items-start gap-3 rounded-xl border !border-[#F5E3C0] !bg-[#FFF8EC] px-4 py-3.5">
              <SearchX size={15} className="mt-0.5 shrink-0 !text-[#B9770E]" />
              <div>
                <p className="text-xs font-semibold !text-[#B9770E]">No theatres available</p>
                <p className="mt-0.5 text-xs leading-relaxed !text-[#8A6115]">
                  Nothing is free in that window. Try a different time range{priority !== TheatreBookingPriority.Emergency ? ', or set priority to Emergency to bypass availability rules' : ''}.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Estimated duration (minutes, optional)">
            <input
              type="number"
              min="1"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 120"
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 font-mono text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
            />
          </Field>
          <Field label="Notes (optional)">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements…"
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
            />
          </Field>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 !text-[#DC2626]" />
            <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3.5">
            <CheckCircle2 size={14} className="shrink-0 !text-[#1D9E75]" />
            <p className="text-sm font-medium !text-[#1D9E75]">Booking created successfully.</p>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t !border-[#E8E6E0] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs !text-[#767570] text-center sm:text-left">
            Booking will be validated against theatre availability and active blocks.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40 order-2 sm:order-1"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving || saved || !theatreId}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 sm:px-5 text-xs sm:text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-40 order-1 sm:order-2"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/20 !border-t-white" />
                  <span className="sm:hidden">Booking…</span>
                  <span className="hidden sm:inline">Booking…</span>
                </>
              ) : (
                <>
                  <Lock size={12} className="sm:hidden" />
                  <Lock size={12} className="hidden sm:inline" />
                  <span className="sm:hidden">Book</span>
                  <span className="hidden sm:inline">Confirm booking</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}