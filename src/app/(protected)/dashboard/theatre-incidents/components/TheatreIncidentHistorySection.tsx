'use client';

import { useEffect, useState } from 'react';

import { Pagination } from 'antd';

import Link from 'next/link';

import { clientFetch } from '@/lib/clientFetch';

import {
    GetTheatreIncidentsQuery,
    TheatreIncidentSeverity,
    TheatreIncidentStatus,
    TheatreIncidentType,
} from '@/shared/graphql/generated/graphql';

import {
    EyeOutlined,
    EditOutlined,
    FilterOutlined,
} from '@ant-design/icons';

import UpdateTheatreIncidentDrawer from './UpdateTheatreIncidentDrawer';

import { HasRoles } from '@/components/auth/HasRoles';

import { Roles } from '@/shared/utils/enums/roles';

import { formatDateTime } from '@/utils/formatDateTime';

type Incident =
    GetTheatreIncidentsQuery['theatreIncidents']['items'][number];

export default function TheatreIncidentHistorySection({
    paginated,
    theatres,
}: {
    paginated: GetTheatreIncidentsQuery['theatreIncidents'];
    theatres: { id: string; name: string }[];
}) {
    const [list, setList] = useState<Incident[]>(
        paginated.items,
    );

    const [page, setPage] = useState(
        paginated.page,
    );

    const [total, setTotal] = useState(
        paginated.total,
    );

    const [limit, setLimit] = useState(20);

    const [severityFilter, setSeverityFilter] =
        useState<
            TheatreIncidentSeverity | ''
        >('');

    const [statusFilter, setStatusFilter] =
        useState<
            TheatreIncidentStatus | ''
        >('');

    const [typeFilter, setTypeFilter] =
        useState<
            TheatreIncidentType | ''
        >('');

    const [theatreIdFilter, setTheatreIdFilter] =
        useState<string>('');

    const [editing, setEditing] =
        useState<Incident | null>(null);

    const [openDrawer, setOpenDrawer] =
        useState(false);

    async function fetchIncidentsData(
        nextPage: number,
        nextLimit = limit,
    ) {
        const params = new URLSearchParams({
            page: String(nextPage),
            limit: String(nextLimit),
        });

        if (severityFilter)
            params.append(
                'severity',
                severityFilter,
            );

        if (statusFilter)
            params.append(
                'status',
                statusFilter,
            );

        if (typeFilter)
            params.append(
                'type',
                typeFilter,
            );

        if (theatreIdFilter)
            params.append(
                'theatreId',
                theatreIdFilter,
            );

        const res = await clientFetch(
            `/api/theatre-incident/list?${params.toString()}`,
        );

        const json = await res.json();

        if (!res.ok) return null;

        return json.theatreIncidents as GetTheatreIncidentsQuery['theatreIncidents'];
    }

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const theatreIncidents = await fetchIncidentsData(nextPage, nextLimit);
        if (!theatreIncidents) return;

        setList(theatreIncidents.items);
        setPage(theatreIncidents.page);
        setTotal(theatreIncidents.total);
    }

    useEffect(() => {
        let ignore = false;

        fetchIncidentsData(1, limit).then(theatreIncidents => {
            if (ignore || !theatreIncidents) return;

            setList(theatreIncidents.items);
            setPage(theatreIncidents.page);
            setTotal(theatreIncidents.total);
        });

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        severityFilter,
        statusFilter,
        typeFilter,
        theatreIdFilter,
    ]);

    return (
        <section className="space-y-6">
            <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    Theatre Incidents
                </h2>

                <p className="text-sm text-slate-500">
                    Surgical incidents, safety
                    escalations, and operational
                    reports.
                </p>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 font-medium text-slate-700">
                    <FilterOutlined />
                    Filters
                </div>

                <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto lg:grid-cols-4">
                    <FilterSelect
                        value={severityFilter}
                        onChange={
                            setSeverityFilter
                        }
                        options={Object.values(
                            TheatreIncidentSeverity,
                        )}
                        placeholder="Severity"
                    />

                    <FilterSelect
                        value={statusFilter}
                        onChange={
                            setStatusFilter
                        }
                        options={Object.values(
                            TheatreIncidentStatus,
                        )}
                        placeholder="Status"
                    />

                    <FilterSelect
                        value={typeFilter}
                        onChange={
                            setTypeFilter
                        }
                        options={Object.values(
                            TheatreIncidentType,
                        )}
                        placeholder="Type"
                    />

                    <FilterSelect
                        value={theatreIdFilter}
                        onChange={
                            setTheatreIdFilter
                        }
                        options={theatres.map(
                            theatre => ({
                                value: theatre.id,
                                label:
                                    theatre.name,
                            }),
                        )}
                        placeholder="Theatre"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] w-full">
                        <thead className="sticky top-0 z-10 bg-slate-50">
                            <tr className="text-left text-xs text-slate-500">
                                <th className="px-4 py-4">
                                    Type
                                </th>

                                <th>
                                    Severity
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Theatre
                                </th>

                                <th>
                                    Reported
                                </th>

                                <th className="px-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {list.map(item => (
                                <tr
                                    key={item.id}
                                    className="transition hover:bg-slate-50"
                                >
                                    <td className="px-4 py-4 font-medium text-slate-900">
                                        {item.type}
                                    </td>

                                    <td>
                                        <SeverityBadge
                                            value={
                                                item.severity
                                            }
                                        />
                                    </td>

                                    <td>
                                        <StatusBadge
                                            value={
                                                item.status
                                            }
                                        />
                                    </td>

                                    <td className="text-sm text-slate-600">
                                        {
                                            item.theatre
                                                ?.name
                                        }
                                    </td>

                                    <td className="text-sm text-slate-500">
                                        {formatDateTime(
                                            item.reportedAt,
                                        )}
                                    </td>

                                    <td className="px-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/theatre-incidents/${item.id}`}
                                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                                            >
                                                <EyeOutlined />
                                            </Link>

                                            <HasRoles
                                                roles={[
                                                    Roles.ADMIN,
                                                    Roles.NURSE,
                                                ]}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setEditing(
                                                            item,
                                                        );

                                                        setOpenDrawer(
                                                            true,
                                                        );
                                                    }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                >
                                                    <EditOutlined />
                                                </button>
                                            </HasRoles>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {list.length === 0 && (
                    <div className="py-16 text-center text-slate-500">
                        No incidents found.
                    </div>
                )}
            </div>

            <UpdateTheatreIncidentDrawer
                open={openDrawer}
                incident={editing}
                onClose={() => {
                    setOpenDrawer(false);

                    setEditing(null);
                }}
                onUpdated={() =>
                    fetchPage(page)
                }
            />

            <div className="flex justify-center pt-4">
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={total}
                    onChange={(p, l) => {
                        setLimit(l);

                        fetchPage(p, l);
                    }}
                />
            </div>
        </section>
    );
}

