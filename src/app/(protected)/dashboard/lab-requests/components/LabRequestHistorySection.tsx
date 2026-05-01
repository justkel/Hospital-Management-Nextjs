'use client';

import { useEffect, useState } from 'react';
import { Pagination } from 'antd';
import Link from 'next/link';
import { clientFetch } from '@/lib/clientFetch';
import {
  FindAllLabRequestsQuery,
  LabPriority,
  LabRequestStatus,
} from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
import {
  EyeOutlined,
  EditOutlined,
  DownOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';
import UpdateLabRequestDrawer from './UpdateLabRequestDrawer';

type LabRequestListItem =
  FindAllLabRequestsQuery['labRequests']['items'][number];

export default function LabRequestHistorySection({
  paginated,
  catalogs,
}: {
  paginated: FindAllLabRequestsQuery['labRequests'];
  catalogs: ChargeCatalogOption[];
}) {
  const [list, setList] = useState<LabRequestListItem[]>(paginated.items);
  const [page, setPage] = useState<number>(paginated.page);
  const [total, setTotal] = useState<number>(paginated.total);
  const [limit, setLimit] = useState<number>(20);

  const [statusFilter, setStatusFilter] = useState<
    LabRequestStatus | ''
  >('');
  const [priorityFilter, setPriorityFilter] = useState<
    LabPriority | ''
  >('');

  const [editingRequest, setEditingRequest] =
    useState<LabRequestListItem | null>(null);

  const [showEditDrawer, setShowEditDrawer] = useState(false);

  async function fetchPage(nextPage: number, nextLimit = limit) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(nextLimit),
    });

    if (statusFilter) params.append('status', statusFilter);
    if (priorityFilter) params.append('priority', priorityFilter);

    const res = await clientFetch(
      `/api/lab-request/list?${params.toString()}`
    );

    const json = await res.json();
    if (!res.ok) return;

    setPage(json.labRequests.page);
    setTotal(json.labRequests.total);
    setList(json.labRequests.items);
  }

  useEffect(() => {
    fetchPage(1, limit);
  }, [statusFilter, priorityFilter]);

  return (
    <section className="space-y-6">
      <div className="border-t border-gray-200 pt-8 sm:pt-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Request History
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          View and manage all submitted lab requests.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FilterOutlined />
          Filters
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as LabRequestStatus | '')
              }
              className="appearance-none w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none text-sm"
            >
              <option value="">All Status</option>
              {Object.values(LabRequestStatus).map(s => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
            <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={e =>
                setPriorityFilter(e.target.value as LabPriority | '')
              }
              className="appearance-none w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-10 shadow-sm focus:ring-2 focus:ring-green-600 focus:outline-none text-sm"
            >
              <option value="">All Priority</option>
              {Object.values(LabPriority).map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <DownOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[850px] w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-xs sm:text-sm text-gray-500">
                <th className="px-4 sm:px-6 py-4">Tests</th>
                <th className="px-4 sm:px-6 py-4">Priority</th>
                <th className="px-4 sm:px-6 py-4">Status</th>
                <th className="px-4 sm:px-6 py-4">Requested</th>
                <th className="px-4 sm:px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {list.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-green-50/40 transition"
                >
                  <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    <p className="line-clamp-2">
                      {item.tests?.map(t => t.testName).join(', ')}
                    </p>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <PriorityBadge priority={item.priority} />
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {formatDateTime(item.createdAt)}
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/lab-requests/${item.id}`}
                        className="w-10 h-10 rounded-xl !bg-green-50 !hover:bg-green-100 flex items-center justify-center !text-green-700 transition"
                        title="View Request"
                      >
                        <EyeOutlined />
                      </Link>

                      <button
                        onClick={() => {
                          setEditingRequest(item);
                          setShowEditDrawer(true);
                        }}
                        className="w-10 h-10 rounded-xl !bg-blue-50 !hover:bg-blue-100 flex items-center justify-center !text-blue-700 transition"
                        title="Edit Request"
                      >
                        <EditOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No lab requests found.
          </div>
        )}
      </div>

      <UpdateLabRequestDrawer
        open={showEditDrawer}
        onClose={() => {
          setShowEditDrawer(false);
          setEditingRequest(null);
        }}
        request={editingRequest}
        catalogs={catalogs}
        onUpdated={() => {
          fetchPage(page);
          setShowEditDrawer(false);
          setEditingRequest(null);
        }}
      />

      <div className="flex justify-center pt-2 sm:pt-4 overflow-x-auto">
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[status]
        }`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}

function PriorityBadge({ priority }: { priority?: string | null }) {
  const styles: Record<string, string> = {
    ROUTINE: 'bg-gray-100 text-gray-700',
    URGENT: 'bg-orange-100 text-orange-700',
    STAT: 'bg-red-100 text-red-700',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${styles[priority || 'ROUTINE']
        }`}
    >
      {priority || LabPriority.Routine}
    </span>
  );
}