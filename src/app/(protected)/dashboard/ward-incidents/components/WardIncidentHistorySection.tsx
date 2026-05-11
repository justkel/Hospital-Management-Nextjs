'use client';

import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import Link from 'next/link';
import { clientFetch } from '@/lib/clientFetch';

import {
    GetWardIncidentsQuery,
    WardIncidentSeverity,
    WardIncidentStatus,
    WardIncidentType,
} from '@/shared/graphql/generated/graphql';

import {
    EyeOutlined,
    EditOutlined,
    FilterOutlined,
} from '@ant-design/icons';

import UpdateWardIncidentDrawer from './UpdateWardIncidentDrawer';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';
import { formatDateTime } from '@/utils/formatDateTime';

type Incident =
    GetWardIncidentsQuery['wardIncidents']['items'][number];

export default function WardIncidentHistorySection({
    paginated,
    wards,
}: {
    paginated: GetWardIncidentsQuery['wardIncidents'];
    wards: { id: string; name: string }[];
}) {
    const [list, setList] = useState<Incident[]>(paginated.items);
    const [page, setPage] = useState(paginated.page);
    const [total, setTotal] = useState(paginated.total);
    const [limit, setLimit] = useState(20);

    const [severityFilter, setSeverityFilter] =
        useState<WardIncidentSeverity | ''>('');
    const [statusFilter, setStatusFilter] =
        useState<WardIncidentStatus | ''>('');
    const [typeFilter, setTypeFilter] =
        useState<WardIncidentType | ''>('');
    const [wardIdFilter, setWardIdFilter] = useState<string>('');

    const [editing, setEditing] = useState<Incident | null>(null);
    const [openDrawer, setOpenDrawer] = useState(false);

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const params = new URLSearchParams({
            page: String(nextPage),
            limit: String(nextLimit),
        });

        if (severityFilter) params.append('severity', severityFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (typeFilter) params.append('type', typeFilter);
        if (wardIdFilter) params.append('wardId', wardIdFilter);

        const res = await clientFetch(
            `/api/ward-incident/list?${params.toString()}`
        );

        const json = await res.json();
        if (!res.ok) return;

        setList(json.wardIncidents.items);
        setPage(json.wardIncidents.page);
        setTotal(json.wardIncidents.total);
    }

    useEffect(() => {
        fetchPage(1, limit);
    }, [severityFilter, statusFilter, typeFilter, wardIdFilter]);

    return (
        <section className="space-y-6">
            <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Ward Incidents
                </h2>
                <p className="text-slate-500 text-sm">
                    Clinical incidents, reports, and safety events.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <FilterOutlined />
                    Filters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto">
                    <FilterSelect
                        value={severityFilter}
                        onChange={setSeverityFilter}
                        options={Object.values(WardIncidentSeverity)}
                        placeholder="Severity"
                    />

                    <FilterSelect
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={Object.values(WardIncidentStatus)}
                        placeholder="Status"
                    />

                    <FilterSelect
                        value={typeFilter}
                        onChange={setTypeFilter}
                        options={Object.values(WardIncidentType)}
                        placeholder="Type"
                    />

                    <FilterSelect
                        value={wardIdFilter}
                        onChange={setWardIdFilter}
                        options={wards.map(w => ({
                            value: w.id,
                            label: w.name,
                        }))}
                        placeholder="Ward"
                    />
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] w-full">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr className="text-left text-xs text-slate-500">
                                <th className="px-4 py-4">Type</th>
                                <th>Severity</th>
                                <th>Status</th>
                                <th>Ward</th>
                                <th>Reported</th>
                                <th className="text-right px-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {list.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition">
                                    <td className="px-4 py-4 font-medium text-slate-900">
                                        {item.type}
                                    </td>

                                    <td>
                                        <SeverityBadge value={item.severity} />
                                    </td>

                                    <td>
                                        <StatusBadge value={item.status} />
                                    </td>

                                    <td className="text-sm text-slate-600">
                                        {item.ward?.name}
                                    </td>

                                    <td className="text-sm text-slate-500">
                                        {formatDateTime(item.reportedAt)}
                                    </td>

                                    <td className="px-4">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/ward-incidents/${item.id}`}
                                                className="w-9 h-9 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-700"
                                            >
                                                <EyeOutlined />
                                            </Link>

                                            <HasRoles roles={[Roles.ADMIN, Roles.NURSE]}>
                                                <button
                                                    onClick={() => {
                                                        setEditing(item);
                                                        setOpenDrawer(true);
                                                    }}
                                                    className="w-9 h-9 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-700"
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

            <UpdateWardIncidentDrawer
                open={openDrawer}
                incident={editing}
                onClose={() => {
                    setOpenDrawer(false);
                    setEditing(null);
                }}
                onUpdated={() => fetchPage(page)}
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

function SeverityBadge({ value }: { value: string }) {
    const map: Record<string, string> = {
        LOW: 'bg-green-100 text-green-700',
        MEDIUM: 'bg-yellow-100 text-yellow-700',
        HIGH: 'bg-orange-100 text-orange-700',
        CRITICAL: 'bg-red-100 text-red-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs ${map[value]}`}>
            {value}
        </span>
    );
}

function StatusBadge({ value }: { value: string }) {
    const map: Record<string, string> = {
        ACTIVE: 'bg-red-100 text-red-700',
        RESOLVED: 'bg-green-100 text-green-700',
        CLOSED: 'bg-slate-100 text-slate-700',
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs ${map[value]}`}>
            {value}
        </span>
    );
}

type Option =
  | string
  | { value: string; label: string };

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
        onChange={e => onChange(e.target.value as T)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        <option value="">{placeholder}</option>

        {options.map(opt => {
          if (typeof opt === 'string') {
            return (
              <option key={opt} value={opt}>
                {opt.replace(/_/g, ' ')}
              </option>
            );
          }

          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </div>
  );
}