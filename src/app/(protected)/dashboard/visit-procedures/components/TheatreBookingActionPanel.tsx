'use client';

import { useState, useCallback } from 'react';

import {
  AlertTriangle,
  ArrowLeft,
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
  border: string;
  iconBg: string;
  allowedStatuses: TheatreBookingStatus[];
}[] = [
    {
      id: 'start',
      label: 'Start procedure',
      description: 'Mark as In Progress — actual start time recorded now',
      icon: Play,
      border: 'hover:!border-[#CFF0E1] hover:!bg-[#ECFBF5]',
      iconBg: '!bg-[#ECFBF5] !text-[#1D9E75]',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
      ],
    },
    {
      id: 'update',
      label: 'Edit booking',
      description: 'Change scheduled times, priority, or notes',
      icon: Edit3,
      border: 'hover:!border-[#D6E4FB] hover:!bg-[#EFF5FF]',
      iconBg: '!bg-[#EFF5FF] !text-[#1D6FE0]',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
        TheatreBookingStatus.InProgress,
      ],
    },
    {
      id: 'delay',
      label: 'Delay booking',
      description: 'Reschedule to a later window with a delay reason',
      icon: Hourglass,
      border: 'hover:!border-[#F5E3C0] hover:!bg-[#FFF8EC]',
      iconBg: '!bg-[#FFF8EC] !text-[#B9770E]',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
      ],
    },
    {
      id: 'reallocate',
      label: 'Reallocate theatre',
      description: 'Move to a different theatre, optionally at a new time',
      icon: LayoutGrid,
      border: 'hover:!border-[#E5DCFC] hover:!bg-[#F5F2FF]',
      iconBg: '!bg-[#F5F2FF] !text-[#7C5CFC]',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
        TheatreBookingStatus.PendingReallocation,
      ],
    },
    {
      id: 'cancel',
      label: 'Cancel booking',
      description: 'Cancel with a reason — theatre slot is released',
      icon: XCircle,
      border: 'hover:!border-[#E8E6E0] hover:!bg-[#F7F7F5]',
      iconBg: '!bg-[#F7F7F5] !text-[#767570]',
      allowedStatuses: [
        TheatreBookingStatus.Scheduled,
        TheatreBookingStatus.Ready,
        TheatreBookingStatus.Delayed,
      ],
    },
    {
      id: 'abort',
      label: 'Abort procedure',
      description: 'Emergency stop — procedure aborted mid-session',
      icon: Ban,
      border: 'hover:!border-[#FBD5D5] hover:!bg-[#FEF2F2]',
      iconBg: '!bg-[#FEF2F2] !text-[#DC2626]',
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
  const [date, time] = dt.split('T');
  const [year, month, day] = date.split('-');
  const [hour, minute] = time.slice(0, 5).split(':');

  return `${day}/${month}/${year} ${hour}:${minute}`;
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
        if (!reason.trim()) {
          setError('Cancellation reason is required.');
          setSaving(false);
          return;
        }
        endpoint = '/api/theatre/booking/cancel';
        body = {
          theatreBookingId: booking.id,
          cancellationReason: reason || undefined,
        };
      } else if (activeAction === 'abort') {
        if (!reason.trim()) {
          setError('Cancellation reason is required.');
          setSaving(false);
          return;
        }
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
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

  const confirmButtonClass =
    activeAction === 'abort' || activeAction === 'cancel'
      ? '!bg-[#DC2626] hover:!bg-[#C11F1F]'
      : activeAction === 'start'
        ? '!bg-[#1D9E75] hover:!bg-[#188A66]'
        : '!bg-[#0c1a12] hover:!bg-[#16211B]';

  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-semibold ${meta.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
            {meta.label}
          </span>
          <span className="text-sm font-semibold !text-[#16211B]">{booking.theatre?.name ?? 'Theatre TBD'}</span>
          <ChevronRight size={12} className="!text-[#D3D1C7]" />
          <span className="font-mono text-xs !text-[#767570]">{fmt(booking.scheduledStartTime)}</span>
          <span className="!text-[#D3D1C7]">→</span>
          <span className="font-mono text-xs !text-[#767570]">{fmt(booking.scheduledEndTime)}</span>
        </div>
      </div>

      <div className="space-y-6 p-5 sm:p-7">
        {!activeAction ? (
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              Available actions
            </p>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {availableActions.map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => setActiveAction(a.id)}
                    className={`flex items-start gap-3 rounded-xl border !border-[#E8E6E0] !bg-white p-4 text-left transition ${a.border}`}
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`}>
                      <Icon size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold !text-[#16211B]">{a.label}</p>
                      <p className="mt-0.5 text-[11px] leading-relaxed !text-[#767570]">{a.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {availableActions.length === 0 && (
              <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] py-8 text-center">
                <p className="text-sm font-semibold !text-[#16211B]">No actions available</p>
                <p className="mt-1 text-xs !text-[#767570]">
                  This booking is in a terminal state.
                </p>
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={onCancel}
                className="h-10 rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
              >
                Back to timeline
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <button
                onClick={() => { setActiveAction(null); setError(null); }}
                className="flex h-8 w-8 items-center justify-center rounded-lg border !border-[#E8E6E0] !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <p className="text-sm font-semibold !text-[#16211B]">{selectedAction?.label}</p>
                <p className="text-xs !text-[#767570]">{selectedAction?.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {(activeAction === 'update' || activeAction === 'delay' || activeAction === 'reallocate') && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Start time">
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                    />
                  </Field>
                  <Field label="End time">
                    <input
                      type="datetime-local"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 font-mono text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
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
                    className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
                  />
                </Field>
              )}

              {activeAction === 'reallocate' && (
                <Field label="New theatre">
                  <input
                    type="text"
                    value={theatreSearch}
                    onChange={(e) => setTheatreSearch(e.target.value)}
                    placeholder="Search theatres…"
                    className="mb-3 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#7C5CFC]"
                  />

                  <div className="max-h-72 overflow-y-auto rounded-xl border !border-[#E8E6E0]">
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
                          className={`flex w-full items-center justify-between border-b !border-[#E8E6E0] px-4 py-3 text-left transition last:border-b-0 ${selected
                            ? '!bg-[#F5F2FF]'
                            : 'hover:!bg-[#FAFAF8]'
                            }`}
                        >
                          <div>
                            <p className="text-sm font-semibold !text-[#16211B]">
                              {theatre.name}
                            </p>

                            <p className="mt-0.5 font-mono text-[10px] !text-[#B4B2A9]">
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
                              className="!text-[#7C5CFC]"
                            />
                          )}
                        </button>
                      );
                    })}

                    {filteredTheatres.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm !text-[#B4B2A9]">
                        No theatres match your search.
                      </div>
                    )}
                  </div>
                </Field>
              )}

              {(activeAction === 'delay' || activeAction === 'cancel' || activeAction === 'abort' || activeAction === 'reallocate') && (
                <Field label={`${activeAction === 'delay' ? 'Delay' : activeAction === 'reallocate' ? 'Reallocation' : 'Cancellation'} reason${activeAction === 'delay' ? '' : ' (optional)'}`}>
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
                    className="w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-3 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
                  />
                </Field>
              )}

              {activeAction === 'start' && (
                <div className="rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <Play size={15} className="mt-0.5 shrink-0 !text-[#1D9E75]" />
                    <div>
                      <p className="text-sm font-semibold !text-[#16211B]">Confirm procedure start</p>
                      <p className="mt-1 text-xs leading-relaxed !text-[#5F5E5A]">
                        Actual start time will be recorded as now. The booking status will
                        move to <strong>In Progress</strong> and the procedure status will update accordingly.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
                <AlertTriangle size={14} className="mt-0.5 shrink-0 !text-[#DC2626]" />
                <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
              </div>
            )}
            {saved && (
              <div className="mt-4 flex items-center gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3.5">
                <CheckCircle2 size={14} className="shrink-0 !text-[#1D9E75]" />
                <p className="text-sm font-medium !text-[#1D9E75]">Action completed successfully.</p>
              </div>
            )}

            <div className="mt-5 flex flex-col-reverse gap-3 border-t !border-[#E8E6E0] pt-5 xs:flex-row xs:items-center xs:justify-end">
              <button
                onClick={() => { setActiveAction(null); setError(null); }}
                disabled={saving}
                className="h-10 rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
              >
                Back
              </button>
              <button
                onClick={submit}
                disabled={saving || saved}
                className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold !text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${confirmButtonClass}`}
              >
                {saving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </p>
      {children}
    </div>
  );
}