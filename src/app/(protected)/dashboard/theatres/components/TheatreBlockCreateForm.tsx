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
    active: string;
    iconActive: string;
}[] = [
        {
            value: TheatreBlockType.Maintenance,
            label: 'Maintenance',
            description: 'Routine equipment servicing or infrastructure work',
            icon: Wrench,
            active: '!border-[#F5E3C0] !bg-[#FFF8EC]',
            iconActive: '!bg-white !text-[#B9770E]',
        },
        {
            value: TheatreBlockType.Cleaning,
            label: 'Cleaning',
            description: 'Deep clean, terminal clean, or post-case housekeeping',
            icon: Sparkles,
            active: '!border-[#D6E4FB] !bg-[#EFF5FF]',
            iconActive: '!bg-white !text-[#1D6FE0]',
        },
        {
            value: TheatreBlockType.EquipmentFailure,
            label: 'Equipment failure',
            description: 'Unplanned breakdown requiring repair or replacement',
            icon: TriangleAlert,
            active: '!border-[#FAD9C4] !bg-[#FFF1E9]',
            iconActive: '!bg-white !text-[#C2571C]',
        },
        {
            value: TheatreBlockType.InfectionControl,
            label: 'Infection control',
            description: 'Isolation protocols, outbreak response, decontamination',
            icon: Shield,
            active: '!border-[#FBD5D5] !bg-[#FEF2F2]',
            iconActive: '!bg-white !text-[#DC2626]',
        },
        {
            value: TheatreBlockType.Sterilization,
            label: 'Sterilization',
            description: 'Instrument sterilization cycle or autoclave downtime',
            icon: Thermometer,
            active: '!border-[#E5DCFC] !bg-[#F5F2FF]',
            iconActive: '!bg-white !text-[#7C5CFC]',
        },
        {
            value: TheatreBlockType.Reserved,
            label: 'Reserved',
            description: 'Held for a specific team, case, or event',
            icon: Droplets,
            active: '!border-[#CFF0E1] !bg-[#ECFBF5]',
            iconActive: '!bg-white !text-[#1D9E75]',
        },
        {
            value: TheatreBlockType.Other,
            label: 'Other',
            description: 'Any other reason not covered above',
            icon: Zap,
            active: '!border-[#16211B] !bg-[#F7F7F5]',
            iconActive: '!bg-white !text-[#16211B]',
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
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong',
            );
        } finally {
            setSaving(false);
        }
    }, [theatreId, startTime, endTime, type, reason, onSuccess]);

    return (
        <div className="space-y-5 sm:space-y-6">
            <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                    Block type
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {TYPE_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const selected = type === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => setType(opt.value)}
                                className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition sm:p-4 ${selected
                                    ? opt.active
                                    : '!border-[#E8E6E0] !bg-white hover:!bg-[#FAFAF8]'
                                    }`}
                            >
                                <div
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected ? opt.iconActive : '!bg-[#F7F7F5] !text-[#B4B2A9]'
                                        }`}
                                >
                                    <Icon size={15} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold !text-[#16211B]">
                                        {opt.label}
                                    </p>
                                    <p className="mt-0.5 text-[11px] leading-relaxed !text-[#767570]">
                                        {opt.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                    Block window
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldBox label="Start date & time">
                        <input
                            type="datetime-local"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#DC2626]"
                        />
                    </FieldBox>
                    <FieldBox label="End date & time">
                        <input
                            type="datetime-local"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#DC2626]"
                        />
                    </FieldBox>
                </div>
            </div>

            <div>
                <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                    Reason <span className="font-normal normal-case !text-[#D3D1C7]">(optional)</span>
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    placeholder="e.g. Annual deep clean and equipment calibration"
                    className="w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#DC2626]"
                />
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
                    <p className="text-sm font-medium !text-[#1D9E75]">
                        Theatre block created successfully.
                    </p>
                </div>
            )}

            <div className="flex flex-col gap-4 rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-4 sm:px-5 sm:py-4">
                <p className="text-xs !text-[#767570] text-center sm:text-left">
                    This will immediately <strong className="font-semibold !text-[#16211B]">restrict</strong> bookings
                    for the specified window.
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
                        className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#DC2626] px-4 sm:px-5 text-xs sm:text-sm font-semibold !text-white transition hover:!bg-[#C11F1F] disabled:cursor-not-allowed disabled:opacity-50 order-1 sm:order-2"
                    >
                        {saving ? (
                            <>
                                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                                <span className="sm:hidden">Creating…</span>
                                <span className="hidden sm:inline">Creating…</span>
                            </>
                        ) : (
                            <>
                                <Lock size={14} className="sm:hidden" />
                                <Lock size={13} className="hidden sm:inline" />
                                <span className="sm:hidden">Block</span>
                                <span className="hidden sm:inline">Create block</span>
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
            <label className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
                {label}
            </label>
            {children}
        </div>
    );
}