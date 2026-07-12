'use client';

import { Skeleton } from 'antd';
import { History, GitMerge, ArrowDown, User } from 'lucide-react';
import { VisitBedAllocationStatus } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
import { BedAllocationItem } from './VisitBedAllocationsSection';
import { STATUS_STYLES, formatStatusLabel } from './bedAllocationStatus';

interface Props {
  allocations: BedAllocationItem[];
  loading: boolean;
}

function TransferConnector({
  fromClass,
  toClass,
}: {
  fromClass?: string;
  toClass?: string;
}) {
  const sameClass = fromClass && toClass && fromClass === toClass;

  return (
    <div className="ml-5 flex items-center gap-2 py-2 pl-[22px]">
      <div
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium ${
          sameClass
            ? 'bg-slate-100 text-slate-500'
            : 'bg-teal-50 text-teal-700'
        }`}
      >
        <GitMerge size={12} />
        {sameClass
          ? 'Transferred · same class · charge merged'
          : `Transferred · upgraded to ${toClass} · new charge added`}
      </div>
    </div>
  );
}

function PlainConnector() {
  return (
    <div className="ml-5 flex items-center gap-2 py-2 pl-[22px] text-slate-300">
      <ArrowDown size={14} />
    </div>
  );
}

export default function BedJourneyTimeline({ allocations, loading }: Props) {
  if (loading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
          <History size={20} className="text-slate-400" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">
          No bed history yet
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Once a bed is allocated, its journey shows up here.
        </p>
      </div>
    );
  }

  const chronological = [...allocations].sort(
    (a, b) =>
      new Date(a.allocatedAt).getTime() - new Date(b.allocatedAt).getTime()
  );

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <History size={16} className="text-teal-600" />
        Bed journey
      </div>

      <div>
        {chronological.map((allocation, index) => {
          const style = STATUS_STYLES[allocation.status];
          const next = chronological[index + 1];

          return (
            <div key={allocation.id}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${style.solid}`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  {index < chronological.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-slate-200" />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {allocation.bed?.name}{' '}
                          <span className="font-normal text-slate-400">
                            ({allocation.bed?.bedCode})
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {allocation.bed?.class} accommodation
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${style.badge}`}
                      >
                        {formatStatusLabel(allocation.status)}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-1.5 text-xs text-slate-500 sm:grid-cols-2">
                      <p>Allocated {formatDateTime(allocation.allocatedAt)}</p>
                      {allocation.releasedAt && (
                        <p>Ended {formatDateTime(allocation.releasedAt)}</p>
                      )}
                      {allocation.allocatedBy && (
                        <p className="flex items-center gap-1">
                          <User size={12} />
                          {allocation.allocatedBy.fullName}
                        </p>
                      )}
                      {allocation.releasedBy && (
                        <p className="flex items-center gap-1">
                          <User size={12} />
                          Ended by {allocation.releasedBy.fullName}
                        </p>
                      )}
                    </div>

                    {allocation.reason && (
                      <p className="mt-2 text-xs text-slate-500">
                        <span className="font-medium text-slate-600">
                          Reason:{' '}
                        </span>
                        {allocation.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {next &&
                (allocation.status === VisitBedAllocationStatus.Transferred ? (
                  <TransferConnector
                    fromClass={allocation.bed?.class}
                    toClass={next.bed?.class}
                  />
                ) : (
                  <PlainConnector />
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}