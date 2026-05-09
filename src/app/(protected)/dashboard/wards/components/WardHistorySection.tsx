'use client';

import { useEffect, useState } from 'react';

import { Pagination, message } from 'antd';

import {
  GetWardsQuery,
  WardClass,
  WardDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import {
  EditOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import UpdateWardDrawer from './UpdateWardDrawer';

type WardItem =
  GetWardsQuery['wards']['items'][number];

export default function WardHistorySection({
  paginated,
}: {
  paginated: GetWardsQuery['wards'];
}) {
  const [list, setList] = useState<WardItem[]>(
    paginated.items
  );

  const [page, setPage] = useState(paginated.page);
  const [total, setTotal] = useState(paginated.total);
  const [limit, setLimit] = useState(20);

  const [department, setDepartment] = useState('');
  const [wardClass, setWardClass] = useState('');

  const [editingWard, setEditingWard] =
    useState<WardItem | null>(null);

  async function fetchPage(
    nextPage: number,
    nextLimit = limit
  ) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(nextLimit),
    });

    if (department) {
      params.append('department', department);
    }

    if (wardClass) {
      params.append('wardClass', wardClass);
    }

    const res = await clientFetch(
      `/api/ward/list?${params.toString()}`
    );

    const json = await res.json();

    if (!res.ok) {
      message.error(json.error || 'Failed to fetch wards');
      return;
    }

    setList(json.wards.items);
    setPage(json.wards.page);
    setTotal(json.wards.total);
  }

  useEffect(() => {
    fetchPage(1);
  }, [department, wardClass]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Ward Directory
        </h2>

        <p className="text-gray-500 mt-1">
          View and manage all hospital wards.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="h-12 rounded-2xl border border-gray-200 px-4"
        >
          <option value="">All Departments</option>

          {Object.values(WardDepartment).map(item => (
            <option
              key={item}
              value={item}
            >
              {item.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={wardClass}
          onChange={e => setWardClass(e.target.value)}
          className="h-12 rounded-2xl border border-gray-200 px-4"
        >
          <option value="">All Classes</option>

          {Object.values(WardClass).map(item => (
            <option
              key={item}
              value={item}
            >
              {item.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="bg-gray-50">
              <tr className="text-left text-sm text-gray-500">
                <th className="px-6 py-4">Ward</th>
                <th className="px-6 py-4">Code</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {list.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/40 transition"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.name}
                  </td>

                  <td className="px-6 py-4">
                    {item.code || '—'}
                  </td>

                  <td className="px-6 py-4">
                    {item.department}
                  </td>

                  <td className="px-6 py-4">
                    {item.wardClass}
                  </td>

                  <td className="px-6 py-4">
                    {item.floor || '—'}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isActive
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700"
                      >
                        <EyeOutlined />
                      </button>

                      <button
                        onClick={() =>
                          setEditingWard(item)
                        }
                        className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-100 text-green-700"
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
          <div className="py-16 text-center text-gray-500">
            No wards found.
          </div>
        )}
      </div>

      <UpdateWardDrawer
        ward={editingWard}
        open={!!editingWard}
        onClose={() => setEditingWard(null)}
        onUpdated={() => {
          fetchPage(page);
          setEditingWard(null);
        }}
      />

      <div className="flex justify-center">
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