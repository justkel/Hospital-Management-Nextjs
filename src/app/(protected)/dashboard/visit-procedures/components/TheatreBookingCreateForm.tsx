'use client';

import { useState, useCallback } from 'react';

import {
  AlertTriangle,
  CalendarPlus,
  CheckCircle2,
  Lock,
  Search,
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
  ring: string;
  glow: string;
}[] = [
    {
      value: TheatreBookingPriority.Elective,
      label: 'Elective',
      description: 'Routine scheduled procedure',
      icon: Sparkles,
      active: 'border-slate-500 bg-gradient-to-b from-slate-800/80 to-slate-900 text-slate-200',
      ring: 'ring-slate-500/50',
      glow: 'shadow-[0_0_0_1px_rgba(148,163,184,0.15)]',
    },
    {
      value: TheatreBookingPriority.Urgent,
      label: 'Urgent',
      description: 'Requires scheduling within 24–72h',
      icon: Zap,
      active: 'border-amber-600 bg-gradient-to-b from-amber-900/60 to-amber-950 text-amber-200',
      ring: 'ring-amber-500/50',
      glow: 'shadow-[0_0_24px_-8px_rgba(245,158,11,0.5)]',
    },
    {
      value: TheatreBookingPriority.Emergency,
      label: 'Emergency',
      description: 'Immediate — bypasses availability rules',
      icon: Siren,
      active: 'border-rose-600 bg-gradient-to-b from-rose-900/60 to-rose-950 text-rose-200',
      ring: 'ring-rose-500/50',
      glow: 'shadow-[0_0_24px_-8px_rgba(244,63,94,0.55)]',
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
  const [theatreSearch, setTheatreSearch] = useState('');
  const [theatreOptions, setTheatreOptions] = useState<TheatreOption[]>([]);
  const [theatreName, setTheatreName] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

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
      err instanceof Error
        ? err.message
        : 'Something went wrong';

    } finally {
      setSaving(false);
    }
  }, [procedureId, theatreId, startTime, endTime, priority, estimatedDuration, notes, onSuccess]);

  const durationMins = startTime && endTime
    ? Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000)
    : null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-[#111827] to-[#0D131F] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]">
      <div className="border-b border-white/[0.07] bg-black/20 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-600/40 bg-gradient-to-br from-teal-500/20 to-teal-900/40">
            <CalendarPlus className="h-4.5 w-4.5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold !text-white">New Theatre Booking</h2>
            <p className="text-xs text-slate-500">Allocate an operating theatre slot for this procedure</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:space-y-7 sm:p-7">
        <div>
          <Label>Booking Priority</Label>
          <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {PRIORITY_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const sel = priority === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setPriority(opt.value)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${sel
                      ? `${opt.active} ring-1 ${opt.ring} ${opt.glow}`
                      : 'border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]'
                    }`}
                >
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sel ? 'bg-white/10' : 'bg-white/5'}`}>
                    <Icon size={15} className={sel ? '' : 'text-slate-500'} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${sel ? '!text-white' : 'text-slate-400'}`}>{opt.label}</p>
                    <p className={`mt-0.5 text-[10px] leading-relaxed ${sel ? 'text-slate-300' : 'text-white'}`}>{opt.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <Label>Scheduled Window</Label>
            {durationMins && durationMins > 0 && (
              <span className="rounded-md bg-teal-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-teal-400">
                {durationMins < 60 ? `${durationMins}m` : `${Math.floor(durationMins / 60)}h ${durationMins % 60 > 0 ? `${durationMins % 60}m` : ''}`.trim()}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Start">
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 font-mono text-sm font-semibold !text-white transition focus:border-teal-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </Field>
            <Field label="End">
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 font-mono text-sm font-semibold !text-white transition focus:border-teal-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
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
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-teal-600/40 bg-teal-950/40 px-4 text-xs font-bold !text-teal-300 transition hover:bg-teal-950/70 disabled:opacity-40"
            >
              {searchLoading ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-teal-700 border-t-teal-300" />
              ) : (
                <Search size={12} />
              )}
              Find Available
            </button>
            {theatreId && (
              <div className="flex h-10 items-center gap-2 rounded-xl border border-teal-600/40 bg-teal-950/30 px-3.5 text-xs font-bold text-teal-300">
                <CheckCircle2 size={12} className="text-teal-400" />
                {theatreName}
              </div>
            )}
          </div>

          {theatreOptions.length > 0 && !theatreId && (
            <div className="mt-3 space-y-1.5 rounded-2xl border border-white/[0.08] bg-black/30 p-3">
              <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-600">
                {theatreOptions.length} available
              </p>
              {theatreOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheatreId(t.id); setTheatreName(t.name); setTheatreOptions([]); }}
                  className="flex w-full items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-4 py-3 text-left transition hover:border-teal-500/40 hover:bg-teal-500/10"
                >
                  <div>
                    <p className="text-sm font-bold !text-white">{t.name}</p>
                    <p className="font-mono text-[10px] text-slate-500">
                      {[t.code, t.department?.replace(/_/g, ' '), t.floor ? `Floor ${t.floor}` : null].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-teal-400">Select →</span>
                </button>
              ))}
            </div>
          )}

          {theatreOptions.length === 0 && !theatreId && searchLoading === false && theatreSearch !== '' && (
            <p className="mt-2 text-xs text-slate-600">No theatres found. Try adjusting the time window.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Estimated Duration (minutes, optional)">
            <input
              type="number"
              min="1"
              value={estimatedDuration}
              onChange={(e) => setEstimatedDuration(e.target.value)}
              placeholder="e.g. 120"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 font-mono text-sm !text-white transition placeholder:text-slate-700 focus:border-teal-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </Field>
          <Field label="Notes (optional)">
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements…"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm !text-white transition placeholder:text-slate-700 focus:border-teal-500/60 focus:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </Field>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-rose-800/50 bg-rose-950/50 px-4 py-3.5">
            <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
            <p className="text-sm font-medium text-rose-300">{error}</p>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-3 rounded-xl border border-teal-700/50 bg-teal-950/50 px-4 py-3.5">
            <CheckCircle2 size={14} className="shrink-0 text-teal-400" />
            <p className="text-sm font-medium text-teal-300">Booking created successfully!</p>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs !text-slate-300">
            Booking will be validated against theatre availability and active blocks.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="h-10 rounded-xl border border-white/10 px-4 text-xs font-semibold !text-slate-300 transition hover:border-white/20 hover:!text-white disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || saved || !theatreId}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-br from-teal-400 to-teal-500 px-5 text-xs font-bold !text-white shadow-[0_8px_20px_-8px_rgba(45,212,191,0.65)] transition hover:from-teal-300 hover:to-teal-400 disabled:opacity-50 disabled:shadow-none active:scale-[0.97]"
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Booking…
                </>
              ) : (
                <>
                  <Lock size={12} />
                  Confirm Booking
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
    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
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