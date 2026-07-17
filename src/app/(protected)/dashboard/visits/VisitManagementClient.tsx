'use client';

import { useState } from 'react';
import { Pagination, Select } from 'antd';
import {
  FindAllVisitsQuery,
  VisitStatus,
  VisitType,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import Link from 'next/link';
import { Bed, CalendarClock, ClipboardList, MessageCircle, RotateCw, Scissors, Stethoscope, Video } from 'lucide-react';

export type VisitListItem =
  FindAllVisitsQuery['visits']['items'][number];

export default function VisitManagementClient({
  paginated,
}: {
  paginated: FindAllVisitsQuery['visits'];
}) {
  const { searchParams, update } = useUrlFilters();

  const [list, setList] = useState<VisitListItem[]>(paginated.items);
  const [page, setPage] = useState(paginated.page);
  const [total, setTotal] = useState(paginated.total);
  const [limit, setLimit] = useState(Number(searchParams.get('limit')) || 20);

  const [statusFilter, setStatusFilter] = useState<VisitStatus | 'ALL'>(
    (searchParams.get('status') as VisitStatus) ?? 'ALL',
  );
  const [typeFilter, setTypeFilter] = useState<VisitType | 'ALL'>(
    (searchParams.get('visitType') as VisitType) ?? 'ALL',
  );

  async function fetchPage(
    nextPage: number,
    nextLimit: number,
    nextStatus: VisitStatus | 'ALL',
    nextType: VisitType | 'ALL',
  ) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(nextLimit),
    });

    if (nextStatus !== 'ALL') {
      params.set('status', nextStatus);
    }

    if (nextType !== 'ALL') {
      params.set('visitType', nextType);
    }

    const res = await clientFetch(`/api/visit/list?${params.toString()}`);

    const json = await res.json();
    if (!res.ok) return;

    setPage(json.visits.page);
    setTotal(json.visits.total);
    setList(json.visits.items);
  }

  function applyFilters(next: {
    page: number;
    limit: number;
    status: VisitStatus | 'ALL';
    type: VisitType | 'ALL';
  }) {
    setStatusFilter(next.status);
    setTypeFilter(next.type);
    setLimit(next.limit);

    update({
      status: next.status === 'ALL' ? undefined : next.status,
      visitType: next.type === 'ALL' ? undefined : next.type,
      page: next.page,
      limit: next.limit,
    });

    fetchPage(next.page, next.limit, next.status, next.type);
  }

  function handleStatusFilterChange(next: VisitStatus | 'ALL') {
    applyFilters({ page: 1, limit, status: next, type: typeFilter });
  }

  function handleTypeFilterChange(next: VisitType | 'ALL') {
    applyFilters({ page: 1, limit, status: statusFilter, type: next });
  }

  const TYPE_ICON: Record<VisitType, React.ReactNode> = {
    [VisitType.Opd]: <Stethoscope size={12} />,
    [VisitType.Emergency]: <CalendarClock size={12} />,
    [VisitType.Admission]: <ClipboardList size={12} />,
    [VisitType.Consultation]: <MessageCircle size={12} />,
    [VisitType.FollowUp]: <RotateCw size={12} />,
    [VisitType.Surgery]: <Scissors size={12} />,
    [VisitType.Telemedicine]: <Video size={12} />,
    [VisitType.Daycare]: <Bed size={12} />,
  };

  const STATUS_STYLES: Record<string, string> = {
    OPEN: 'bg-[#F0FAF5] text-[#1D9E75] border-[#1D9E75]/25',
    ADMITTED: 'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/25',
    DISCHARGED: 'bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]/25',
    CANCELLED: 'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/25',
    CLOSED: 'bg-[#F7F7F5] text-[#888780] border-[#E8E6E0]',
  };

  function StatusBadge({ status }: { status: string }) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${STATUS_STYLES[status] ?? 'bg-[#F7F7F5] text-[#888780] border-[#E8E6E0]'}`}>
        <span className="h-1 w-1 rounded-full bg-current" />
        {status}
      </span>
    );
  }

  const statusOptions = [
    { value: 'ALL' as const, label: 'All statuses' },
    ...Object.values(VisitStatus).map(s => ({
      value: s,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: STATUS_STYLES[s]?.includes('1D9E75') ? '#1D9E75'
              : STATUS_STYLES[s]?.includes('2563EB') ? '#2563EB'
              : STATUS_STYLES[s]?.includes('7C3AED') ? '#7C3AED'
              : STATUS_STYLES[s]?.includes('DC2626') ? '#DC2626'
              : '#B4B2A9' }}
          />
          {s}
        </span>
      ),
    })),
  ];

  const typeOptions = [
    { value: 'ALL' as const, label: 'All types' },
    ...Object.values(VisitType).map(t => ({
      value: t,
      label: (
        <span className="inline-flex items-center gap-1.5">
          <span className="text-[#B4B2A9]">{TYPE_ICON[t]}</span>
          {t.replace(/_/g, ' ')}
        </span>
      ),
    })),
  ];

    const openCount = list.filter(v => v.status === VisitStatus.Open).length;
    const admittedCount = list.filter(v => v.status === VisitStatus.Admitted).length;
    const closedCount = list.filter(v => v.status === VisitStatus.Closed || v.status === VisitStatus.Discharged).length;

    return (
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-6 sm:px-8">
          <div className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#1D9E75]/15 blur-[50px]" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#5DCAA5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                Clinical workflow
              </div>
              <h1 className="mb-1 text-[20px] font-medium tracking-[-0.02em] text-white">Visits</h1>
              <p className="text-[13px] text-[#5a7a6a]">Track and manage all patient visits</p>
            </div>

            <div className="hidden gap-2 sm:flex">
              {[
                { val: total, label: 'Total' },
                { val: openCount, label: 'Open' },
                { val: admittedCount, label: 'Admitted' },
                { val: closedCount, label: 'Closed' },
              ].map(s => (
                <div key={s.label}
                  className="min-w-[58px] rounded-[10px] border border-white/[0.08] bg-white/[0.05] px-3 py-2.5 text-center"
                >
                  <p className="text-[18px] font-medium leading-none text-white">{s.val}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.07em] text-[#3B6D11]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={statusOptions}
            className="w-[170px] [&_.ant-select-selector]:!rounded-[9px] [&_.ant-select-selector]:!border-[#E8E6E0] [&_.ant-select-selector]:!h-9 [&_.ant-select-selector]:!items-center"
          />

          <Select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            options={typeOptions}
            className="w-[200px] [&_.ant-select-selector]:!rounded-[9px] [&_.ant-select-selector]:!border-[#E8E6E0] [&_.ant-select-selector]:!h-9 [&_.ant-select-selector]:!items-center"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.length > 0 ? (
            list.map(v => (
              <Link
                key={v.id}
                href={`/dashboard/visits/${v.id}`}
                className="flex flex-col gap-2.5 rounded-xl border border-[#E8E6E0] bg-white p-4 transition hover:border-[#D3D1C7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E6E0] bg-[#F7F7F5] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.06em] text-[#5F5E5A]">
                    <span className="text-[#B4B2A9]">
                      {TYPE_ICON[v.visitType] ?? <Stethoscope size={12} />}
                    </span>
                    {v.visitType.replace(/_/g, ' ')}
                  </span>
                  <StatusBadge status={v.status} />
                </div>

                <div className="h-px bg-[#F0F0EC]" />

                <div className="flex flex-col gap-2">
                  <div>
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                      Patient
                    </p>
                    <p className="text-[13px] font-medium text-[#2C2C2A]">
                      {v.patient.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                      Visit date
                    </p>
                    <p className="text-[12px] text-[#888780]">
                      {v.visitDateTime
                        ? new Date(v.visitDateTime).toLocaleString('en-GB', {
                          day: '2-digit', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit', hour12: true,
                        })
                        : '—'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end border-t border-[#F0F0EC] pt-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#1D9E75]/20 bg-[#F0FAF5] px-2.5 py-1.5 text-[12px] font-medium text-[#1D9E75]">
                    View visit →
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-[#E8E6E0] bg-white">
                <ClipboardList size={22} className="text-[#B4B2A9]" />
              </div>
              <p className="text-[13px] font-medium text-[#5F5E5A]">No visits found</p>
              <p className="mt-1 text-[12px] text-[#B4B2A9]">
                {statusFilter === 'ALL' && typeFilter === 'ALL'
                  ? 'Patient visits will appear here once created'
                  : 'No visits match the selected filters'}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
          onChange={(p, l) => {
            applyFilters({ page: p, limit: l, status: statusFilter, type: typeFilter });
          }}
          />
        </div>
      </div>
    );

  }
