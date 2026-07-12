'use client';

import { Skeleton } from 'antd';
import { VisitBedAllocationStatus } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
import { BedAllocationItem } from './VisitBedAllocationsSection';

const TERMINAL_STATUSES = [
  VisitBedAllocationStatus.Released,
  VisitBedAllocationStatus.Transferred,
];

const STATUS_STYLES: Record<string, string> = {
  RESERVED: 'bg-yellow-100 text-yellow-700',
  OCCUPIED: 'bg-blue-100 text-blue-700',
  RELEASED: 'bg-green-100 text-green-700',
  TRANSFERRED: 'bg-gray-100 text-gray-700',
};

interface Props {
  allocations: BedAllocationItem[];
  loading: boolean;
  updatingId: string | null;
  onUpdateStatus: (
    allocationId: string,
    status: VisitBedAllocationStatus
  ) => void;
}

export default function BedAllocationsList({
  allocations,
  loading,
  updatingId,
  onUpdateStatus,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">No bed allocations for this visit yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {allocations.map(allocation => {
        const isTerminal = TERMINAL_STATUSES.includes(allocation.status);

        return (
          <div
            key={allocation.id}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {allocation.bed?.name}{' '}
                  <span className="text-gray-400 font-normal">
                    ({allocation.bed?.bedCode})
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Class: {allocation.bed?.class}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_STYLES[allocation.status]}`}
              >
                {allocation.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
              <p>Allocated: {formatDateTime(allocation.allocatedAt)}</p>
              {allocation.releasedAt && (
                <p>Released: {formatDateTime(allocation.releasedAt)}</p>
              )}
              {allocation.allocatedBy && (
                <p>Allocated by: {allocation.allocatedBy.fullName}</p>
              )}
              {allocation.releasedBy && (
                <p>Released by: {allocation.releasedBy.fullName}</p>
              )}
            </div>

            {allocation.reason && (
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-700">Reason: </span>
                {allocation.reason}
              </p>
            )}

            {!isTerminal && (
              <div className="pt-2">
                <select
                  className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value=""
                  disabled={updatingId === allocation.id}
                  onChange={e => {
                    const nextStatus = e.target
                      .value as VisitBedAllocationStatus;

                    if (!nextStatus) return;

                    onUpdateStatus(allocation.id, nextStatus);
                  }}
                >
                  <option value="">
                    {updatingId === allocation.id
                      ? 'Updating...'
                      : 'Change status'}
                  </option>
                  {Object.values(VisitBedAllocationStatus)
                    .filter(status => status !== allocation.status)
                    .map(status => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, ' ')}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}