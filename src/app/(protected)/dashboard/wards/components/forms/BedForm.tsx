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
} from '@ant-design/icons';

import {
    BedDouble,
    ShieldCheck,
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

const STATUS_STYLES: Record<string, string> = {
    AVAILABLE:
        'bg-emerald-50 text-emerald-700 border-emerald-200',

    OCCUPIED:
        'bg-red-50 text-red-700 border-red-200',

    CLEANING:
        'bg-amber-50 text-amber-700 border-amber-200',

    MAINTENANCE:
        'bg-slate-100 text-slate-700 border-slate-200',

    BLOCKED:
        'bg-orange-50 text-orange-700 border-orange-200',

    RESERVED:
        'bg-blue-50 text-blue-700 border-blue-200',

    ISOLATION:
        'bg-purple-50 text-purple-700 border-purple-200',

    DECOMMISSIONED:
        'bg-zinc-100 text-zinc-600 border-zinc-200',
};

export default function BedForm({
    wardId,
    onSuccess,
    mode = 'create',
    initial,
}: any) {
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
        () =>
            beds.every(
                b =>
                    b.name.trim() &&
                    b.class,
            ),
        [beds],
    );

    function update(
        index: number,
        key: keyof BedDraft,
        value: any,
    ) {
        const copy = [...beds];

        (copy[index] as any)[key] = value;

        setBeds(copy);
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
        setBeds(prev =>
            prev.filter((_, i) => i !== index),
        );
    }

    async function submit() {
        if (!canSubmit) {
            message.warning(
                'Please complete all required fields',
            );

            return;
        }

        setLoading(true);

        let failed = 0;

        let lastError: string | null = null;

        try {
            await Promise.all(
                beds.map(async b => {
                    const url = isEdit
                        ? '/api/bed/update'
                        : '/api/bed/create';

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

                        let json: any = null;

                        try {
                            json = await res.json();
                        } catch { }

                        if (!res.ok) {
                            failed++;

                            lastError =
                                json?.error ||
                                json?.message ||
                                'Operation failed';
                        }
                    } catch (err: any) {
                        failed++;

                        lastError =
                            err?.message ||
                            'Network error occurred';
                    }
                }),
            );

            if (failed > 0) {
                message.error(
                    lastError || 'Operation failed',
                );

                return;
            }

            message.success(
                isEdit
                    ? 'Bed updated successfully'
                    : 'Beds deployed successfully',
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
        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[36px]">

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-16 -top-16 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-cyan-200/40 blur-3xl" />

                <div className="absolute -bottom-16 -left-16 h-40 w-40 sm:h-72 sm:w-72 rounded-full bg-blue-200/40 blur-3xl" />
            </div>

            <div className="relative space-y-5 sm:space-y-6">
                <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/80 shadow-[0_12px_45px_rgba(0,0,0,0.06)] backdrop-blur-xl">

                    <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-700 px-4 py-5 sm:px-7 sm:py-7">
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                            <div className="min-w-0 flex-1">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-[11px] sm:text-xs font-medium text-blue-100 backdrop-blur">
                                    <ShieldCheck size={14} />
                                    Enterprise Bed Management
                                </div>

                                <div className="mt-4">
                                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                                        {isEdit
                                            ? 'Update Bed'
                                            : 'Deploy Ward Beds'}
                                    </h1>

                                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/90 sm:text-base">
                                        Configure and manage ward beds with status tracking.
                                    </p>
                                </div>
                            </div>

                            <div className="grid w-full grid-cols-2 gap-3 sm:w-auto sm:min-w-[260px]">
                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-blue-100">
                                        {isEdit
                                            ? 'Beds being updated'
                                            : 'Beds to be added'}
                                    </div>

                                    <div className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                                        {beds.length}
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                                    <div className="text-[10px] uppercase tracking-[0.2em] text-blue-100">
                                        {isEdit
                                            ? 'Active after update'
                                            : 'Active to be added'}
                                    </div>

                                    <div className="mt-1 text-2xl sm:text-3xl font-bold text-white">
                                        {
                                            beds.filter(
                                                b => b.isActive,
                                            ).length
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 border-t border-slate-100 p-4 sm:grid-cols-2 xl:grid-cols-3 sm:p-5">
                        <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <BedDouble size={20} />
                            </div>

                            <div className="min-w-0">
                                <p className="text-xs text-slate-500">
                                    Bed Classes
                                </p>

                                <p className="truncate font-semibold text-slate-900">
                                    Operational Categories
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-h-[58vh] space-y-4 overflow-y-auto pr-0 sm:pr-1">
                    {beds.map((b, i) => (
                        <div
                            key={i}
                            className="group relative overflow-hidden rounded-[24px] sm:rounded-[30px] border border-slate-200/70 bg-white/90 p-4 sm:p-6 shadow-[0_10px_35px_rgba(0,0,0,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(37,99,235,0.12)]"
                        >
                            <div className="absolute right-0 top-0 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-cyan-100 blur-3xl opacity-40 transition group-hover:opacity-70" />

                            <div className="relative space-y-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                                            <BedDouble size={22} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                                Bed Slot
                                            </div>

                                            <h3 className="truncate text-lg sm:text-xl font-bold text-slate-900">
                                                Bed #{i + 1}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Tag
                                            className={`m-0 rounded-full border px-3 py-1 text-[11px] sm:text-xs font-semibold ${STATUS_STYLES[b.status || BedStatus.Available]}`}
                                        >
                                            {b.status}
                                        </Tag>

                                        {!isEdit &&
                                            beds.length > 1 && (
                                                <Tooltip title="Remove bed">
                                                    <button
                                                        onClick={() =>
                                                            removeRow(i)
                                                        }
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:scale-105 hover:bg-red-100"
                                                    >
                                                        <DeleteOutlined />
                                                    </button>
                                                </Tooltip>
                                            )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                            Bed Name
                                        </label>

                                        <Input
                                            size="large"
                                            placeholder="e.g. ICU-A1"
                                            value={b.name}
                                            onChange={e =>
                                                update(
                                                    i,
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-12 sm:h-14 rounded-2xl border-slate-200 text-sm sm:text-base shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                            Bed Class
                                        </label>

                                        <Select
                                            size="large"
                                            value={b.class}
                                            onChange={v =>
                                                update(i, 'class', v)
                                            }
                                            className="w-full"
                                            options={Object.values(
                                                BedClass,
                                            ).map(c => ({
                                                value: c,
                                                label: c,
                                            }))}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                                            Initial Status
                                        </label>

                                        <Select
                                            size="large"
                                            value={b.status}
                                            onChange={v =>
                                                update(i, 'status', v)
                                            }
                                            className="w-full"
                                            options={Object.values(
                                                BedStatus,
                                            ).map(s => ({
                                                value: s,
                                                label: s,
                                            }))}
                                        />
                                    </div>

                                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                                    <Activity size={16} />
                                                    Operational State
                                                </div>

                                                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                                    Control whether this bed
                                                    can be assigned within the
                                                    ward.
                                                </p>
                                            </div>

                                            <Switch
                                                checked={b.isActive}
                                                onChange={v =>
                                                    update(
                                                        i,
                                                        'isActive',
                                                        v,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sticky bottom-0 z-10 rounded-[24px] sm:rounded-[28px] border border-white/70 bg-white/90 p-3 sm:p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl">
                    <div className="flex flex-col gap-3 lg:flex-row">
                        {!isEdit && (
                            <Button
                                icon={<PlusOutlined />}
                                onClick={addRow}
                                disabled={loading}
                                className="h-12 sm:h-14 w-full rounded-2xl border-0 bg-slate-100 text-sm font-semibold text-slate-700 shadow-sm transition hover:!bg-slate-200 lg:flex-1"
                            >
                                Add Another Bed
                            </Button>
                        )}

                        <Button
                            type="primary"
                            loading={loading}
                            disabled={!canSubmit}
                            onClick={submit}
                            className="h-12 sm:h-14 w-full rounded-2xl border-0 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-sm font-semibold shadow-[0_12px_30px_rgba(37,99,235,0.35)] transition hover:scale-[1.01] lg:flex-1"
                        >
                            {loading
                                ? isEdit
                                    ? 'Updating Bed...'
                                    : 'Deploying Beds...'
                                : isEdit
                                    ? 'Update Bed'
                                    : 'Deploy Beds'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}