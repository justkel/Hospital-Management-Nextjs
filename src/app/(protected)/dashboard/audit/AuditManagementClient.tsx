'use client';

import { useState } from 'react';
import {
  AuditDateFilter,
  GetAuditLogsQuery,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import AuditFilters from './components/AuditFilters';
import AuditTable from './components/AuditTable';
import AuditPagination from './components/AuditPagination';

export type AuditItem =
  GetAuditLogsQuery['auditLogs']['items'][number];

type AuditPaginated = GetAuditLogsQuery['auditLogs'];

export type Filters = {
  action?: string;
  actorId?: string;
  entity?: string;
  dateFilter?: AuditDateFilter;
  startDate?: string;
  endDate?: string;
};

export default function AuditManagementClient({
  paginated,
}: {
  paginated: AuditPaginated;
}) {
  const [list, setList] = useState<AuditItem[]>(paginated.items);
  const [page, setPage] = useState<number>(paginated.page);
  const [total, setTotal] = useState<number>(paginated.total);
  const [limit, setLimit] = useState<number>(20);
  const [filters, setFilters] = useState<Filters>({});

  async function fetchAudits(
    nextPage: number,
    nextLimit: number,
    nextFilters: Filters
  ) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(nextLimit),
      ...(nextFilters.action && { action: nextFilters.action }),
      ...(nextFilters.actorId && { actorId: nextFilters.actorId }),
      ...(nextFilters.entity && { entity: nextFilters.entity }),
      ...(nextFilters.dateFilter && { dateFilter: nextFilters.dateFilter }),
      ...(nextFilters.startDate && { startDate: nextFilters.startDate }),
      ...(nextFilters.endDate && { endDate: nextFilters.endDate }),
    });

    const res = await clientFetch(`/api/audit/list?${params.toString()}`);
    if (!res.ok) return;

    const json: { audits: AuditPaginated } = await res.json();

    setList(json.audits.items);
    setPage(json.audits.page);
    setTotal(json.audits.total);
  }

  function handleFilterChange(nextFilters: Filters) {
    setFilters(nextFilters);
    fetchAudits(1, limit, nextFilters);
  }

  function handlePaginationChange(nextPage: number, nextLimit: number) {
    setLimit(nextLimit);
    fetchAudits(nextPage, nextLimit, filters);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Audit Logs
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor system activity across your organization
        </p>
      </div>

      <AuditFilters
        filters={filters}
        onChange={handleFilterChange}
      />

      <AuditTable
        list={list}
        page={page}
        limit={limit}
      />

      <AuditPagination
        page={page}
        total={total}
        limit={limit}
        onChange={handlePaginationChange}
      />
    </div>
  );
}