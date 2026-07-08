'use client';

import { useState, useCallback } from 'react';

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Edit3,
  Hourglass,
  LayoutGrid,
  Play,
  XCircle,
} from 'lucide-react';

import { TheatreBookingStatus } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

import { STATUS_META, type Booking } from './TheatreBookingWorkspace';

interface TheatreOption {
  id: string;
  name: string;
  code?: string | null;
  floor?: number | null;
  department?: string | null;
}

interface Props {
  booking: Booking;
  theatres: TheatreOption[];
  onDone: () => Promise<void>;
  onCancel: () => void;
}

type Action = 'update' | 'delay' | 'reallocate' | 'start' | 'cancel' | 'abort';

const ACTIONS: {
  id: Action;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  allowedStatuses: TheatreBookingStatus[];
}[] = [
    {
      id: 'start',
      label: 'Start Procedure',
      description: 'Mark as In Progress — actual start time recorded now',
      icon: Play,
      color: 'border-teal-700/50 bg-teal-950/40 text-teal-300 hover:bg-teal-950',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
      ],
    },
    {
      id: 'update',
      label: 'Edit Booking',
      description: 'Change scheduled times, priority, or notes',
      icon: Edit3,
      color: 'border-sky-700/50 bg-sky-950/40 text-sky-300 hover:bg-sky-950',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
        TheatreBookingStatus.InProgress,
      ],
    },
    {
      id: 'delay',
      label: 'Delay Booking',
      description: 'Reschedule to a later window with a delay reason',
      icon: Hourglass,
      color: 'border-amber-700/50 bg-amber-950/40 text-amber-300 hover:bg-amber-950',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
      ],
    },
    {
      id: 'reallocate',
      label: 'Reallocate Theatre',
      description: 'Move to a different theatre, optionally at a new time',
      icon: LayoutGrid,
      color: 'border-violet-700/50 bg-violet-950/40 text-violet-300 hover:bg-violet-950',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
        TheatreBookingStatus.PendingReallocation,
      ],
    },
    {
      id: 'cancel',
      label: 'Cancel Booking',
      description: 'Cancel with a reason — theatre slot is released',
      icon: XCircle,
      color: 'border-slate-600/50 bg-slate-900/60 text-slate-400 hover:bg-slate-900',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
      ],
    },
    {
      id: 'abort',
      label: 'Abort Procedure',
      description: 'Emergency stop — procedure aborted mid-session',
      icon: Ban,
      color: 'border-rose-700/50 bg-rose-950/40 text-rose-300 hover:bg-rose-950',
      allowedStatuses: [
        TheatreBookingStatus.InProgress,
      ],
    },
  ];

function toDatetimeLocal(d: string | Date) {
  const dt = new Date(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

function fmt(dt: string) {
  const d = new Date(dt);
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });
}

