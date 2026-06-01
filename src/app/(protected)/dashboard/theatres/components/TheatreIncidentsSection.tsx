'use client';

import { useEffect, useState } from 'react';
import { Pagination, message } from 'antd';

import { clientFetch } from '@/lib/clientFetch';

import {
    TheatreIncidentSeverity,
    TheatreIncidentStatus,
    TheatreIncidentType,
    GetTheatreIncidentsByTheatreQuery,
} from '@/shared/graphql/generated/graphql';

import { formatDateTime } from '@/utils/formatDateTime';

import { EyeOutlined } from '@ant-design/icons';

import Link from 'next/link';

type TheatreIncidentItem =
    GetTheatreIncidentsByTheatreQuery['theatreIncidentsByTheatre']['items'][number];

export default function TheatreIncidentsSection({
    theatreId,
    paginated,
}: {
    theatreId: string;
    paginated?: GetTheatreIncidentsByTheatreQuery['theatreIncidentsByTheatre'];
}) {
    if (!paginated) {
        return (
            <div className="py-10 text-center text-gray-500">
                No incident data available
            </div>
        );
    }

    const [list, setList] = useState<TheatreIncidentItem[]>(
        paginated.items,
    );

    const [page, setPage] = useState(paginated.page);

    const [total, setTotal] = useState(paginated.total);

    const [limit, setLimit] = useState(20);

    const [severity, setSeverity] = useState('');
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');

    async function fetchPage(
        nextPage: number,
        nextLimit = limit,
    ) {
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
    }

    useEffect(() => {
        fetchPage(1);
    }, [severity, status, type]);

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                        Theatre Incidents
                    </h2>

                    <p className="mt-1 text-gray-500">
                        Track and manage all incidents reported in this theatre.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                    value={severity}
                    onChange={e =>
                        setSeverity(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                    <option value="">
                        All Severity
                    </option>

                    {Object.values(
                        TheatreIncidentSeverity,
                    ).map(item => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>

                <select
                    value={status}
                    onChange={e =>
                        setStatus(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                    <option value="">
                        All Status
                    </option>

                    {Object.values(
                        TheatreIncidentStatus,
                    ).map(item => (
                        <option
                            key={item}
                            value={item}
                        >
                            {item.replace(/_/g, ' ')}
                        </option>
                    ))}
                </select>

                <select
                    value={type}
                    onChange={e =>
                        setType(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                    <option value="">
                        All Types
                    </option>

                    {Object.values(
                        TheatreIncidentType,
                    ).map(item => (
                        <option
                            key={item}
                            value={item}
                        >
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
                                <th className="px-6 py-4">
                                    Type
                                </th>

                                <th className="px-6 py-4">
                                    Severity
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

                                <th className="px-6 py-4">
                                    Reported By
                                </th>

                                <th className="px-6 py-4">
                                    Reported At
                                </th>

                                <th className="px-6 py-4">
                                    Resolved At
                                </th>

                                <th className="px-6 py-4">
                                    Notes
                                </th>

                                <th className="px-6 py-4 text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {list.map(item => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-cyan-50/40"
                                >
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {item.type}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                            {item.severity}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                item.status ===
                                                'RESOLVED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.reportedBy
                                            ?.fullName || '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.reportedAt
                                            ? formatDateTime(
                                                  item.reportedAt,
                                              )
                                            : '—'}
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.resolvedAt
                                            ? formatDateTime(
                                                  item.resolvedAt,
                                              )
                                            : '—'}
                                    </td>

                                    <td className="max-w-[300px] truncate px-6 py-4 text-gray-600">
                                        {item.notes || '—'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                            <Link
                                                href={`/dashboard/theatre-incidents/${item.id}`}
                                                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-600"
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
                        <p className="text-lg font-medium text-gray-500">
                            No incidents found
                        </p>

                        <p className="mt-2 text-sm text-gray-400">
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