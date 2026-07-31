'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import {
    AlertTriangle,
    ArrowLeft,
    Ban,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    RefreshCw,
    ShieldCheck,
    ShieldQuestion,
    Stethoscope,
    Star,
    Zap,
} from 'lucide-react';

import {
    TheatreAvailabilityType,
    TheatreScheduleForDayQuery,
    TheatreScheduleStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type Schedule = TheatreScheduleForDayQuery['theatreScheduleForDay'];
type Availability = Schedule['availability'][number];
type Block = Schedule['blocks'][number];
type Booking = Schedule['bookings'][number];

interface Props {
    theatreId: string;
    initialDate: string;
    initialSchedule: Schedule;
}

const GRID_START = 6 * 60;
const GRID_END = 22 * 60;
const GRID_SPAN = GRID_END - GRID_START;
const HOUR_MARKS = [6, 8, 10, 12, 14, 16, 18, 20, 22];

const AVAILABILITY_CONFIG: Record<
    TheatreAvailabilityType,
    { label: string; icon: React.ElementType; band: string; dot: string; pill: string }
> = {
    [TheatreAvailabilityType.Regular]: {
        label: 'Regular',
        icon: Star,
        band: 'bg-cyan-100/70 border-cyan-300',
        dot: 'bg-cyan-500',
        pill: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    },
    [TheatreAvailabilityType.Emergency]: {
        label: 'Emergency',
        icon: Flame,
        band: 'bg-rose-100/70 border-rose-300',
        dot: 'bg-rose-500',
        pill: 'bg-rose-50 border-rose-200 text-rose-700',
    },
    [TheatreAvailabilityType.SpecialSession]: {
        label: 'Special',
        icon: Zap,
        band: 'bg-violet-100/70 border-violet-300',
        dot: 'bg-violet-500',
        pill: 'bg-violet-50 border-violet-200 text-violet-700',
    },
};

const STATUS_CONFIG: Record<
    TheatreScheduleStatus,
    { label: string; sub: string; icon: React.ElementType; ring: string; text: string; chip: string; dot: string }
> = {
    [TheatreScheduleStatus.Available]: {
        label: 'Available',
        sub: 'Open operating windows with no active holds',
        icon: ShieldCheck,
        ring: 'from-emerald-50 via-white to-cyan-50/40 border-emerald-100',
        text: 'text-emerald-700',
        chip: 'bg-emerald-100 text-emerald-700',
        dot: 'bg-emerald-500',
    },
    [TheatreScheduleStatus.Partial]: {
        label: 'Partially Blocked',
        sub: 'Some operating windows overlap with active holds',
        icon: ShieldQuestion,
        ring: 'from-amber-50 via-white to-cyan-50/40 border-amber-100',
        text: 'text-amber-700',
        chip: 'bg-amber-100 text-amber-700',
        dot: 'bg-amber-500',
    },
    [TheatreScheduleStatus.Blocked]: {
        label: 'Blocked',
        sub: 'No open windows — theatre is held for the full day',
        icon: Ban,
        ring: 'from-rose-50 via-white to-cyan-50/40 border-rose-100',
        text: 'text-rose-700',
        chip: 'bg-rose-100 text-rose-700',
        dot: 'bg-rose-500',
    },
};

const TAG_PALETTE = [
    'bg-slate-50 border-slate-200 text-slate-600',
    'bg-orange-50 border-orange-200 text-orange-700',
    'bg-indigo-50 border-indigo-200 text-indigo-700',
    'bg-teal-50 border-teal-200 text-teal-700',
    'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
];

function tagStyle(value?: string | null): string {
    if (!value) return TAG_PALETTE[0];
    let hash = 0;
    for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    return TAG_PALETTE[hash % TAG_PALETTE.length];
}

function formatEnumLabel(value?: string | null): string {
    if (!value) return 'Unspecified';
    return value
        .toLowerCase()
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function pad(n: number): string {
    return String(n).padStart(2, '0');
}

function toLocalDayString(date: Date): string {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseLocalDay(dayString: string): Date {
    const [y, m, d] = dayString.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatTimeLabel(t: string): string {
    const [h, m] = t.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${pad(m)} ${ampm}`;
}

function fmtHour(h: number): string {
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 || 12;
    return `${hr}${ampm}`;
}

function timeStrToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
}

function topPercent(minutes: number): number {
    const clamped = Math.max(minutes, GRID_START);
    return ((clamped - GRID_START) / GRID_SPAN) * 100;
}

function heightPercent(startMin: number, endMin: number): number {
    const s = Math.max(startMin, GRID_START);
    const e = Math.min(endMin, GRID_END);
    return (Math.max(e - s, 0) / GRID_SPAN) * 100;
}

function startMinutesForDay(iso: string, dayStart: Date): number {
    const time = iso.slice(11, 16);

    const [hours, minutes] = time.split(':').map(Number);

    const date = iso.slice(0, 10);

    if (date < toLocalDayString(dayStart)) return 0;

    return hours * 60 + minutes;
}

function endMinutesForDay(iso: string, dayEnd: Date): number {
    const time = iso.slice(11, 16);

    const [hours, minutes] = time.split(':').map(Number);

    const date = iso.slice(0, 10);

    if (date > toLocalDayString(dayEnd)) return 24 * 60;

    return hours * 60 + minutes;
}

function formatBookingDateTime(iso: string, includeDate = false) {
    const [datePart, timePart] = iso.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute] = timePart.slice(0, 5).split(':').map(Number);

    const monthName = new Date(year, month - 1, day).toLocaleString(undefined, {
        month: 'short',
    });

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;

    const time = `${displayHour}:${pad(minute)} ${ampm}`;

    return includeDate
        ? `${monthName} ${day}, ${time}`
        : time;
}

function formatMinutesRange(startMin: number, endMin: number): string {
    const fmt = (mins: number) => {
        const h = Math.floor(mins / 60) % 24;
        const m = mins % 60;
        return formatTimeLabel(`${pad(h)}:${pad(m)}`);
    };
    return `${fmt(startMin)} – ${fmt(endMin)}`;
}

export default function TheatreDayScheduleWorkspace({
    theatreId,
    initialDate,
    initialSchedule,
}: Props) {
    const [dayString, setDayString] = useState(initialDate);
    const [schedule, setSchedule] = useState<Schedule>(initialSchedule);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedDate = useMemo(() => parseLocalDay(dayString), [dayString]);
    const isToday = dayString === toLocalDayString(new Date());

    const loadDay = useCallback(async (nextDay: string) => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({
                theatreId,
                date: `${nextDay}T00:00:00`,
            });
            const res = await clientFetch(`/api/theatre/schedule-for-day?${params.toString()}`);
            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error ?? 'Failed to load schedule for this day');
            }

            setSchedule(json);
            setDayString(nextDay);
        } catch (err) {
            err instanceof Error
                ? err.message
                : 'Something went wrong';

        } finally {
            setLoading(false);
        }
    }, [theatreId]);

    const shiftDay = useCallback(
        (delta: number) => {
            const next = new Date(selectedDate);
            next.setDate(next.getDate() + delta);
            loadDay(toLocalDayString(next));
        },
        [selectedDate, loadDay],
    );

    const theatre = schedule.theatre;
    const availability = schedule.availability ?? [];
    const blocks = schedule.blocks ?? [];
    const bookings = schedule.bookings ?? [];
    const statusConfig = STATUS_CONFIG[schedule.computedStatus];
    const StatusIcon = statusConfig.icon;

    const dayStart = useMemo(() => {
        const d = new Date(selectedDate);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [selectedDate]);

    const dayEnd = useMemo(() => {
        const d = new Date(selectedDate);
        d.setHours(23, 59, 59, 999);
        return d;
    }, [selectedDate]);

    const blockRanges = useMemo(
        () =>
            blocks.map((block: Block) => ({
                block,
                startMin: startMinutesForDay(block.startTime, dayStart),
                endMin: endMinutesForDay(block.endTime, dayEnd),
            })),
        [blocks, dayStart, dayEnd],
    );

    const dateHeading = selectedDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    if (!theatre) return null;

    return (
        <div className="space-y-6">
            <div className={`relative overflow-hidden rounded-[2rem] border bg-white shadow-sm bg-gradient-to-br ${statusConfig.ring}`}>
                <div
                    className="pointer-events-none absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px), repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)',
                    }}
                />

                <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                    <Link
                        href={`/dashboard/theatres/${theatreId}`}
                        className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
                    >
                        <ArrowLeft size={13} />
                        Back to Theatre
                    </Link>

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-600 shadow-sm backdrop-blur-sm">
                                <CalendarClock className="h-3.5 w-3.5" />
                                Day Schedule Console
                            </div>

                            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                                {theatre.name}
                            </h1>

                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                                {theatre.code ?? 'No code'} · {theatre.department?.replace(/_/g, ' ')}
                                {theatre.floor ? ` · Floor ${theatre.floor}` : ''}
                            </p>
                        </div>

                        <div
                            className={`flex items-center gap-3 rounded-2xl border bg-white px-5 py-3.5 shadow-sm ${statusConfig.chip.includes('emerald') ? 'border-emerald-200' : statusConfig.chip.includes('amber') ? 'border-amber-200' : 'border-rose-200'}`}
                        >
                            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${statusConfig.chip}`}>
                                <StatusIcon size={18} />
                            </span>
                            <div>
                                <p className={`text-sm font-black ${statusConfig.text}`}>{statusConfig.label}</p>
                                <p className="text-[11px] text-slate-400">{statusConfig.sub}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur-sm w-fit">
                        <button
                            onClick={() => shiftDay(-1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-2 px-1">
                            <span className="text-sm font-bold text-slate-800">{dateHeading}</span>
                            {isToday && (
                                <span className="rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
                                    Today
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => shiftDay(1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                        >
                            <ChevronRight size={16} />
                        </button>

                        <input
                            type="date"
                            value={dayString}
                            onChange={(e) => e.target.value && loadDay(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
                        />

                        {!isToday && (
                            <button
                                onClick={() => loadDay(toLocalDayString(new Date()))}
                                disabled={loading}
                                className="rounded-xl px-3 py-2 text-xs font-bold text-violet-600 transition hover:bg-violet-50 disabled:opacity-50"
                            >
                                Jump to Today
                            </button>
                        )}

                        <button
                            onClick={() => loadDay(dayString)}
                            disabled={loading}
                            className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" />
                    <p className="text-sm font-medium text-rose-800">{error}</p>
                </div>
            )}

            <div className={`overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition ${loading ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50/60 to-white px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                            <Clock className="h-4 w-4 text-violet-700" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Day Timeline</h2>
                            <p className="text-xs text-slate-500">06:00 – 22:00 · holds are cut directly into their availability window</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {Object.entries(AVAILABILITY_CONFIG).map(([type, cfg]) => (
                            <div key={type} className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{cfg.label}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-slate-800" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Hold</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Booking</span>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="grid grid-cols-[56px_1fr] min-w-[560px]">
                        <div className="relative" style={{ height: 480 }}>
                            {HOUR_MARKS.map((h) => (
                                <div
                                    key={h}
                                    className="absolute right-3 -translate-y-1/2 text-[10px] font-semibold tabular-nums text-slate-400"
                                    style={{ top: `${topPercent(h * 60)}%` }}
                                >
                                    {fmtHour(h)}
                                </div>
                            ))}
                        </div>

                        <div className="relative border-l border-slate-100" style={{ height: 480 }}>
                            {HOUR_MARKS.map((h) => (
                                <div
                                    key={h}
                                    className="absolute left-0 right-0 border-t border-slate-100"
                                    style={{ top: `${topPercent(h * 60)}%` }}
                                />
                            ))}

                            {availability.length === 0 && blocks.length === 0 && bookings.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <p className="text-sm font-semibold text-slate-400">Nothing scheduled for this day</p>
                                </div>
                            )}

                            {availability.map((slot: Availability) => {
                                const startMin = timeStrToMinutes(slot.startTime.slice(0, 5));
                                const endMin = timeStrToMinutes(slot.endTime.slice(0, 5));
                                const cfg = AVAILABILITY_CONFIG[slot.type] ?? AVAILABILITY_CONFIG[TheatreAvailabilityType.Regular];
                                const height = heightPercent(startMin, endMin);
                                if (height < 0.5) return null;

                                return (
                                    <div
                                        key={slot.id}
                                        className={`absolute left-2 right-[36%] overflow-hidden rounded-xl border px-3 py-2 shadow-sm ${cfg.band}`}
                                        style={{ top: `${topPercent(startMin)}%`, height: `${height}%`, minHeight: 30 }}
                                        title={`${formatTimeLabel(slot.startTime.slice(0, 5))} – ${formatTimeLabel(slot.endTime.slice(0, 5))}${slot.notes ? ` · ${slot.notes}` : ''}`}
                                    >
                                        <p className="truncate text-[11px] font-bold text-slate-700">
                                            {formatTimeLabel(slot.startTime.slice(0, 5))} – {formatTimeLabel(slot.endTime.slice(0, 5))}
                                        </p>
                                        <p className="truncate text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                                            {cfg.label}
                                        </p>
                                    </div>
                                );
                            })}

                            {blockRanges.map(({ block, startMin, endMin }) => {
                                const height = heightPercent(startMin, endMin);
                                if (height < 0.5) return null;

                                return (
                                    <div
                                        key={block.id}
                                        className="absolute left-3 right-[calc(36%+4px)] z-10 overflow-hidden rounded-lg border border-slate-700 bg-slate-800/95 px-3 py-2 text-white shadow-md"
                                        style={{
                                            top: `${topPercent(startMin)}%`,
                                            height: `${height}%`,
                                            minHeight: 26,
                                            backgroundImage:
                                                'repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 6px, transparent 6px, transparent 12px)',
                                        }}
                                        title={block.reason ?? 'Active hold'}
                                    >
                                        <p className="flex items-center gap-1 truncate text-[10px] font-black uppercase tracking-wide">
                                            <Ban size={9} />
                                            {formatEnumLabel(block.type as unknown as string)}
                                        </p>
                                        {block.reason && (
                                            <p className="mt-0.5 truncate text-[10px] text-white/70">{block.reason}</p>
                                        )}
                                    </div>
                                );
                            })}

                            {bookings.map((booking: Booking) => {
                                const startMin = startMinutesForDay(booking.scheduledStartTime, dayStart);
                                const endMin = endMinutesForDay(booking.scheduledEndTime, dayEnd);
                                const height = heightPercent(startMin, endMin);
                                if (height < 0.5) return null;

                                const procedureLabel =
                                    booking.procedure?.customProcedureName ??
                                    booking.procedure?.customProcedureCode ??
                                    'Procedure';

                                return (
                                    <div
                                        key={booking.id}
                                        className="absolute left-[66%] right-2 overflow-hidden rounded-xl border border-indigo-300 bg-indigo-100/80 px-3 py-2 shadow-sm"
                                        style={{ top: `${topPercent(startMin)}%`, height: `${height}%`, minHeight: 30 }}
                                        title={`${procedureLabel} · ${formatEnumLabel(booking.status as unknown as string)}`}
                                    >
                                        <p className="flex items-center gap-1 truncate text-[10px] font-black uppercase tracking-wide text-indigo-800">
                                            <Stethoscope size={9} />
                                            {procedureLabel}
                                        </p>
                                        <p className="truncate text-[10px] text-indigo-600">
                                            {formatEnumLabel(booking.status as unknown as string)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ListPanel
                    title="Available Windows"
                    subtitle={`${availability.length} slot${availability.length !== 1 ? 's' : ''} configured for this day of week`}
                    icon={Clock}
                    accentIcon="bg-cyan-100 text-cyan-700"
                    empty="No recurring availability configured for this day."
                >
                    {availability.map((slot: Availability) => {
                        const cfg = AVAILABILITY_CONFIG[slot.type] ?? AVAILABILITY_CONFIG[TheatreAvailabilityType.Regular];
                        const Icon = cfg.icon;

                        const slotStartMin = timeStrToMinutes(slot.startTime.slice(0, 5));
                        const slotEndMin = timeStrToMinutes(slot.endTime.slice(0, 5));

                        const overlappingBlocks = blockRanges
                            .map(({ block, startMin, endMin }) => ({
                                block,
                                overlapStart: Math.max(startMin, slotStartMin),
                                overlapEnd: Math.min(endMin, slotEndMin),
                            }))
                            .filter(({ overlapStart, overlapEnd }) => overlapEnd > overlapStart);

                        return (
                            <div
                                key={slot.id}
                                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cfg.pill}`}>
                                            <Icon size={9} />
                                            {cfg.label}
                                        </span>
                                        <p className="mt-2 text-sm font-bold text-slate-800">
                                            {formatTimeLabel(slot.startTime.slice(0, 5))} → {formatTimeLabel(slot.endTime.slice(0, 5))}
                                        </p>
                                        {slot.notes && (
                                            <p className="mt-1 truncate text-xs text-slate-500">{slot.notes}</p>
                                        )}
                                    </div>

                                    {overlappingBlocks.length > 0 && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                            <AlertTriangle size={10} />
                                            {overlappingBlocks.length} hold{overlappingBlocks.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                {overlappingBlocks.length > 0 && (
                                    <div className="mt-3 space-y-1.5 border-t border-dashed border-slate-100 pt-3">
                                        {overlappingBlocks.map(({ block, overlapStart, overlapEnd }) => (
                                            <div
                                                key={block.id}
                                                className="flex items-center gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5"
                                            >
                                                <Ban size={10} className="shrink-0 text-slate-500" />
                                                <p className="truncate text-[11px] font-semibold text-slate-600">
                                                    {formatMinutesRange(overlapStart, overlapEnd)}
                                                    {block.reason ? ` · ${block.reason}` : ` · ${formatEnumLabel(block.type as unknown as string)}`}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </ListPanel>

                <ListPanel
                    title="Active Holds"
                    subtitle={`${blocks.length} hold${blocks.length !== 1 ? 's' : ''} overlapping this day`}
                    icon={Ban}
                    accentIcon="bg-rose-100 text-rose-700"
                    empty="No maintenance holds or closures affect this day."
                >
                    {blocks.map((block: Block) => (
                        <div
                            key={block.id}
                            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tagStyle(block.type as unknown as string)}`}>
                                    {formatEnumLabel(block.type as unknown as string)}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tagStyle(block.status as unknown as string)}`}>
                                    {formatEnumLabel(block.status as unknown as string)}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-bold text-slate-800">
                                {formatBookingDateTime(block.startTime, true)}
                                {' → '}
                                {formatBookingDateTime(block.endTime, true)}
                            </p>

                            {block.reason && (
                                <p className="mt-1 text-xs leading-relaxed text-slate-500">{block.reason}</p>
                            )}
                        </div>
                    ))}
                </ListPanel>
            </div>

            <ListPanel
                title="Scheduled Procedures"
                subtitle={`${bookings.length} booking${bookings.length !== 1 ? 's' : ''} scheduled for this day`}
                icon={Stethoscope}
                accentIcon="bg-indigo-100 text-indigo-700"
                empty="No procedures are booked into this theatre for this day."
            >
                {bookings.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {bookings.map((booking: Booking) => {
                            const procedureLabel =
                                booking.procedure?.customProcedureName ??
                                booking.procedure?.customProcedureCode ??
                                booking.procedure?.procedureCatalog?.name ??
                                'Unnamed procedure';

                            return (
                                <div
                                    key={booking.id}
                                    className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:border-slate-200 hover:shadow-md"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${tagStyle(booking.status as unknown as string)}`}>
                                            {formatEnumLabel(booking.status as unknown as string)}
                                        </span>
                                        {booking.procedure?.customProcedureCode && (
                                            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-mono font-semibold text-slate-500">
                                                {booking.procedure.customProcedureCode}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 truncate text-sm font-bold text-slate-800">{procedureLabel}</p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {formatBookingDateTime(booking.scheduledStartTime, true)}
                                        {' → '}
                                        {formatBookingDateTime(booking.scheduledEndTime)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ListPanel>
        </div>
    );
}

function ListPanel({
    title,
    subtitle,
    icon: Icon,
    accentIcon,
    empty,
    children,
}: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    accentIcon: string;
    empty: string;
    children: React.ReactNode;
}) {
    const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

    return (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-6 py-5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentIcon}`}>
                    <Icon size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-500">{subtitle}</p>
                </div>
            </div>

            <div className="space-y-3 p-5">
                {hasChildren ? (
                    children
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-xs font-medium text-slate-400">{empty}</p>
                    </div>
                )}
            </div>
        </div>
    );
}