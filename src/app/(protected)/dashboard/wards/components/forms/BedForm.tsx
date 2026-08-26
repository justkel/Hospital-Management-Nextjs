'use client';

import { useMemo, useState } from 'react';

import {
    Input,
    Button,
    message,
    Select,
    Switch,
    Tag,
    Tooltip,
} from 'antd';

import {
    PlusOutlined,
    DeleteOutlined,
    CloseOutlined,
} from '@ant-design/icons';

import {
    BedDouble,
    Activity,
} from 'lucide-react';

import {
    BedClass,
    BedStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type BedDraft = {
    bedId?: string;
    name: string;
    class: BedClass;
    status?: BedStatus;
    isActive: boolean;
};

type InitialBed = {
    id: string;
    name: string;
    class: BedClass;
    status?: BedStatus;
    isActive: boolean;
};

type BedFormProps = {
    wardId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
    mode?: 'create' | 'edit';
    initial?: InitialBed;
};

type BedMutationResponse = {
    error?: string;
    message?: string;
};

const STATUS_STYLES: Record<string, string> = {
    AVAILABLE: '!bg-[#ECFBF5] !text-[#1D9E75] !border-[#CFF0E1]',
    OCCUPIED: '!bg-[#FEF2F2] !text-[#DC2626] !border-[#FBD5D5]',
    CLEANING: '!bg-[#FFF8EC] !text-[#B9770E] !border-[#F5E3C0]',
    MAINTENANCE: '!bg-[#F7F7F5] !text-[#767570] !border-[#E8E6E0]',
    BLOCKED: '!bg-[#FFF1E9] !text-[#C2571C] !border-[#FAD9C4]',
    RESERVED: '!bg-[#EFF5FF] !text-[#1D6FE0] !border-[#D6E4FB]',
    ISOLATION: '!bg-[#F5F2FF] !text-[#7C5CFC] !border-[#E5DCFC]',
    DECOMMISSIONED: '!bg-[#F7F7F5] !text-[#B4B2A9] !border-[#E8E6E0]',
};

export default function BedForm({
    wardId,
    onSuccess,
    onCancel,
    mode = 'create',
    initial,
}: BedFormProps) {
    const isEdit = mode === 'edit';

    const [beds, setBeds] = useState<BedDraft[]>(
        initial
            ? [
                {
                    bedId: initial.id,
                    name: initial.name,
                    class: initial.class,
                    status: initial.status,
                    isActive: initial.isActive,
                },
            ]
            : [
                {
                    name: '',
                    class: BedClass.Standard,
                    status: BedStatus.Available,
                    isActive: true,
                },
            ],
    );

    const [loading, setLoading] = useState(false);

    const canSubmit = useMemo(
        () => beds.every(b => b.name.trim() && b.class),
        [beds],
    );

    function update<K extends keyof BedDraft>(
        index: number,
        key: K,
        value: BedDraft[K],
    ) {
        setBeds(prev =>
            prev.map((bed, i) =>
                i === index ? { ...bed, [key]: value } : bed,
            ),
        );
    }

    function addRow() {
        setBeds(prev => [
            ...prev,
            {
                name: '',
                class: BedClass.Standard,
                status: BedStatus.Available,
                isActive: true,
            },
        ]);
    }

    function removeRow(index: number) {
        setBeds(prev => prev.filter((_, i) => i !== index));
    }

    async function submit() {
        if (!canSubmit) {
            message.warning('Please complete all required fields');
            return;
        }

        setLoading(true);

        let failed = 0;
        let lastError: string | null = null;

        try {
            await Promise.all(
                beds.map(async b => {
                    const url = isEdit ? '/api/bed/update' : '/api/bed/create';

                    const payload = isEdit
                        ? {
                            bedId: b.bedId,
                            name: b.name,
                            class: b.class,
                            status: b.status,
                            isActive: b.isActive,
                        }
                        : {
                            wardId,
                            name: b.name,
                            class: b.class,
                            status: b.status,
                            isActive: b.isActive,
                        };

                    try {
                        const res = await clientFetch(url, {
                            method: 'POST',
                            body: JSON.stringify(payload),
                        });

                        let json: BedMutationResponse | null = null;

                        try {
                            json = await res.json();
                        } catch { }

                        if (!res.ok) {
                            failed++;
                            lastError = json?.error || json?.message || 'Operation failed';
                        }
                    } catch (err) {
                        failed++;
                        lastError = err instanceof Error ? err.message : 'Network error occurred';
                    }
                }),
            );

            if (failed > 0) {
                message.error(lastError || 'Operation failed');
                return;
            }

            message.success(
                isEdit ? 'Bed updated successfully' : 'Beds deployed successfully',
            );

            onSuccess?.();

            if (!isEdit) {
                setBeds([
                    {
                        name: '',
                        class: BedClass.Standard,
                        status: BedStatus.Available,
                        isActive: true,
                    },
                ]);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="flex items-start justify-between gap-3 px-5 py-5 sm:px-7 sm:py-6">
                    <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
                            <BedDouble size={18} className="!text-[#1D9E75]" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                                    {isEdit ? 'Update bed' : 'Deploy ward beds'}
                                </h1>
                            </div>

                            <p className="mt-1.5 max-w-xl text-sm leading-relaxed !text-[#767570]">
                                Configure and manage ward beds with status tracking.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <div className="rounded-lg border !border-[#E8E6E0] !bg-[#FAFAF8] px-3 py-2">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                                        {isEdit ? 'Beds being updated' : 'Beds to be added'}
                                    </p>
                                    <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums !text-[#16211B]">
                                        {beds.length}
                                    </p>
                                </div>

                                <div className="rounded-lg border !border-[#E8E6E0] !bg-[#FAFAF8] px-3 py-2">
                                    <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                                        {isEdit ? 'Active after update' : 'Active to be added'}
                                    </p>
                                    <p className="mt-0.5 font-mono text-lg font-semibold tabular-nums !text-[#16211B]">
                                        {beds.filter(b => b.isActive).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onCancel}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
                    >
                        <CloseOutlined />
                    </button>
                </div>
            </div>

            <div
                className="max-h-[58vh] space-y-3 overflow-y-auto pr-0 sm:pr-1"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {beds.map((b, i) => (
                    <div
                        key={i}
                        className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white p-4 sm:p-5"
                    >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A]">
                                    <BedDouble size={19} />
                                </div>

                                <div className="min-w-0">
                                    <div className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                        Bed slot
                                    </div>

                                    <h3 className="truncate text-base font-semibold !text-[#16211B] sm:text-lg">
                                        Bed #{i + 1}
                                    </h3>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Tag
                                    className={`m-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[b.status || BedStatus.Available]}`}
                                >
                                    {b.status}
                                </Tag>

                                {!isEdit && beds.length > 1 && (
                                    <Tooltip title="Remove bed">
                                        <button
                                            onClick={() => removeRow(i)}
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626] transition hover:!bg-[#FDE4E4]"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </Tooltip>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                    Bed name
                                </label>

                                <Input
                                    size="large"
                                    placeholder="e.g. ICU-A1"
                                    value={b.name}
                                    onChange={e => update(i, 'name', e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                    Bed class
                                </label>

                                <Select
                                    size="large"
                                    value={b.class}
                                    onChange={v => update(i, 'class', v)}
                                    className="w-full"
                                    options={Object.values(BedClass).map(c => ({
                                        value: c,
                                        label: c,
                                    }))}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                    Initial status
                                </label>

                                <Select
                                    size="large"
                                    value={b.status}
                                    onChange={v => update(i, 'status', v)}
                                    className="w-full"
                                    options={Object.values(BedStatus).map(s => ({
                                        value: s,
                                        label: s,
                                    }))}
                                />
                            </div>

                            <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-sm font-semibold !text-[#16211B]">
                                            <Activity size={15} className="!text-[#767570]" />
                                            Operational state
                                        </div>
                                        <p className="mt-1 text-xs leading-relaxed !text-[#767570]">
                                            Control whether this bed can be assigned within the ward.
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center">
                                        <Switch
                                            checked={b.isActive}
                                            onChange={v => update(i, 'isActive', v)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="sticky bottom-0 z-10 rounded-2xl border !border-[#E8E6E0] !bg-white p-3.5 sm:p-4">
                <div className="flex flex-col gap-3 lg:flex-row">
                    {!isEdit && (
                        <Button
                            icon={<PlusOutlined />}
                            onClick={addRow}
                            disabled={loading}
                            className="!h-12 w-full !rounded-xl !border !border-[#E8E6E0] !bg-white text-sm font-semibold !text-[#5F5E5A] hover:!bg-[#F7F7F5] lg:flex-1"
                        >
                            Add another bed
                        </Button>
                    )}

                    <Button
                        type="primary"
                        loading={loading}
                        disabled={!canSubmit}
                        onClick={submit}
                        className="!h-12 w-full !rounded-xl !border-0 !bg-[#0c1a12] text-sm font-semibold hover:!bg-[#16211B] lg:flex-1"
                    >
                        {loading
                            ? isEdit ? 'Updating bed…' : 'Deploying beds…'
                            : isEdit ? 'Update bed' : 'Deploy beds'}
                    </Button>
                </div>
            </div>
        </div>
    );
}