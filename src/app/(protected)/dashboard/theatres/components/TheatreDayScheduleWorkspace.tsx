'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';

import {
    AlertTriangle,
    ArrowLeft,
    Ban,
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
        band: '!bg-[#EFF5FF] !border-[#D6E4FB]',
        dot: '!bg-[#1D6FE0]',
        pill: '!bg-[#EFF5FF] !border-[#D6E4FB] !text-[#1D6FE0]',
    },
    [TheatreAvailabilityType.Emergency]: {
        label: 'Emergency',
        icon: Flame,
        band: '!bg-[#FEF2F2] !border-[#FBD5D5]',
        dot: '!bg-[#DC2626]',
        pill: '!bg-[#FEF2F2] !border-[#FBD5D5] !text-[#DC2626]',
    },
    [TheatreAvailabilityType.SpecialSession]: {
        label: 'Special',
        icon: Zap,
        band: '!bg-[#F5F2FF] !border-[#E5DCFC]',
        dot: '!bg-[#7C5CFC]',
        pill: '!bg-[#F5F2FF] !border-[#E5DCFC] !text-[#7C5CFC]',
    },
};

const STATUS_CONFIG: Record<
    TheatreScheduleStatus,
    { label: string; sub: string; icon: React.ElementType; accent: string; text: string; chip: string }
> = {
    [TheatreScheduleStatus.Available]: {
        label: 'Available',
        sub: 'Open operating windows with no active holds',
        icon: ShieldCheck,
        accent: '!bg-[#1D9E75]',
        text: '!text-[#1D9E75]',
        chip: '!bg-[#ECFBF5]',
    },
    [TheatreScheduleStatus.Partial]: {
        label: 'Partially blocked',
        sub: 'Some operating windows overlap with active holds',
        icon: ShieldQuestion,
        accent: '!bg-[#D08A2E]',
        text: '!text-[#B9770E]',
        chip: '!bg-[#FFF8EC]',
    },
    [TheatreScheduleStatus.Blocked]: {
        label: 'Blocked',
        sub: 'No open windows — theatre is held for the full day',
        icon: Ban,
        accent: '!bg-[#DC2626]',
        text: '!text-[#DC2626]',
        chip: '!bg-[#FEF2F2]',
    },
};

