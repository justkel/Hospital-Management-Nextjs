'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pagination, message } from 'antd';

import { clientFetch } from '@/lib/clientFetch';

import {
    TheatreIncidentSeverity,
    TheatreIncidentStatus,
    TheatreIncidentType,
    GetTheatreIncidentsByTheatreQuery,
} from '@/shared/graphql/generated/graphql';

import { formatDateTime } from '@/utils/formatDateTime';

import { EyeOutlined, FilterOutlined } from '@ant-design/icons';

import Link from 'next/link';

type TheatreIncidentItem =
    GetTheatreIncidentsByTheatreQuery['theatreIncidentsByTheatre']['items'][number];

const SEVERITY_META: Record<string, { dot: string; badge: string }> = {
    LOW: { dot: '!bg-[#1D9E75]', badge: '!bg-[#ECFBF5] !text-[#1D9E75]' },
    MEDIUM: { dot: '!bg-[#D08A2E]', badge: '!bg-[#FFF8EC] !text-[#B9770E]' },
    HIGH: { dot: '!bg-[#EA6C2E]', badge: '!bg-[#FFF1E9] !text-[#C2571C]' },
    CRITICAL: { dot: '!bg-[#DC2626]', badge: '!bg-[#FEF2F2] !text-[#DC2626]' },
};

const STATUS_META: Record<string, { dot: string; badge: string }> = {
    OPEN: { dot: '!bg-[#1D6FE0]', badge: '!bg-[#EFF5FF] !text-[#1D6FE0]' },
    PENDING: { dot: '!bg-[#D08A2E]', badge: '!bg-[#FFF8EC] !text-[#B9770E]' },
    IN_PROGRESS: { dot: '!bg-[#D08A2E]', badge: '!bg-[#FFF8EC] !text-[#B9770E]' },
    ESCALATED: { dot: '!bg-[#DC2626]', badge: '!bg-[#FEF2F2] !text-[#DC2626]' },
    RESOLVED: { dot: '!bg-[#1D9E75]', badge: '!bg-[#ECFBF5] !text-[#1D9E75]' },
    CLOSED: { dot: '!bg-[#B4B2A9]', badge: '!bg-[#F7F7F5] !text-[#767570]' },
    CANCELLED: { dot: '!bg-[#B4B2A9]', badge: '!bg-[#F7F7F5] !text-[#767570]' },
};

const FALLBACK_META = { dot: '!bg-[#B4B2A9]', badge: '!bg-[#F7F7F5] !text-[#767570]' };

function Badge({ value, meta }: { value: string; meta: Record<string, { dot: string; badge: string }> }) {
    const m = meta[value] ?? FALLBACK_META;
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${m.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
            {value.replace(/_/g, ' ')}
        </span>
    );
}

