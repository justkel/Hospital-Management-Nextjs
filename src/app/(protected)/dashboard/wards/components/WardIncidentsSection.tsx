'use client';

import { useEffect, useState } from 'react';
import { Pagination, message } from 'antd';

import { clientFetch } from '@/lib/clientFetch';

import {
    WardIncidentSeverity,
    WardIncidentStatus,
    WardIncidentType,
    GetWardIncidentsByWardQuery,
} from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
import { EyeOutlined } from '@ant-design/icons';

import Link from 'next/link';

type WardIncidentItem =
    GetWardIncidentsByWardQuery['wardIncidentsByWard']['items'][number];

export default function WardIncidentsSection({
    wardId,
    paginated,
}: {
    wardId: string;
    paginated?: GetWardIncidentsByWardQuery['wardIncidentsByWard'];
}) {
    if (!paginated) {
        return (
            <div className="text-center py-10 text-gray-500">
                No incident data available
            </div>
        );
    }
    const [list, setList] = useState<WardIncidentItem[]>(
        paginated.items,
    );

    const [page, setPage] = useState(paginated.page);

    const [total, setTotal] = useState(paginated.total);

    const [limit, setLimit] = useState(20);

    const [severity, setSeverity] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const params = new URLSearchParams({
            wardId,
            page: String(nextPage),
            limit: String(nextLimit),
        });

        if (severity) params.append('severity', severity);
        if (status) params.append('status', status);
        if (type) params.append('type', type);

        const res = await clientFetch(
            `/api/ward-incident/list-by-ward?${params.toString()}`,
        );

        const json = await res.json();

        if (!res.ok) {
            message.error(json.error || 'Failed to fetch ward incidents');
            return;
        }

        setList(json.wardIncidents.items);
        setPage(json.wardIncidents.page);
        setTotal(json.wardIncidents.total);
    }

    useEffect(() => {
        fetchPage(1);
    }, [severity, status, type]);

    return (
        <section className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Ward Incidents
                    </h2>
                    <p className="text-gray-500 mt-1">
                        Track and manage all incidents reported in this ward.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value)}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">All Severity</option>
                    {Object.values(WardIncidentSeverity).map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">All Status</option>
                    {Object.values(WardIncidentStatus).map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>

                <select
                    value={type}
                    onChange={e => setType(e.target.value)}
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">All Types</option>
                    {Object.values(WardIncidentType).map(item => (
                        <option key={item} value={item}>
                            {item.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>
            </div>
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Severity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Reported By</th>
                                <th className="px-6 py-4">Reported At</th>
                                <th className="px-6 py-4">Resolved At</th>
                                <th className="px-6 py-4">Notes</th>

                                <th className="px-6 py-4 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {list.map(item => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-blue-50/40 transition"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.type}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold">
                                            {item.severity}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'RESOLVED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.reportedBy?.fullName || '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.reportedAt
                                            ? formatDateTime(item.reportedAt)
                                            : '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.resolvedAt
                                            ? formatDateTime(item.resolvedAt)
                                            : '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-600 max-w-[300px] truncate">
                                        {item.notes || '—'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/dashboard/ward-incidents/${item.id}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
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
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-lg font-medium">
                            No incidents found
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            Try adjusting filters or check back later.
                        </p>
                    </div>
                )}
            </div>
            <div className="flex justify-center">
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