function SeverityBadge({
    value,
}: {
    value: string;
}) {
    const map: Record<string, string> = {
        LOW: 'bg-green-100 text-green-700',
        MEDIUM:
            'bg-yellow-100 text-yellow-700',
        HIGH: 'bg-orange-100 text-orange-700',
        CRITICAL:
            'bg-red-100 text-red-700',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs ${map[value]}`}
        >
            {value}
        </span>
    );
}

function StatusBadge({
    value,
}: {
    value: string;
}) {
    const map: Record<string, string> = {
        ESCALATED:
            'bg-red-100 text-red-700',

        RESOLVED:
            'bg-green-100 text-green-700',

        ACTIVE:
            'bg-blue-100 text-black',
    };

    return (
        <span
            className={`rounded-full px-3 py-1 text-xs ${map[value]}`}
        >
            {value}
        </span>
    );
}

type Option =
    | string
    | {
          value: string;
          label: string;
      };

function FilterSelect<T extends string>({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: T | '';

    onChange: (v: T | '') => void;

    options: Option[];

    placeholder: string;
}) {
    return (
        <div className="relative w-full">
            <select
                value={value}
                onChange={e =>
                    onChange(
                        e.target.value as T,
                    )
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                <option value="">
                    {placeholder}
                </option>

                {options.map(opt => {
                    if (
                        typeof opt ===
                        'string'
                    ) {
                        return (
                            <option
                                key={opt}
                                value={opt}
                            >
                                {opt.replace(
                                    /_/g,
                                    ' ',
                                )}
                            </option>
                        );
                    }

                    return (
                        <option
                            key={opt.value}
                            value={opt.value}
                        >
                            {opt.label}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}