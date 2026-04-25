'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pagination } from 'antd';
import { clientFetch } from '@/lib/clientFetch';
import {
  ChargeDomain,
  FindAllLabRequestsQuery,
  GetVisitsByPatientUserCodeQuery,
  LabPriority,
  LabRequestStatus,
} from '@/shared/graphql/generated/graphql';
import {
  SearchOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useBilling } from '@/hooks/billing/useBilling';
import PatientVisitCard from './components/PatientVisitCard';
import { formatDateTime } from '@/utils/formatDateTime';

type Visit =
  GetVisitsByPatientUserCodeQuery['visitsByPatientUserCode'][number];

type LabRequestListItem =
  FindAllLabRequestsQuery['labRequests']['items'][number];

export default function LabRequestManagementClient({
  paginated,
}: {
  paginated: FindAllLabRequestsQuery['labRequests'];
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const { catalogs } = useBilling(ChargeDomain.Lab);

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

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 500);

    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!debouncedSearch) {
      setVisits([]);
      setSearched(false);
      return;
    }

    const run = async () => {
      setLoading(true);
      setSearched(true);

      try {
        const res = await clientFetch(
          `/api/visit/search-by-user-code?userCode=${debouncedSearch}`
        );

        const json = await res.json();
        setVisits(json.visits ?? []);
      } catch {
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [debouncedSearch]);

  const patient = useMemo(() => visits[0]?.patient, [visits]);

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <section className="space-y-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Lab Requests
            </h1>
            <p className="text-gray-500 mt-2">
              Search patient visits by user code and create lab requests.
            </p>
          </div>

          <div className="relative max-w-xl">
            <input
              type="number"
              min={1}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Enter patient user code..."
              className="w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-12 py-4 text-lg shadow-sm focus:ring-2 focus:ring-green-700"
            />

            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            {loading && (
              <LoadingOutlined className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700 animate-spin" />
            )}
          </div>

          {patient && (
            <PatientVisitCard
              patient={patient}
              visits={visits}
              catalogs={catalogs}
            />
          )}
        </section>

        <section className="space-y-6">
          <div className="border-t border-gray-200 pt-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Request History
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={e =>
                setStatusFilter(e.target.value as LabRequestStatus | '')
              }
              className="rounded-xl border px-4 py-3 bg-white"
            >
              <option value="">All Status</option>
              {Object.values(LabRequestStatus).map(s => (
                <option key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={e =>
                setPriorityFilter(e.target.value as LabPriority | '')
              }
              className="rounded-xl border px-4 py-3 bg-white"
            >
              <option value="">All Priority</option>
              {Object.values(LabPriority).map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">
                    <th className="px-6 py-4">Tests</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Requested</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {list.map(item => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                        {item.testNames?.join(', ')}
                      </td>

                      <td className="px-6 py-4">
                        <PriorityBadge priority={item.priority} />
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDateTime(item.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <a
                          href={`/dashboard/lab-requests/${item.id}`}
                          className="text-green-700 font-medium hover:underline"
                        >
                          View
                        </a>
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

          <div className="flex justify-center pt-4">
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              showSizeChanger
              onChange={(p, l) => {
                setLimit(l);
                fetchPage(p, l);
              }}
            />
          </div>
        </section>
      </div>
    </div>
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
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
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
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[priority || 'ROUTINE']}`}>
      {priority || LabPriority.Routine}
    </span>
  );
}