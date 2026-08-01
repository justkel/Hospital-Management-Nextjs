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
import { StatCard, StatusBadge, PriorityBadge } from './procedure-types';

type ProcedureItem =
    GetVisitProceduresQuery['visitProcedures']['items'][number];

export default function VisitProcedureHistorySection({
    paginated,
    onUpdated,
}: {
    paginated: GetVisitProceduresQuery['visitProcedures'];
    onUpdated?: () => void;
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
    }

    useEffect(() => {
        let ignore = false;

        fetchProceduresData(1, limit).then(visitProcedures => {
            if (ignore || !visitProcedures) return;

            setPage(visitProcedures.page);
            setTotal(visitProcedures.total);
            setList(visitProcedures.items);
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
        <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Pending Procedures"
                    value={stats.pending}
                    subtitle="Awaiting execution"
                    gradient="from-amber-500 to-orange-500"
                />

                <StatCard
                    title="In Progress"
                    value={stats.inProgress}
                    subtitle="Currently active"
                    gradient="from-blue-500 to-cyan-500"
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                    subtitle="Successfully finished"
                    gradient="from-emerald-500 to-green-500"
                />
            </div>

            <div className="rounded-[2rem] border border-white/60 bg-white/90 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-gray-100">
                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight text-gray-900">
                                Procedure Timeline
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Track and manage procedure lifecycle with beautiful clinical insights.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <FilterOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                <select
                                    value={statusFilter}
                                    onChange={e =>
                                        setStatusFilter(
                                            e.target.value as VisitProcedureStatus | ''
                                        )
                                    }
                                    className="appearance-none h-12 rounded-2xl border border-gray-200 bg-white pl-11 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
                                >
                                    <option value="">All Statuses</option>

                                    {Object.values(VisitProcedureStatus).map(status => (
                                        <option key={status} value={status}>
                                            {status.replace(/_/g, ' ')}
                                        </option>
                                    ))}
                                </select>

                                <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            </div>

                            <div className="relative">
                                <select
                                    value={priorityFilter}
                                    onChange={e =>
                                        setPriorityFilter(
                                            e.target.value as VisitProcedurePriority | ''
                                        )
                                    }
                                    className="appearance-none h-12 rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
                                >
                                    <option value="">All Priorities</option>

                                    {Object.values(VisitProcedurePriority).map(priority => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>

                                <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {list.map(item => {
                        const isEditable =
                            item.status !== VisitProcedureStatus.Cancelled;

                        return (
                            <div
                                key={item.id}
                                className="group p-5 sm:p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300"
                            >
                                <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                                {item.procedureCatalog?.name ||
                                                    item.customProcedureName ||
                                                    'Unnamed Procedure'}
                                            </h3>

                                            <StatusBadge status={item.status} />
                                            <PriorityBadge priority={item.priority} />
                                        </div>

                                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <ClockCircleOutlined />
                                                Ordered: {formatDateTime(item.orderedAt)}
                                            </div>

                                            {item.estimatedDuration && (
                                                <div>
                                                    Duration: {formatDuration(item.estimatedDuration)}
                                                </div>
                                            )}

                                            {item.orderedBy?.fullName && (
                                                <div>
                                                    Ordered by: {item.orderedBy.fullName}
                                                </div>
                                            )}
                                        </div>

                                        {item.notes && (
                                            <div className="mt-4 rounded-2xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-600 leading-relaxed">
                                                {item.notes}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex w-full xl:w-auto flex-row xl:flex-col items-stretch xl:items-end gap-3">
                                        <Link
                                            href={`/dashboard/visit-procedures/${item.id}`}
                                            className="
                                                flex-1 xl:flex-none
                                                h-12 px-5 rounded-2xl
                                                border border-gray-200 bg-white
                                                text-gray-700 font-semibold
                                                flex items-center justify-center gap-2
                                                shadow-sm hover:shadow-md
                                                hover:bg-gray-50
                                                transition-all duration-200
                                            "
                                        >
                                            <EyeOutlined />
                                            <span className="hidden sm:inline">
                                                View
                                            </span>
                                        </Link>

                                        <button
                                            disabled={!isEditable}
                                            onClick={() => {
                                                setEditingProcedure(item);
                                                setShowDrawer(true);
                                            }}
                                            className={`
                                                flex-1 xl:flex-none
                                                h-12 px-5 rounded-2xl font-semibold transition-all duration-200
                                                flex items-center justify-center gap-2 shadow-sm

                                                ${isEditable
                                                    ? 'bg-blue-600 hover:bg-blue-700 !text-white hover:shadow-lg hover:scale-[1.02]'
                                                    : 'bg-gray-100 !text-gray-400 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            <EditOutlined />

                                            <span className="hidden sm:inline">
                                                Update
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {list.length === 0 && (
                        <div className="py-20 text-center">
                            <div className="mx-auto h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                                🩺
                            </div>

                            <h3 className="mt-5 text-xl font-bold text-gray-900">
                                No Procedures Found
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Try adjusting your filters.
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