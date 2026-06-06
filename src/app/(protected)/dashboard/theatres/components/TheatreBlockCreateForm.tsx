'use client';

import { useCallback, useState } from 'react';

import {
    AlertTriangle,
    CheckCircle2,
    Droplets,
    Lock,
    Shield,
    Sparkles,
    Thermometer,
    TriangleAlert,
    Wrench,
    Zap,
} from 'lucide-react';

import { TheatreBlockType } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

interface Props {
    theatreId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

const TYPE_OPTIONS: {
    value: TheatreBlockType;
    label: string;
    description: string;
    icon: React.ElementType;
    pill: string;
    ring: string;
}[] = [
        {
            value: TheatreBlockType.Maintenance,
            label: 'Maintenance',
            description: 'Routine equipment servicing or infrastructure work',
            icon: Wrench,
            pill: 'bg-amber-50 border-amber-300 text-amber-700',
            ring: 'ring-amber-400',
        },
        {
            value: TheatreBlockType.Cleaning,
            label: 'Cleaning',
            description: 'Deep clean, terminal clean, or post-case housekeeping',
            icon: Sparkles,
            pill: 'bg-cyan-50 border-cyan-300 text-cyan-700',
            ring: 'ring-cyan-400',
        },
        {
            value: TheatreBlockType.EquipmentFailure,
            label: 'Equipment Failure',
            description: 'Unplanned breakdown requiring repair or replacement',
            icon: TriangleAlert,
            pill: 'bg-orange-50 border-orange-300 text-orange-700',
            ring: 'ring-orange-400',
        },
        {
            value: TheatreBlockType.InfectionControl,
            label: 'Infection Control',
            description: 'Isolation protocols, outbreak response, decontamination',
            icon: Shield,
            pill: 'bg-red-50 border-red-300 text-red-700',
            ring: 'ring-red-400',
        },
        {
            value: TheatreBlockType.Sterilization,
            label: 'Sterilization',
            description: 'Instrument sterilization cycle or autoclave downtime',
            icon: Thermometer,
            pill: 'bg-violet-50 border-violet-300 text-violet-700',
            ring: 'ring-violet-400',
        },
        {
            value: TheatreBlockType.Reserved,
            label: 'Reserved',
            description: 'Held for a specific team, case, or event',
            icon: Droplets,
            pill: 'bg-blue-50 border-blue-300 text-blue-700',
            ring: 'ring-blue-400',
        },
        {
            value: TheatreBlockType.Other,
            label: 'Other',
            description: 'Any other reason not covered above',
            icon: Zap,
            pill: 'bg-slate-50 border-slate-300 text-slate-600',
            ring: 'ring-slate-400',
        },
    ];

export default function TheatreBlockCreateForm({
    theatreId,
    onSuccess,
    onCancel,
}: Props) {
    const [type, setType] = useState<TheatreBlockType>(
        TheatreBlockType.Maintenance,
    );
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [reason, setReason] = useState('');

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = useCallback(async () => {
        setError(null);

        if (!startTime || !endTime) {
            setError('Start and end times are required.');
            return;
        }

        if (new Date(startTime) >= new Date(endTime)) {
            setError('Start time must be before end time.');
            return;
        }

        setSaving(true);
        try {
            const res = await clientFetch('/api/theatre/block/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    theatreId,
                    startTime,
                    endTime,
                    type,
                    reason: reason || undefined,
                }),
            });

            if (!res.ok) {
                const json = await res.json();
                throw new Error(json.error ?? 'Failed to create theatre block');
            }

            setSaved(true);
            setTimeout(() => onSuccess(), 800);
        } catch (err: any) {
            setError(err.message ?? 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    }, [theatreId, startTime, endTime, type, reason, onSuccess]);

    return (
        <div className="space-y-6">
            <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
                    Block Type
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TYPE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = type === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setType(opt.value)}
                                className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${selected
                                        ? `${opt.pill} ring-2 ${opt.ring}`
                                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                                    }`}
                            >
                                <div
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-white/60' : 'bg-slate-100'
                                        }`}
                                >
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900">
                                        {opt.label}
                                    </p>
                                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                                        {opt.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
                    Block Window
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FieldBox label="Start Date & Time">
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                        />
                    </FieldBox>
                    <FieldBox label="End Date & Time">
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                        />
                    </FieldBox>
                </div>
            </div>

            <div>
                <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
                    Reason <span className="font-normal normal-case text-slate-400">(optional)</span>
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Annual deep clean and equipment calibration"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
                />
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-600" />
                    <p className="text-sm font-medium text-rose-800">{error}</p>
                </div>
            )}

            {saved && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                    <p className="text-sm font-medium text-emerald-800">
                        Theatre block created successfully!
                    </p>
                </div>
            )}

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
                <p className="text-xs text-slate-500">
                    This will immediately <strong className="text-slate-700">restrict</strong> bookings
                    for the specified window.
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
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60 active:scale-95"
                    >
                        {saving ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                Creating…
                            </>
                        ) : (
                            <>
                                <Lock size={13} />
                                Create Block
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
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
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                {label}
            </label>
            {children}
        </div>
    );
}