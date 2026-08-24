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

const SEVERITY_META: Record<string, { dot: string; badge: string }> = {
    LOW: { dot: '!bg-[#1D9E75]', badge: '!bg-[#ECFBF5] !text-[#1D9E75]' },
    MEDIUM: { dot: '!bg-[#D08A2E]', badge: '!bg-[#FFF8EC] !text-[#B9770E]' },
    HIGH: { dot: '!bg-[#EA6C2E]', badge: '!bg-[#FFF1E9] !text-[#C2571C]' },
    CRITICAL: { dot: '!bg-[#DC2626]', badge: '!bg-[#FEF2F2] !text-[#DC2626]' },
};

const STATUS_META: Record<string, { dot: string; badge: string }> = {
    ESCALATED: { dot: '!bg-[#DC2626]', badge: '!bg-[#FEF2F2] !text-[#DC2626]' },
    RESOLVED: { dot: '!bg-[#1D9E75]', badge: '!bg-[#ECFBF5] !text-[#1D9E75]' },
    ACTIVE: { dot: '!bg-[#1D6FE0]', badge: '!bg-[#EFF5FF] !text-[#1D6FE0]' },
};

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

    async function fetchIncidentsData(nextPage: number, nextLimit = limit) {
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
        if (!res.ok) return null;

        return json.wardIncidents as GetWardIncidentsQuery['wardIncidents'];
    }

    async function fetchPage(nextPage: number, nextLimit = limit) {
        const wardIncidents = await fetchIncidentsData(nextPage, nextLimit);
        if (!wardIncidents) return;

        setList(wardIncidents.items);
        setPage(wardIncidents.page);
        setTotal(wardIncidents.total);
    }

    useEffect(() => {
        let ignore = false;

        fetchIncidentsData(1, limit).then(wardIncidents => {
            if (ignore || !wardIncidents) return;

            setList(wardIncidents.items);
            setPage(wardIncidents.page);
            setTotal(wardIncidents.total);
        });

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [severityFilter, statusFilter, typeFilter, wardIdFilter]);

    const hasActiveFilters = !!severityFilter || !!statusFilter || !!typeFilter || !!wardIdFilter;

    const clearFilters = () => {
        setSeverityFilter('');
        setStatusFilter('');
        setTypeFilter('');
        setWardIdFilter('');
    };

    return (
        <section className="space-y-5 sm:space-y-6">
            <div className="border-t !border-[#E8E6E0] pt-6 sm:pt-8">
                <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                    Ward incidents
                </h2>
                <p className="mt-0.5 text-sm !text-[#767570]">
                    Clinical incidents, reports, and safety events.
                </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    <FilterOutlined />
                    Filters
                </div>

                <div className="grid w-full grid-cols-2 gap-2.5 sm:grid-cols-4 lg:w-auto">
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
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px]">
                        <thead>
                            <tr className="border-b !border-[#E8E6E0] text-left text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                                <th className="px-4 py-3 sm:px-5">Type</th>
                                <th className="py-3">Severity</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Ward</th>
                                <th className="py-3">Reported</th>
                                <th className="px-4 py-3 text-right sm:px-5">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y !divide-[#E8E6E0]">
                            {list.map(item => (
                                <tr key={item.id} className="transition hover:!bg-[#FAFAF8]">
                                    <td className="px-4 py-4 text-sm font-medium !text-[#16211B] sm:px-5">
                                        {item.type.replace(/_/g, ' ')}
                                    </td>

                                    <td className="py-4">
                                        <Badge value={item.severity} meta={SEVERITY_META} />
                                    </td>

                                    <td className="py-4">
                                        <Badge value={item.status} meta={STATUS_META} />
                                    </td>

                                    <td className="py-4 text-sm !text-[#5F5E5A]">
                                        {item.ward?.name ?? '—'}
                                    </td>

                                    <td className="py-4 text-sm !text-[#767570]">
                                        {formatDateTime(item.reportedAt)}
                                    </td>

                                    <td className="px-4 py-4 sm:px-5">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                href={`/dashboard/ward-incidents/${item.id}`}
                                                aria-label="View incident"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
                                            >
                                                <EyeOutlined />
                                            </Link>

                                            <HasRoles roles={[Roles.ADMIN, Roles.NURSE, Roles.GUEST]}>
                                                <button
                                                    onClick={() => {
                                                        setEditing(item);
                                                        setOpenDrawer(true);
                                                    }}
                                                    aria-label="Edit incident"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
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
                    <div className="px-4 py-16 text-center">
                        <p className="text-sm font-semibold !text-[#16211B]">
                            {hasActiveFilters ? 'No incidents match these filters' : 'No incidents found'}
                        </p>
                        <p className="mt-1 text-sm !text-[#767570]">
                            {hasActiveFilters ? 'Try adjusting or clearing the filters above.' : 'Reported ward incidents will appear here.'}
                        </p>
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

            <div className="flex justify-center overflow-x-auto pt-2">
                <Pagination
                    current={page}
                    pageSize={limit}
                    total={total}
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

function Badge({
    value,
    meta,
}: {
    value: string;
    meta: Record<string, { dot: string; badge: string }>;
}) {
    const m = meta[value] ?? { dot: '!bg-[#B4B2A9]', badge: '!bg-[#F7F7F5] !text-[#767570]' };

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${m.badge}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
            {value.replace(/_/g, ' ')}
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
        className="h-10 w-full appearance-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
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