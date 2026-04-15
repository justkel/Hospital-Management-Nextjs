'use client';

import { useEffect, useState } from 'react';
import {
  AuditDateFilter,
  GetAuditLogsQuery,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import AuditFilters from './components/AuditFilters';
import AuditTable from './components/AuditTable';
import AuditPagination from './components/AuditPagination';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [list, setList] = useState<AuditItem[]>(paginated.items);
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || paginated.page
  );
  const [total, setTotal] = useState<number>(paginated.total);
  const [limit, setLimit] = useState<number>(
    Number(searchParams.get('limit')) || 20
  );

  const [filters, setFilters] = useState<Filters>({
    action: searchParams.get('action') || undefined,
    actorId: searchParams.get('actorId') || undefined,
    entity: searchParams.get('entity') || undefined,
    dateFilter:
      (searchParams.get('dateFilter') as AuditDateFilter) || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
  });

  useEffect(() => {
    async function load() {
      const params = new URLSearchParams();

      params.set('page', String(page));
      params.set('limit', String(limit));

      if (filters.action) params.set('action', filters.action);
      if (filters.actorId) params.set('actorId', filters.actorId);
      if (filters.entity) params.set('entity', filters.entity);
      if (filters.dateFilter) params.set('dateFilter', filters.dateFilter);
      if (filters.startDate) params.set('startDate', filters.startDate);
      if (filters.endDate) params.set('endDate', filters.endDate);

      router.replace(`?${params.toString()}`);

      const res = await clientFetch(`/api/audit/list?${params}`);
      if (!res.ok) return;

      const json: { audits: AuditPaginated } = await res.json();

      setList(json.audits.items);
      setPage(json.audits.page);
      setTotal(json.audits.total);
    }

    load();
  }, [page, limit, filters, router]);

  function handleFilterChange(nextFilters: Filters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function handlePaginationChange(nextPage: number, nextLimit: number) {
    setPage(nextPage);
    setLimit(nextLimit);
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