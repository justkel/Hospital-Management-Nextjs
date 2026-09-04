'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'antd';

import Link from 'next/link';

import {
    EditOutlined,
    FilterOutlined,
    DownOutlined,
    ClockCircleOutlined,
    EyeOutlined,
} from '@ant-design/icons';

import {
    ChargeDomain,
    GetVisitProceduresQuery,
    VisitProcedurePriority,
    VisitProcedureStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';
import { formatDateTime } from '@/utils/formatDateTime';

import UpdateVisitProcedureDrawer from './UpdateVisitProcedureDrawer';
import { useBilling } from '@/hooks/billing/useBilling';
import { formatDuration } from '../types/procedure-functions';
import { StatusBadge, PriorityBadge } from './procedure-types';

type ProcedureItem =
    GetVisitProceduresQuery['visitProcedures']['items'][number];

const STAT_TONES = {
    pending: { dot: '#D08A2E', label: 'Pending' },
    inProgress: { dot: '#1D6FE0', label: 'In progress' },
    completed: { dot: '#1D9E75', label: 'Completed' },
} as const;

export default function VisitProcedureHistorySection({
    paginated,
    onUpdated,
    onPaginationChange,
}: {
    paginated: GetVisitProceduresQuery['visitProcedures'];
    onUpdated?: () => void;
    onPaginationChange?: (page: number, total: number) => void;
}) {
    const [list, setList] = useState<ProcedureItem[]>(paginated.items);
    const [page, setPage] = useState<number>(paginated.page);
    const [total, setTotal] = useState<number>(paginated.total);
    const [limit, setLimit] = useState<number>(20);
    const { catalogs } = useBilling(ChargeDomain.Procedure);

    const [statusFilter, setStatusFilter] = useState<
        VisitProcedureStatus | ''
    >('');

    const [priorityFilter, setPriorityFilter] = useState<
        VisitProcedurePriority | ''
    >('');

    const [editingProcedure, setEditingProcedure] =
        useState<ProcedureItem | null>(null);

    const [showDrawer, setShowDrawer] = useState(false);

    async function fetchProceduresData(nextPage: number, nextLimit = limit) {
        const params = new URLSearchParams({
            page: String(nextPage),
            limit: String(nextLimit),
        });

        if (statusFilter) {
            params.append('status', statusFilter);
        }

        if (priorityFilter) {
            params.append('priority', priorityFilter);
        }

        const res = await clientFetch(
            `/api/visit-procedure/list?${params.toString()}`
        );

        const json = await res.json();

        if (!res.ok) return null;

        return json.visitProcedures as GetVisitProceduresQuery['visitProcedures'];
    }

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const visitProcedures = await fetchProceduresData(nextPage, nextLimit);
        if (!visitProcedures) return;

        setPage(visitProcedures.page);
        setTotal(visitProcedures.total);
        setList(visitProcedures.items);
        onPaginationChange?.(visitProcedures.page, visitProcedures.total);
    }

    useEffect(() => {
        let ignore = false;

        fetchProceduresData(1, limit).then(visitProcedures => {
            if (ignore || !visitProcedures) return;

            setPage(visitProcedures.page);
            setTotal(visitProcedures.total);
            setList(visitProcedures.items);
            onPaginationChange?.(visitProcedures.page, visitProcedures.total);
        });

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, priorityFilter]);

    const stats = useMemo(() => {
        return {
            pending: list.filter(
                i => i.status === VisitProcedureStatus.Pending
            ).length,

            inProgress: list.filter(
                i => i.status === VisitProcedureStatus.InProgress
            ).length,

            completed: list.filter(
                i => i.status === VisitProcedureStatus.Completed
            ).length,
        };
    }, [list]);

    return (
        <section className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-3 divide-x !divide-[#E8E6E0] overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                {(
                    [
                        ['pending', stats.pending],
                        ['inProgress', stats.inProgress],
                        ['completed', stats.completed],
                    ] as const
                ).map(([key, value]) => {
                    const tone = STAT_TONES[key];
                    return (
                        <div key={key} className="p-3.5 sm:p-5">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span
                                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: tone.dot }}
                                />
                                <p className="truncate text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9] sm:text-[10px] sm:tracking-[0.12em]">
                                    {tone.label}
                                </p>
                            </div>
                            <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B] sm:mt-2 sm:text-2xl">
                                {String(value).padStart(2, '0')}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="border-b !border-[#E8E6E0] p-4 sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-lg font-bold tracking-tight !text-[#16211B] sm:text-xl">
                                Procedure timeline
                            </h2>
                            <p className="mt-0.5 text-sm !text-[#767570]">
                                Ordered by most recent activity.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5 sm:flex-row">
                            <div className="relative">
                                <FilterOutlined className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs !text-[#B4B2A9]" />

                                <select
                                    value={statusFilter}
                                    onChange={e =>
                                        setStatusFilter(
                                            e.target.value as VisitProcedureStatus | ''
                                        )
                                    }
                                    className="h-11 w-full appearance-none rounded-xl border !border-[#E8E6E0] !bg-white pl-9 pr-9 text-sm !text-[#2C2C2A] outline-none transition focus:!border-[#1D9E75] sm:w-[190px]"
                                >
                                    <option value="">All statuses</option>

                                    {Object.values(VisitProcedureStatus).map(status => (
                                        <option key={status} value={status}>
                                            {status.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>

                                <DownOutlined className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] !text-[#B4B2A9]" />
                            </div>

                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={e =>
                                        setPriorityFilter(
                                            e.target.value as VisitProcedurePriority | ''
                                        )
                                    }
                                    className="h-11 w-full appearance-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 pr-9 text-sm !text-[#2C2C2A] outline-none transition focus:!border-[#1D9E75] sm:w-[190px]"
                                >
                                    <option value="">All priorities</option>

                                    {Object.values(VisitProcedurePriority).map(priority => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>

                                <DownOutlined className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] !text-[#B4B2A9]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divide-y !divide-[#E8E6E0]">
                    {list.map(item => {
                        const isEditable =
                            item.status !== VisitProcedureStatus.Cancelled;

                        return (
                            <div
                                key={item.id}
                                className="p-4 transition-colors hover:!bg-[#FAFAF8] sm:p-6"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                                            <h3 className="truncate text-[15px] font-semibold !text-[#16211B] sm:text-base">
                                                {item.procedureCatalog?.name ||
                                                    item.customProcedureName ||
                                                    'Unnamed procedure'}
                                            </h3>

                                            <StatusBadge status={item.status} />
                                            <PriorityBadge priority={item.priority} />
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs !text-[#767570] sm:text-[13px]">
                                            <span className="inline-flex items-center gap-1.5">
                                                <ClockCircleOutlined className="!text-[#B4B2A9]" />
                                                {formatDateTime(item.orderedAt)}
                                            </span>

                                            {item.estimatedDuration && (
                                                <span>
                                                    {formatDuration(item.estimatedDuration)}
                                                </span>
                                            )}

                                            {item.orderedBy?.fullName && (
                                                <span>
                                                    Ordered by {item.orderedBy.fullName}
                                                </span>
                                            )}
                                        </div>

                                        {item.notes && (
                                            <div className="mt-3 rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-3 text-xs leading-relaxed !text-[#5F5E5A] sm:text-sm">
                                                {item.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex w-full shrink-0 items-center gap-2.5 sm:w-auto md:flex-row md:items-start">
                                        <Link
                                            href={`/dashboard/visit-procedures/${item.id}`}
                                            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border !border-[#E8E6E0] !bg-white px-4 text-sm font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] sm:flex-none"
                                        >
                                            <EyeOutlined />
                                            <span>View</span>
                                        </Link>

                                        <button
                                            disabled={!isEditable}
                                            onClick={() => {
                                                setEditingProcedure(item);
                                                setShowDrawer(true);
                                            }}
                                            className={`flex h-10 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition sm:flex-none ${isEditable
                                                ? '!bg-[#0c1a12] !text-white hover:!bg-[#16211B]'
                                                : 'cursor-not-allowed !bg-[#F7F7F5] !text-[#B4B2A9]'
                                                }`}
                                        >
                                            <EditOutlined />
                                            <span>Update</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {list.length === 0 && (
                        <div className="px-4 py-16 text-center sm:py-20">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full !bg-[#F7F7F5]">
                                <FilterOutlined className="text-lg !text-[#B4B2A9]" />
                            </div>

                            <h3 className="mt-4 text-base font-semibold !text-[#16211B]">
                                No procedures found
                            </h3>

                            <p className="mt-1.5 text-sm !text-[#767570]">
                                Adjust the filters above and try again.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <UpdateVisitProcedureDrawer
                open={showDrawer}
                onClose={() => {
                    setShowDrawer(false);
                    setEditingProcedure(null);
                }}
                procedure={editingProcedure}
                onUpdated={() => {
                    fetchPage(page);
                    setShowDrawer(false);
                    setEditingProcedure(null);
                    onUpdated?.();
                }}
                catalogs={catalogs ?? []}
            />

            <div className="flex justify-center overflow-x-auto py-2">
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={total}
                    showSizeChanger
                    responsive
                    onChange={(p, l) => {
                        setLimit(l);
                        fetchPage(p, l);
                    }}
                />
            </div>
        </section>
    );
}