const NEUTRAL_TAG = '!bg-[#F7F7F5] !border-[#E8E6E0] !text-[#767570]';

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
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong'
            );
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
    const blocks = useMemo(() => schedule.blocks ?? [], [schedule.blocks]);
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
        <div className="space-y-4 sm:space-y-6">
            <header className="relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="p-5 sm:p-8">
                    <Link
                        href={`/dashboard/theatres/${theatreId}`}
                        className="mb-5 inline-flex items-center gap-1.5 rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-1.5 text-xs font-medium !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
                    >
                        <ArrowLeft size={12} />
                        Back to theatre
                    </Link>

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                                    Day Schedule Console
                                </p>
                            </div>

                            <h1 className="mt-3 text-[22px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[28px]">
                                {theatre.name}
                            </h1>

                            <p className="mt-2 text-sm leading-relaxed !text-[#767570]">
                                {theatre.code ?? 'No code'} · {theatre.department?.replace(/_/g, ' ')}
                                {theatre.floor ? ` · Floor ${theatre.floor}` : ''}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-3">
                            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${statusConfig.chip}`}>
                                <StatusIcon size={17} className={statusConfig.text} />
                            </span>
                            <div>
                                <p className={`text-sm font-semibold ${statusConfig.text}`}>{statusConfig.label}</p>
                                <p className="text-[11px] !text-[#B4B2A9]">{statusConfig.sub}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex w-fit max-w-full flex-wrap items-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-2">
                        <button
                            onClick={() => shiftDay(-1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg !text-[#767570] transition hover:!bg-white hover:!text-[#16211B] disabled:opacity-50"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <div className="flex items-center gap-2 px-1">
                            <span className="text-sm font-semibold !text-[#16211B]">{dateHeading}</span>
                            {isToday && (
                                <span className="rounded-full !bg-[#ECFBF5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide !text-[#1D9E75]">
                                    Today
                                </span>
                            )}
                        </div>

                        <button
                            onClick={() => shiftDay(1)}
                            disabled={loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg !text-[#767570] transition hover:!bg-white hover:!text-[#16211B] disabled:opacity-50"
                        >
                            <ChevronRight size={16} />
                        </button>

                        <input
                            type="date"
                            value={dayString}
                            onChange={(e) => e.target.value && loadDay(e.target.value)}
                            className="rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-2 text-xs font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                        />

                        {!isToday && (
                            <button
                                onClick={() => loadDay(toLocalDayString(new Date()))}
                                disabled={loading}
                                className="rounded-lg px-3 py-2 text-xs font-semibold !text-[#1D9E75] transition hover:!bg-[#ECFBF5] disabled:opacity-50"
                            >
                                Jump to today
                            </button>
                        )}

                        <button
                            onClick={() => loadDay(dayString)}
                            disabled={loading}
                            className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium !text-[#767570] transition hover:!bg-white hover:!text-[#16211B] disabled:opacity-50"
                        >
                            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 !text-[#DC2626]" />
                    <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
                </div>
            )}

            <div className={`overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition ${loading ? 'opacity-60' : ''}`}>
                <div className="flex flex-col gap-3 border-b !border-[#E8E6E0] px-4 py-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg !bg-[#ECFBF5]">
                            <Clock className="h-4 w-4 !text-[#1D9E75]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold !text-[#16211B] sm:text-base">Day timeline</h2>
                            <p className="text-xs !text-[#767570]">06:00 – 22:00 · holds are cut directly into their availability window</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:ml-auto sm:gap-4">
                        {Object.entries(AVAILABILITY_CONFIG).map(([type, cfg]) => (
                            <div key={type} className="flex items-center gap-1.5">
                                <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                <span className="text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">{cfg.label}</span>
                            </div>
                        ))}
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full !bg-[#16211B]" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">Hold</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full !bg-[#1D9E75]" />
                            <span className="text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">Booking</span>
                        </div>
                    </div>
                </div>

                <div
                    className="overflow-x-auto hide-scrollbar"
                    style={{
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                    }}
                >
                    <div className="grid min-w-[560px] grid-cols-[48px_1fr]">
                        <div className="relative" style={{ height: 440 }}>
                            {HOUR_MARKS.map((h) => (
                                <div
                                    key={h}
                                    className="absolute right-2 -translate-y-1/2 text-[9px] font-medium tabular-nums !text-[#B4B2A9]"
                                    style={{ top: `${topPercent(h * 60)}%` }}
                                >
                                    {fmtHour(h)}
                                </div>
                            ))}
                        </div>

                        <div className="relative border-l !border-[#E8E6E0]" style={{ height: 440 }}>
                            {HOUR_MARKS.map((h) => (
                                <div
                                    key={h}
                                    className="absolute left-0 right-0 border-t !border-[#F0EFE9]"
                                    style={{ top: `${topPercent(h * 60)}%` }}
                                />
                            ))}

                            {availability.length === 0 && blocks.length === 0 && bookings.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <p className="text-sm font-medium !text-[#B4B2A9]">Nothing scheduled for this day</p>
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
                                        className={`absolute left-2 right-[36%] overflow-hidden rounded-lg border px-2.5 py-1.5 ${cfg.band}`}
                                        style={{ top: `${topPercent(startMin)}%`, height: `${height}%`, minHeight: 30 }}
                                        title={`${formatTimeLabel(slot.startTime.slice(0, 5))} – ${formatTimeLabel(slot.endTime.slice(0, 5))}${slot.notes ? ` · ${slot.notes}` : ''}`}
                                    >
                                        <p className="truncate text-[11px] font-semibold !text-[#16211B]">
                                            {formatTimeLabel(slot.startTime.slice(0, 5))} – {formatTimeLabel(slot.endTime.slice(0, 5))}
                                        </p>
                                        <p className="truncate text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">
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
                                        className="absolute left-3 right-[calc(36%+4px)] z-10 overflow-hidden rounded-lg border !border-[#16211B] !bg-[#0c1a12] px-2.5 py-1.5 !text-white"
                                        style={{
                                            top: `${topPercent(startMin)}%`,
                                            height: `${height}%`,
                                            minHeight: 26,
                                            backgroundImage:
                                                'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 6px, transparent 6px, transparent 12px)',
                                        }}
                                        title={block.reason ?? 'Active hold'}
                                    >
                                        <p className="flex items-center gap-1 truncate text-[10px] font-semibold uppercase tracking-wide">
                                            <Ban size={9} />
                                            {formatEnumLabel(block.type as unknown as string)}
                                        </p>
                                        {block.reason && (
                                            <p className="mt-0.5 truncate text-[10px] !text-white/70">{block.reason}</p>
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
                                        className="absolute left-[66%] right-2 overflow-hidden rounded-lg border !border-[#CFF0E1] !bg-[#ECFBF5] px-2.5 py-1.5"
                                        style={{ top: `${topPercent(startMin)}%`, height: `${height}%`, minHeight: 30 }}
                                        title={`${procedureLabel} · ${formatEnumLabel(booking.status as unknown as string)}`}
                                    >
                                        <p className="flex items-center gap-1 truncate text-[10px] font-semibold uppercase tracking-wide !text-[#1D9E75]">
                                            <Stethoscope size={9} />
                                            {procedureLabel}
                                        </p>
                                        <p className="truncate text-[10px] !text-[#1D9E75]/70">
                                            {formatEnumLabel(booking.status as unknown as string)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
                <ListPanel
                    title="Available windows"
                    subtitle={`${availability.length} slot${availability.length !== 1 ? 's' : ''} configured for this day of week`}
                    icon={Clock}
                    iconBg="!bg-[#EFF5FF]"
                    iconColor="!text-[#1D6FE0]"
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
                                className="rounded-xl border !border-[#E8E6E0] !bg-white p-4 transition hover:!border-[#D3D1C7]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.pill}`}>
                                            <Icon size={9} />
                                            {cfg.label}
                                        </span>
                                        <p className="mt-2 text-sm font-semibold !text-[#16211B]">
                                            {formatTimeLabel(slot.startTime.slice(0, 5))} → {formatTimeLabel(slot.endTime.slice(0, 5))}
                                        </p>
                                        {slot.notes && (
                                            <p className="mt-1 truncate text-xs !text-[#767570]">{slot.notes}</p>
                                        )}
                                    </div>

                                    {overlappingBlocks.length > 0 && (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border !border-[#F5E3C0] !bg-[#FFF8EC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide !text-[#B9770E]">
                                            <AlertTriangle size={10} />
                                            {overlappingBlocks.length} hold{overlappingBlocks.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>

                                {overlappingBlocks.length > 0 && (
                                    <div className="mt-3 space-y-1.5 border-t border-dashed !border-[#E8E6E0] pt-3">
                                        {overlappingBlocks.map(({ block, overlapStart, overlapEnd }) => (
                                            <div
                                                key={block.id}
                                                className="flex items-center gap-2 rounded-lg !bg-[#FAFAF8] px-2.5 py-1.5"
                                            >
                                                <Ban size={10} className="shrink-0 !text-[#B4B2A9]" />
                                                <p className="truncate text-[11px] font-medium !text-[#5F5E5A]">
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
                    title="Active holds"
                    subtitle={`${blocks.length} hold${blocks.length !== 1 ? 's' : ''} overlapping this day`}
                    icon={Ban}
                    iconBg="!bg-[#FEF2F2]"
                    iconColor="!text-[#DC2626]"
                    empty="No maintenance holds or closures affect this day."
                >
                    {blocks.map((block: Block) => (
                        <div
                            key={block.id}
                            className="rounded-xl border !border-[#E8E6E0] !bg-white p-4 transition hover:!border-[#D3D1C7]"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${NEUTRAL_TAG}`}>
                                    {formatEnumLabel(block.type as unknown as string)}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${NEUTRAL_TAG}`}>
                                    {formatEnumLabel(block.status as unknown as string)}
                                </span>
                            </div>

                            <p className="mt-2 text-sm font-semibold !text-[#16211B]">
                                {formatBookingDateTime(block.startTime, true)}
                                {' → '}
                                {formatBookingDateTime(block.endTime, true)}
                            </p>

                            {block.reason && (
                                <p className="mt-1 text-xs leading-relaxed !text-[#767570]">{block.reason}</p>
                            )}
                        </div>
                    ))}
                </ListPanel>
            </div>

            <ListPanel
                title="Scheduled procedures"
                subtitle={`${bookings.length} booking${bookings.length !== 1 ? 's' : ''} scheduled for this day`}
                icon={Stethoscope}
                iconBg="!bg-[#ECFBF5]"
                iconColor="!text-[#1D9E75]"
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
                                    className="rounded-xl border !border-[#E8E6E0] !bg-white p-4 transition hover:!border-[#D3D1C7]"
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${NEUTRAL_TAG}`}>
                                            {formatEnumLabel(booking.status as unknown as string)}
                                        </span>
                                        {booking.procedure?.customProcedureCode && (
                                            <span className="rounded-full border !border-[#E8E6E0] !bg-[#FAFAF8] px-2 py-0.5 font-mono text-[10px] font-semibold !text-[#B4B2A9]">
                                                {booking.procedure.customProcedureCode}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 truncate text-sm font-semibold !text-[#16211B]">{procedureLabel}</p>

                                    <p className="mt-1 text-xs !text-[#767570]">
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
    iconBg,
    iconColor,
    empty,
    children,
}: {
    title: string;
    subtitle: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    empty: string;
    children: React.ReactNode;
}) {
    const hasChildren = Array.isArray(children) ? children.length > 0 : !!children;

    return (
        <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
            <div className="flex items-center gap-3 border-b !border-[#E8E6E0] px-4 py-4 sm:px-6 sm:py-5">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                    <Icon size={16} />
                </div>
                <div>
                    <h3 className="text-sm font-semibold !text-[#16211B]">{title}</h3>
                    <p className="text-xs !text-[#767570]">{subtitle}</p>
                </div>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
                {hasChildren ? (
                    children
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <p className="text-xs font-medium !text-[#B4B2A9]">{empty}</p>
                    </div>
                )}
            </div>
        </div>
    );
}