export default function TheatreBookingActionPanel({ booking, onDone, onCancel, theatres }: Props) {
  const [activeAction, setActiveAction] = useState<Action | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState(toDatetimeLocal(booking.scheduledStartTime));
  const [endTime, setEndTime] = useState(toDatetimeLocal(booking.scheduledEndTime));
  const [newTheatreId, setNewTheatreId] = useState('');
  const [theatreSearch, setTheatreSearch] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState(booking.notes ?? '');

  const meta = STATUS_META[booking.status] ?? STATUS_META[TheatreBookingStatus.Scheduled];
  const availableActions = ACTIONS.filter((a) => a.allowedStatuses.includes(booking.status));

  const submit = useCallback(async () => {
    if (!activeAction) return;
    setError(null);
    setSaving(true);

    try {
      let endpoint = '';
      let body: Record<string, unknown> = {};

      if (activeAction === 'start') {
        endpoint = '/api/theatre/booking/start';
        body = { theatreBookingId: booking.id };
      } else if (activeAction === 'update') {
        endpoint = '/api/theatre/booking/update';
        body = {
          theatreBookingId: booking.id,
          scheduledStartTime: startTime,
          scheduledEndTime: endTime,
          notes: notes || undefined,
        };
      } else if (activeAction === 'delay') {
        if (!reason.trim()) { setError('Delay reason is required.'); setSaving(false); return; }
        endpoint = '/api/theatre/booking/delay';
        body = {
          theatreBookingId: booking.id,
          newScheduledStartTime: startTime,
          newScheduledEndTime: endTime,
          delayReason: reason,
        };
      } else if (activeAction === 'reallocate') {
        if (!newTheatreId.trim()) { setError('New theatre ID is required.'); setSaving(false); return; }
        endpoint = '/api/theatre/booking/reallocate';
        body = {
          theatreBookingId: booking.id,
          newTheatreId,
          scheduledStartTime: startTime,
          scheduledEndTime: endTime,
          reallocationReason: reason || undefined,
        };
      } else if (activeAction === 'cancel') {
        endpoint = '/api/theatre/booking/cancel';
        body = {
          theatreBookingId: booking.id,
          cancellationReason: reason || undefined,
        };
      } else if (activeAction === 'abort') {
        endpoint = '/api/theatre/booking/abort';
        body = {
          theatreBookingId: booking.id,
          cancellationReason: reason || undefined,
        };
      }

      const res = await clientFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Action failed');
      }

      setSaved(true);
      await onDone();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }, [activeAction, booking.id, startTime, endTime, newTheatreId, reason, notes, onDone]);

  const selectedAction = ACTIONS.find((a) => a.id === activeAction);

  const filteredTheatres = theatres
    .filter((t) => t.id !== booking.theatre.id)
    .filter((t) => {
      const q = theatreSearch.trim().toLowerCase();

      if (!q) return true;

      return (
        t.name.toLowerCase().includes(q) ||
        t.code?.toLowerCase().includes(q) ||
        t.department?.replace(/_/g, ' ').toLowerCase().includes(q)
      );
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111827]">
      <div className="border-b border-white/[0.07] bg-black/20 px-6 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[10px] font-bold ${meta.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <span className="font-bold !text-white">{booking.theatre?.name ?? 'Theatre TBD'}</span>
          <ChevronRight size={12} className="text-slate-700" />
          <span className="font-mono text-xs text-slate-400">{fmt(booking.scheduledStartTime)}</span>
          <span className="text-slate-700">→</span>
          <span className="font-mono text-xs text-slate-400">{fmt(booking.scheduledEndTime)}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {!activeAction ? (
          <div>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
              Available Actions
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {availableActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveAction(a.id)}
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${a.color}`}
                  >
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{a.label}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed opacity-70">{a.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {availableActions.length === 0 && (
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] py-8 text-center">
                <p className="text-sm font-semibold text-slate-500">No actions available</p>
                <p className="mt-1 text-xs text-slate-600">
                  This booking is in a terminal state.
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={onCancel}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:border-white/20 hover:text-slate-300"
              >
                Back to Timeline
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <button
                onClick={() => { setActiveAction(null); setError(null); }}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition hover:border-white/20 hover:text-slate-300"
              >
                ←
              </button>
              <div>
                <p className="text-sm font-bold !text-white">{selectedAction?.label}</p>
                <p className="text-xs text-slate-500">{selectedAction?.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {(activeAction === 'update' || activeAction === 'delay' || activeAction === 'reallocate') && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Start Time">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-sm font-semibold !text-white transition focus:border-teal-500/50 focus:outline-none"
                    />
                  </Field>
                  <Field label="End Time">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 font-mono text-sm font-semibold !text-white transition focus:border-teal-500/50 focus:outline-none"
                    />
                  </Field>
                </div>
              )}

              {activeAction === 'update' && (
                <Field label="Notes (optional)">
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Update notes…"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm !text-white transition placeholder:text-slate-700 focus:border-teal-500/50 focus:outline-none"
                  />
                </Field>
              )}

              {activeAction === 'reallocate' && (
                <Field label="New Theatre">
                  <input
                    type="text"
                    value={theatreSearch}
                    onChange={(e) => setTheatreSearch(e.target.value)}
                    placeholder="Search theatres..."
                    className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm !text-white transition placeholder:text-slate-700 focus:border-violet-500/50 focus:outline-none"
                  />

                  <div className="max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-black/20 scrollbar-hide">
                    {filteredTheatres.map((theatre) => {
                      const selected = theatre.id === newTheatreId;

                      return (
                        <button
                          key={theatre.id}
                          type="button"
                          onClick={() => {
                            setNewTheatreId(theatre.id);
                            setTheatreSearch(theatre.name);
                          }}
                          className={`flex w-full items-center justify-between border-b border-white/5 px-4 py-3 text-left transition last:border-b-0 ${selected
                              ? 'bg-violet-500/10'
                              : 'hover:bg-white/5'
                            }`}
                        >
                          <div>
                            <p className="text-sm font-semibold !text-white">
                              {theatre.name}
                            </p>

                            <p className="font-mono text-[10px] text-slate-500">
                              {[
                                theatre.code,
                                theatre.department?.replace(/_/g, ' '),
                                theatre.floor ? `Floor ${theatre.floor}` : null,
                              ]
                                .filter(Boolean)
                                .join(' • ')}
                            </p>
                          </div>

                          {selected && (
                            <CheckCircle2
                              size={16}
                              className="text-violet-400"
                            />
                          )}
                        </button>
                      );
                    })}

                    {filteredTheatres.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No theatres match your search.
                      </div>
                    )}
                  </div>
                </Field>
              )}

              {(activeAction === 'delay' || activeAction === 'cancel' || activeAction === 'abort' || activeAction === 'reallocate') && (
                <Field label={`${activeAction === 'delay' ? 'Delay' : activeAction === 'reallocate' ? 'Reallocation' : 'Cancellation'} Reason${activeAction === 'delay' ? '' : ' (optional)'}`}>
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={
                      activeAction === 'delay' ? 'e.g. Theatre unavailable due to emergency case…'
                        : activeAction === 'cancel' ? 'e.g. Procedure postponed at patient request…'
                          : activeAction === 'abort' ? 'e.g. Patient deterioration…'
                            : 'e.g. Equipment failure in original theatre…'
                    }
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm !text-white transition placeholder:text-slate-700 focus:border-teal-500/50 focus:outline-none"
                  />
                </Field>
              )}

              {activeAction === 'start' && (
                <div className="rounded-xl border border-teal-700/40 bg-teal-950/30 px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Play size={15} className="mt-0.5 shrink-0 text-teal-400" />
                    <div>
                      <p className="text-sm font-bold text-teal-200">Confirm procedure start</p>
                      <p className="mt-1 text-xs text-teal-400/70">
                        Actual start time will be recorded as now. The booking status will
                        move to <strong>In Progress</strong> and the procedure status will update accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-rose-800/50 bg-rose-950/50 px-4 py-3.5">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-400" />
                <p className="text-sm font-medium text-rose-300">{error}</p>
              </div>
            )}
            {saved && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-teal-700/50 bg-teal-950/50 px-4 py-3.5">
                <CheckCircle2 size={14} className="shrink-0 text-teal-400" />
                <p className="text-sm font-medium text-teal-300">Action completed successfully!</p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-3 border-t border-white/[0.07] pt-5">
              <button
                onClick={() => { setActiveAction(null); setError(null); }}
                disabled={saving}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:border-white/20 !hover:text-white disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={submit}
                disabled={saving || saved}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition disabled:opacity-50 active:scale-95 ${activeAction === 'abort' || activeAction === 'cancel'
                  ? 'bg-rose-600 !text-white hover:bg-rose-500'
                  : activeAction === 'start'
                    ? 'bg-teal-500 text-black hover:bg-teal-400'
                    : 'bg-sky-600 !text-white hover:bg-sky-500'
                  }`}
              >
                {saving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Processing…
                  </>
                ) : (
                  <>
                    {selectedAction && <selectedAction.icon size={12} />}
                    Confirm {selectedAction?.label}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>
      {children}
    </div>
  );
}