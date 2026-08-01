'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    message,
    Pagination,
    Drawer,
    Tag,
    Skeleton,
    Select,
} from 'antd';

import {
    BedClass,
    BedStatus,
    GetBedsQuery,
    GetBedAllocationsByWardQuery,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import {
    EditOutlined,
    PlusOutlined,
    CheckCircleFilled,
    StopFilled,
} from '@ant-design/icons';

import { Bed, UserRound } from 'lucide-react';

import BedForm from './forms/BedForm';
import { STATUS_COLORS, CLASS_STYLES, getClassIcon } from './types';

type BedItem =
    GetBedsQuery['beds']['items'][number];

type AllocationItem =
    GetBedAllocationsByWardQuery['visitBedAllocationsByWard'][number];

export default function WardBedsSection({
    wardId,
}: {
    wardId: string;
}) {
    const [beds, setBeds] = useState<BedItem[]>([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(4);

    const [loading, setLoading] = useState(true);

    const [selectedBed, setSelectedBed] =
        useState<BedItem | null>(null);

    const [createOpen, setCreateOpen] =
        useState(false);

    const [classFilter, setClassFilter] =
        useState<BedClass | undefined>();

    const [statusFilter, setStatusFilter] =
        useState<BedStatus | undefined>();

    const [activeFilter, setActiveFilter] =
        useState<boolean | undefined>();

    const [allocations, setAllocations] =
        useState<AllocationItem[]>([]);

    const fetchAllocations = useCallback(async () => {
        try {
            const res = await clientFetch(
                `/api/bed-allocation/by-ward?wardId=${wardId}`,
            );

            const json = await res.json();

            if (!res.ok) return;

            setAllocations(json.bedAllocations ?? []);
        } catch {}
    }, [wardId]);

    useEffect(() => {
        fetchAllocations();
    }, [fetchAllocations]);

    const allocationByBedId = useMemo(() => {
        const map = new Map<string, AllocationItem>();

        for (const allocation of allocations) {
            map.set(allocation.bedId, allocation);
        }

        return map;
    }, [allocations]);

    const fetchBeds = useCallback(
        async (p = page, l = limit) => {
            try {
                setLoading(true);

                const params =
                    new URLSearchParams({
                        wardId,
                        page: String(p),
                        limit: String(l),
                    });

                if (classFilter) {
                    params.append(
                        'class',
                        classFilter,
                    );
                }

                if (statusFilter) {
                    params.append(
                        'status',
                        statusFilter,
                    );
                }

                if (
                    typeof activeFilter ===
                    'boolean'
                ) {
                    params.append(
                        'isActive',
                        String(activeFilter),
                    );
                }

                const res = await clientFetch(
                    `/api/bed/list?${params.toString()}`,
                );

                const json = await res.json();

                if (!res.ok) {
                    message.error(
                        json?.error ||
                        'Failed to load beds',
                    );

                    return;
                }

                setBeds(json.beds.items || []);
                setPage(json.beds.page);
                setTotal(json.beds.total);
            } catch {
                message.error(
                    'Failed to load beds',
                );
            } finally {
                setLoading(false);
            }
        },
        [wardId, classFilter, statusFilter, activeFilter, page, limit],
    );

    useEffect(() => {
        fetchBeds(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        classFilter,
        statusFilter,
        activeFilter,
    ]);

    async function updateStatus(
        bed: BedItem,
        status: BedStatus,
    ) {
        const res = await clientFetch(
            '/api/bed/update',
            {
                method: 'POST',
                body: JSON.stringify({
                    bedId: bed.id,
                    status,
                }),
            },
        );

        const json = await res
            .json()
            .catch(() => null);

        if (!res.ok) {
            message.error(
                json?.error ||
                'Update failed',
            );

            return;
        }

        setBeds(prev =>
            prev.map(b =>
                b.id === bed.id
                    ? { ...b, status }
                    : b,
            ),
        );

        message.success(
            'Bed status updated',
        );
    }

    function formatAllocatedAt(value: string) {
        return new Date(value).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    const hasFilters =
        !!classFilter ||
        !!statusFilter ||
        typeof activeFilter === 'boolean';

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Ward Bed Layout
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Live occupancy management,
                        monitoring and operational
                        control
                    </p>
                </div>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-semibold !text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] cursor-pointer"
                >
                    <PlusOutlined />
                    <span className="hidden sm:inline">
                        Add Beds
                    </span>

                    <span className="sm:hidden">
                        Add
                    </span>
                </button>
            </div>

            {loading ? (
                <div className="rounded-[30px] border bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {Array.from({
                            length: 6,
                        }).map((_, i) => (
                            <div
                                key={i}
                                className="rounded-3xl border border-slate-200 p-5"
                            >
                                <Skeleton
                                    active
                                    paragraph={{
                                        rows: 4,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : hasFilters ? <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                        <Bed
                            size={28}
                            className="text-slate-500"
                        />
                    </div>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    No matching beds found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                    Try changing or clearing your filters.
                </p>

                <button
                    onClick={() => {
                        setClassFilter(undefined);
                        setStatusFilter(undefined);
                        setActiveFilter(undefined);
                        setPage(1);
                    }}
                    className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium !text-white transition hover:bg-slate-800"
                >
                    Clear Filters
                </button>
            </div> :
                beds.length === 0 ? (
                    <div className="rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-14">
                        <div className="flex justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-cyan-100">
                                <Bed
                                    size={34}
                                    className="text-blue-600"
                                />
                            </div>
                        </div>

                        <h3 className="mt-6 text-2xl font-bold text-slate-900">
                            No beds in this ward yet
                        </h3>

                        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-500">
                            Start building your ward
                            infrastructure by deploying
                            operational beds for
                            occupancy management,
                            assignments and monitoring.
                        </p>

                        <button
                            onClick={() =>
                                setCreateOpen(true)
                            }
                            className="mt-8 rounded-2xl bg-blue-700 px-6 py-3 font-semibold !text-white shadow-lg shadow-blue-200 transition hover:scale-[1.02]"
                        >
                            Create First Beds
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                <Select
                                    allowClear
                                    placeholder="Filter by class"
                                    value={classFilter}
                                    onChange={value => {
                                        setPage(1);
                                        setClassFilter(value);
                                    }}
                                    className="w-full"
                                    options={Object.values(
                                        BedClass,
                                    ).map(c => ({
                                        value: c,
                                        label: c,
                                    }))}
                                />

                                <Select
                                    allowClear
                                    placeholder="Filter by status"
                                    value={statusFilter}
                                    onChange={value => {
                                        setPage(1);
                                        setStatusFilter(value);
                                    }}
                                    className="w-full"
                                    options={Object.values(
                                        BedStatus,
                                    ).map(s => ({
                                        value: s,
                                        label: s,
                                    }))}
                                />

                                <Select
                                    allowClear
                                    placeholder="Filter by activity"
                                    value={activeFilter}
                                    onChange={value => {
                                        setPage(1);
                                        setActiveFilter(value);
                                    }}
                                    className="w-full"
                                    options={[
                                        {
                                            label: 'Active',
                                            value: true,
                                        },
                                        {
                                            label: 'Disabled',
                                            value: false,
                                        },
                                    ]}
                                />

                                <button
                                    onClick={() => {
                                        setClassFilter(undefined);
                                        setStatusFilter(undefined);
                                        setActiveFilter(undefined);
                                        setPage(1);
                                    }}
                                    className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                        <div className="rounded-[28px] border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                                {beds.map(bed => {
                                    const allocation = allocationByBedId.get(bed.id);

                                    return (
                                        <div
                                            key={bed.id}
                                            className={`group relative overflow-hidden rounded-[22px] border p-3.5 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${STATUS_COLORS[bed.status]}`}
                                        >
                                            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/30 blur-2xl" />

                                            <div className="relative">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
                                                            <Bed size={18} />
                                                        </div>

                                                        <div className="min-w-0">
                                                            <h3 className="truncate text-sm sm:text-base font-bold">
                                                                {bed.name}
                                                            </h3>

                                                            <p className="hidden sm:block truncate text-[11px] opacity-60">
                                                                {bed.bedCode || 'No code'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            setSelectedBed(bed);
                                                        }}
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-slate-700 shadow-sm transition hover:scale-105"
                                                    >
                                                        <EditOutlined className="text-[13px]" />
                                                    </button>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                                    <Tag
                                                        className={`m-0 flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${CLASS_STYLES[bed.class]}`}
                                                    >
                                                        <span className="sm:hidden">
                                                            {getClassIcon(bed.class)}
                                                        </span>

                                                        <span className="hidden sm:flex items-center gap-1">
                                                            {getClassIcon(bed.class)}
                                                            {bed.class}
                                                        </span>
                                                    </Tag>

                                                    <Tag
                                                        className={`m-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${bed.isActive
                                                            ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
                                                            : 'border-red-200 bg-red-100 text-red-700'
                                                            }`}
                                                    >
                                                        <span className="sm:hidden">
                                                            {bed.isActive ? '🟢' : '🔴'}
                                                        </span>

                                                        <span className="hidden sm:flex items-center gap-1">
                                                            {bed.isActive ? (
                                                                <>
                                                                    <CheckCircleFilled />
                                                                    Active
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <StopFilled />
                                                                    Disabled
                                                                </>
                                                            )}
                                                        </span>
                                                    </Tag>
                                                </div>

                                                {allocation ? (
                                                    <div className="mt-3 rounded-xl border border-white/50 bg-white/60 px-3 py-2.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <UserRound size={12} className="opacity-60" />
                                                            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-60">
                                                                {allocation.status}
                                                            </p>
                                                        </div>

                                                        <p className="mt-1 text-xs font-medium">
                                                            Allocated by{' '}
                                                            {allocation.allocatedBy?.fullName ?? 'Unknown staff'}
                                                        </p>

                                                        <p className="text-[11px] opacity-70">
                                                            Since {formatAllocatedAt(allocation.allocatedAt)}
                                                        </p>

                                                        {allocation.reason && (
                                                            <p className="mt-1 text-[11px] italic opacity-60">
                                                                {allocation.reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-3">
                                                        <select
                                                            className="h-10 w-full rounded-xl border border-white/40 bg-white/80 px-3 text-xs sm:text-sm font-medium shadow-sm outline-none"
                                                            value={bed.status}
                                                            onChange={e =>
                                                                updateStatus(
                                                                    bed,
                                                                    e.target.value as BedStatus,
                                                                )
                                                            }
                                                        >
                                                            {Object.values(BedStatus).map(s => (
                                                                <option
                                                                    key={s}
                                                                    value={s}
                                                                >
                                                                    {s}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <Pagination
                                current={page}
                                pageSize={limit}
                                total={total}
                                responsive
                                onChange={(p, l) => {
                                    setLimit(l);

                                    fetchBeds(p, l);
                                }}
                            />
                        </div>
                    </>
                )}

            <Drawer
                open={createOpen}
                onClose={() =>
                    setCreateOpen(false)
                }
                placement="right"
                size="large"
                title={null}
                closable={false}
                className="bed-drawer"
                styles={{
                    body: {
                        padding: 0,
                        background:
                            'linear-gradient(to bottom right, #f8fafc, #eef6ff)',
                    },
                }}
            >
                <div className="h-full overflow-y-auto p-3 sm:p-5 lg:p-6">
                    <BedForm
                        wardId={wardId}
                        onSuccess={() => {
                            setCreateOpen(false);

                            fetchBeds();
                        }}
                    />
                </div>
            </Drawer>

            <Drawer
                open={!!selectedBed}
                onClose={() =>
                    setSelectedBed(null)
                }
                placement="right"
                size="large"
                title={null}
                closable={false}
                className="bed-drawer"
                styles={{
                    body: {
                        padding: 0,
                        background:
                            'linear-gradient(to bottom right, #f8fafc, #eef6ff)',
                    },
                }}
            >
                {selectedBed && (
                    <div className="h-full overflow-y-auto p-3 sm:p-5 lg:p-6">
                        <BedForm
                            mode="edit"
                            initial={selectedBed}
                            wardId={wardId}
                            onSuccess={() => {
                                setSelectedBed(null);

                                fetchBeds();
                            }}
                        />
                    </div>
                )}
            </Drawer>
        </section>
    );
}