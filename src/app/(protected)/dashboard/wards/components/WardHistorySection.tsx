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
    FilterOutlined,
} from '@ant-design/icons';

import UpdateWardDrawer from './UpdateWardDrawer';
import Link from 'next/link';

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

    const [total, setTotal] = useState(
        paginated.total
    );

    const [limit, setLimit] = useState(20);

    const [department, setDepartment] =
        useState('');

    const [wardClass, setWardClass] =
        useState('');

    const [isActive, setIsActive] =
        useState('');

    const [editingWard, setEditingWard] =
        useState<WardItem | null>(null);

    async function fetchWardsData(
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

        if (isActive) {
            params.append('isActive', isActive);
        }

        const res = await clientFetch(
            `/api/ward/list?${params.toString()}`
        );

        const json = await res.json();

        if (!res.ok) {
            message.error(
                json.error || 'Failed to fetch wards'
            );

            return null;
        }

        return json.wards as GetWardsQuery['wards'];
    }

    async function fetchPage(
        nextPage: number,
        nextLimit = limit
    ) {
        const wards = await fetchWardsData(nextPage, nextLimit);
        if (!wards) return;

        setList(wards.items);
        setPage(wards.page);
        setTotal(wards.total);
    }

    useEffect(() => {
        let ignore = false;

        fetchWardsData(1).then(wards => {
            if (ignore || !wards) return;

            setList(wards.items);
            setPage(wards.page);
            setTotal(wards.total);
        });

        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [department, wardClass, isActive]);

    return (
        <section className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Ward Directory
                    </h2>

                    <p className="text-gray-500 mt-1">
                        View and manage all hospital wards.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <FilterOutlined />
                    Smart Filters
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <select
                    value={department}
                    onChange={e =>
                        setDepartment(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">
                        All Departments
                    </option>

                    {Object.values(WardDepartment).map(
                        item => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item.replace(/_/g, ' ')}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={wardClass}
                    onChange={e =>
                        setWardClass(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">
                        All Classes
                    </option>

                    {Object.values(WardClass).map(
                        item => (
                            <option
                                key={item}
                                value={item}
                            >
                                {item.replace(/_/g, ' ')}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={isActive}
                    onChange={e =>
                        setIsActive(e.target.value)
                    }
                    className="h-12 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="">
                        All Status
                    </option>

                    <option value="true">
                        Active
                    </option>

                    <option value="false">
                        Inactive
                    </option>
                </select>
            </div>

            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-[950px] w-full">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-sm text-gray-500">
                                <th className="px-6 py-4">
                                    Ward
                                </th>

                                <th className="px-6 py-4">
                                    Code
                                </th>

                                <th className="px-6 py-4">
                                    Department
                                </th>

                                <th className="px-6 py-4">
                                    Class
                                </th>

                                <th className="px-6 py-4">
                                    Floor
                                </th>

                                <th className="px-6 py-4">
                                    Status
                                </th>

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
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {item.name}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.code || '—'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                            {item.department}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                                            {item.wardClass}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-gray-700">
                                        {item.floor || '—'}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${item.isActive
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

                                            <Link
                                                href={`/dashboard/wards/${item.id}`}
                                                className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition flex items-center justify-center"
                                                title="View Ward"
                                            >
                                                <EyeOutlined />
                                            </Link>
                                            <button
                                                onClick={() =>
                                                    setEditingWard(item)
                                                }
                                                className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition"
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
                    <div className="py-20 text-center">
                        <p className="text-gray-500 text-lg font-medium">
                            No wards found
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                            Try adjusting your filters.
                        </p>
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