export default function TheatreIncidentsSection({
    theatreId,
    paginated,
}: {
    theatreId: string;
    paginated?: GetTheatreIncidentsByTheatreQuery['theatreIncidentsByTheatre'];
}) {
    const [list, setList] = useState<TheatreIncidentItem[]>(
        paginated?.items ?? [],
    );

    const [page, setPage] = useState(paginated?.page ?? 1);

    const [total, setTotal] = useState(paginated?.total ?? 0);

    const [limit, setLimit] = useState(20);

    const [severity, setSeverity] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    const fetchPage = useCallback(
        async (nextPage: number, nextLimit = limit) => {
            const params = new URLSearchParams({
                theatreId,
                page: String(nextPage),
                limit: String(nextLimit),
            });

            if (severity)
                params.append('severity', severity);

            if (status)
                params.append('status', status);

            if (type)
                params.append('type', type);

            const res = await clientFetch(
                `/api/theatre-incident/list-by-theatre?${params.toString()}`,
            );

            const json = await res.json();

            if (!res.ok) {
                message.error(
                    json.error ||
                    'Failed to fetch theatre incidents',
                );

                return;
            }

            setList(json.theatreIncidents.items);

            setPage(json.theatreIncidents.page);

            setTotal(json.theatreIncidents.total);
        },
        [theatreId, severity, status, type, limit],
    );

    useEffect(() => {
        if (!paginated) return;
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [severity, status, type]);

    const hasActiveFilters = !!severity || !!status || !!type;

    const clearFilters = () => {
        setSeverity('');
        setStatus('');
        setType('');
    };

    if (!paginated) {
        return (
            <div className="rounded-2xl border !border-[#E8E6E0] !bg-white py-16 text-center">
                <p className="text-sm !text-[#767570]">No incident data available</p>
            </div>
        );
    }

    return (
        <section className="space-y-5 sm:space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                        Theatre incidents
                    </h2>

                    <p className="mt-0.5 text-sm !text-[#767570]">
                        Track and manage all incidents reported in this theatre.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    <FilterOutlined />
                    Filters
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:flex-1">
                    <select
                        value={severity}
                        onChange={e => setSeverity(e.target.value)}
                        className="h-10 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                    >
                        <option value="">All severity</option>
                        {Object.values(TheatreIncidentSeverity).map(item => (
                            <option key={item} value={item}>
                                {item.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        className="h-10 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                    >
                        <option value="">All status</option>
                        {Object.values(TheatreIncidentStatus).map(item => (
                            <option key={item} value={item}>
                                {item.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>

                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="h-10 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                    >
                        <option value="">All types</option>
                        {Object.values(TheatreIncidentType).map(item => (
                            <option key={item} value={item}>
                                {item.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                </div>

                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex shrink-0 items-center gap-1 self-start rounded-lg border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 text-xs font-medium !text-[#767570] transition hover:!bg-[#F7F7F5] lg:self-auto"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div
                    className="overflow-x-auto hide-scrollbar"
                    style={{
                        scrollbarWidth: 'none',
                    }}
                >
                    <table className="w-full min-w-[920px]">
                        <thead>
                            <tr className="border-b !border-[#E8E6E0] text-left text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                                <th className="px-5 py-3">Type</th>
                                <th className="py-3">Severity</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Reported by</th>
                                <th className="py-3">Reported at</th>
                                <th className="py-3">Resolved at</th>
                                <th className="py-3">Notes</th>
                                <th className="px-5 py-3 text-right">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y !divide-[#E8E6E0]">
                            {list.map(item => (
                                <tr key={item.id} className="transition hover:!bg-[#FAFAF8]">
                                    <td className="px-5 py-4 text-sm font-medium !text-[#16211B]">
                                        {item.type.replace(/_/g, ' ')}
                                    </td>

                                    <td className="py-4">
                                        <Badge value={item.severity} meta={SEVERITY_META} />
                                    </td>

                                    <td className="py-4">
                                        <Badge value={item.status} meta={STATUS_META} />
                                    </td>

                                    <td className="py-4 text-sm !text-[#5F5E5A]">
                                        {item.reportedBy?.fullName || '—'}
                                    </td>

                                    <td className="py-4 text-sm !text-[#767570]">
                                        {item.reportedAt ? formatDateTime(item.reportedAt) : '—'}
                                    </td>

                                    <td className="py-4 text-sm !text-[#767570]">
                                        {item.resolvedAt ? formatDateTime(item.resolvedAt) : '—'}
                                    </td>

                                    <td className="max-w-[260px] truncate py-4 text-sm !text-[#767570]">
                                        {item.notes || '—'}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/dashboard/theatre-incidents/${item.id}`}
                                                aria-label="View incident"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
                                            >
                                                <EyeOutlined />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {list.length === 0 && (
                    <div className="px-4 py-16 text-center">
                        <p className="text-sm font-semibold !text-[#16211B]">
                            {hasActiveFilters ? 'No incidents match these filters' : 'No incidents found'}
                        </p>
                        <p className="mt-1 text-sm !text-[#767570]">
                            {hasActiveFilters ? 'Try adjusting or clearing the filters above.' : 'Check back later.'}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center overflow-x-auto pt-1">
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