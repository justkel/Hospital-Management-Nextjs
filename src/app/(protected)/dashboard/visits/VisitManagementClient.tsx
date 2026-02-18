'use client';

import { useState } from 'react';
import { Pagination } from 'antd';
import {
  FindAllVisitsQuery,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import Link from 'next/link';

export type VisitListItem =
  FindAllVisitsQuery['visits']['items'][number];

export default function VisitManagementClient({
  paginated,
}: {
  paginated: FindAllVisitsQuery['visits'];
}) {
  const [list, setList] = useState<VisitListItem[]>(paginated.items);
  const [page, setPage] = useState(paginated.page);
  const [total, setTotal] = useState(paginated.total);
  const [limit, setLimit] = useState(20);

  async function fetchPage(nextPage: number, nextLimit = limit) {
    const res = await clientFetch(
      `/api/visit/list?page=${nextPage}&limit=${nextLimit}`
    );

    const json = await res.json();
    if (!res.ok) return;

    setPage(json.visits.page);
    setTotal(json.visits.total);
    setList(json.visits.items);
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          Visits
        </h1>
        <p className="text-gray-500 mt-1">
          Track and manage all patient visits
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {list.length > 0 ? (
          list.map(v => (
            <Link
              key={v.id}
              href={`/dashboard/visits/${v.id}`}
              className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
                  {v.visitType.replace(/_/g, ' ')}
                </span>

                <StatusBadge status={v.status} />
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-500">
                  Patient Name
                </p>
                <p className="font-medium text-gray-900">
                  {v.patient.fullName}
                </p>

                <p className="text-sm text-gray-500 mt-3">
                  Visit Date
                </p>
                <p className="text-gray-900 text-sm">
                  {v.visitDateTime
                    ? new Date(v.visitDateTime).toLocaleString()
                    : '—'}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No visits found.
          </div>
        )}
      </div>

      <div className="flex justify-center pt-6">
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
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-emerald-100 text-emerald-700',
    ADMITTED: 'bg-blue-100 text-blue-700',
    DISCHARGED: 'bg-purple-100 text-purple-700',
    CANCELLED: 'bg-red-100 text-red-700',
    CLOSED: 'bg-gray-200 text-gray-700',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        styles[status] ?? 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}
