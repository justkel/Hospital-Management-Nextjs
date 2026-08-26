'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Pagination, message } from 'antd';

import {
  GetTheatresQuery,
  TheatreDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import {
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
} from '@ant-design/icons';

import {
  Activity,
  Building2,
  Layers3,
  Users,
} from 'lucide-react';

import Link from 'next/link';

import UpdateTheatreDrawer from './UpdateTheatreDrawer';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type TheatreItem =
  GetTheatresQuery['theatres']['items'][number];

export default function TheatreHistorySection({
  paginated,
  onItemsChange,
}: {
  paginated: GetTheatresQuery['theatres'];
  onItemsChange?: (items: TheatreItem[]) => void;
}) {
  const [list, setList] = useState<
    TheatreItem[]
  >(paginated.items);

  const updateList = (items: TheatreItem[]) => {
    setList(items);
    onItemsChange?.(items);
  };

  const router = useRouter();

  const triggerRefresh = () => {
    router.refresh();
  };

  const [page, setPage] =
    useState(paginated.page);

  const [total, setTotal] =
    useState(paginated.total);

  const [limit, setLimit] =
    useState(20);

  const [department, setDepartment] =
    useState('');

  const [isActive, setIsActive] =
    useState('');

  const [editingTheatre, setEditingTheatre] =
    useState<TheatreItem | null>(null);

  async function fetchTheatresData(
    nextPage: number,
    nextLimit = limit
  ) {
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(nextLimit),
    });

    if (department) {
      params.append(
        'department',
        department
      );
    }

    if (isActive) {
      params.append(
        'isActive',
        isActive
      );
    }

    const res = await clientFetch(
      `/api/theatre/list?${params.toString()}`
    );

    const json = await res.json();

    if (!res.ok) {
      message.error(
        json.error ||
        'Failed to fetch theatres'
      );

      return null;
    }

    return json.theatres as GetTheatresQuery['theatres'];
  }

  async function fetchPage(
    nextPage: number,
    nextLimit = limit
  ) {
    const theatres = await fetchTheatresData(nextPage, nextLimit);
    if (!theatres) return;

    updateList(theatres.items);
    setPage(theatres.page);
    setTotal(theatres.total);
  }

  useEffect(() => {
    let ignore = false;

    fetchTheatresData(1).then(theatres => {
      if (ignore || !theatres) return;

      updateList(theatres.items);
      setPage(theatres.page);
      setTotal(theatres.total);
    });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, isActive]);

  const hasActiveFilters = !!department || !!isActive;

  const clearFilters = () => {
    setDepartment('');
    setIsActive('');
  };

  return (
    <section className="space-y-5 sm:space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
            Theatre directory
          </h2>

          <p className="mt-0.5 text-sm !text-[#767570]">
            Manage operating theatres and monitor departmental availability.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1.5 text-xs font-semibold !text-[#1D9E75]">
          <FilterOutlined />
          Smart filters enabled
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<Building2 className="h-4 w-4" />}
          label="Total theatres"
          value={String(total)}
        />

        <StatCard
          icon={<Activity className="h-4 w-4" />}
          label="Active theatres"
          value={String(list.filter(i => i.isActive).length)}
        />

        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="Combined capacity"
          value={String(
            list.reduce((acc, item) => acc + (item.capacity || 0), 0)
          )}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value)}
          className="h-11 w-full sm:flex-1 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">All departments</option>
          {Object.values(TheatreDepartment).map(item => (
            <option key={item} value={item}>
              {item.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={isActive}
          onChange={e => setIsActive(e.target.value)}
          className="h-11 w-full sm:flex-1 rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="">All status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-xs font-medium !text-[#767570] transition hover:!bg-[#F7F7F5]"
          >
            Clear
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div
          className="overflow-x-auto hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
          }}
        >
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b !border-[#E8E6E0] text-left text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                <th className="px-5 py-3.5">Theatre</th>
                <th className="py-3.5">Department</th>
                <th className="py-3.5">Floor</th>
                <th className="py-3.5">Capacity</th>
                <th className="py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y !divide-[#E8E6E0]">
              {list.map(item => (
                <tr key={item.id} className="transition hover:!bg-[#FAFAF8]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A]">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold !text-[#16211B]">
                          {item.name}
                        </p>
                        <p className="truncate text-xs !text-[#B4B2A9]">
                          {item.code || 'No code assigned'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="inline-flex items-center rounded-full !bg-[#EFF5FF] px-2.5 py-1 text-[11px] font-semibold !text-[#1D6FE0]">
                      {item.department?.replace(/_/g, ' ')}
                    </span>
                  </td>

                  <td className="py-4 text-sm !text-[#5F5E5A]">
                    <div className="flex items-center gap-2">
                      <Layers3 className="h-3.5 w-3.5 !text-[#B4B2A9]" />
                      {item.floor || '—'}
                    </div>
                  </td>

                  <td className="py-4 text-sm !text-[#5F5E5A]">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 !text-[#B4B2A9]" />
                      {item.capacity || '—'}
                    </div>
                  </td>

                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.isActive
                        ? '!bg-[#ECFBF5] !text-[#1D9E75]'
                        : '!bg-[#FEF2F2] !text-[#DC2626]'
                        }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${item.isActive ? '!bg-[#1D9E75]' : '!bg-[#DC2626]'}`} />
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/dashboard/theatres/${item.id}`}
                        aria-label="View theatre"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
                      >
                        <EyeOutlined />
                      </Link>

                      <HasRoles roles={[Roles.ADMIN, Roles.GUEST]}>
                        <button
                          onClick={() => setEditingTheatre(item)}
                          aria-label="Edit theatre"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
                        >
                          <EditOutlined />
                        </button>
                      </HasRoles>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {list.length === 0 && (
          <div className="px-4 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl !bg-[#F7F7F5]">
              <Building2 className="h-6 w-6 !text-[#B4B2A9]" />
            </div>

            <p className="mt-4 text-sm font-semibold !text-[#16211B]">
              {hasActiveFilters ? 'No theatres match these filters' : 'No theatres found'}
            </p>

            <p className="mt-1 text-sm !text-[#767570]">
              {hasActiveFilters ? 'Try adjusting or clearing the filters above.' : 'Create a new theatre to get started.'}
            </p>
          </div>
        )}
      </div>

      <UpdateTheatreDrawer
        theatre={editingTheatre}
        open={!!editingTheatre}
        onClose={() => setEditingTheatre(null)}
        onUpdated={() => {
          fetchPage(page);
          setEditingTheatre(null);
          triggerRefresh();
        }}
      />

      <div className="flex justify-center overflow-x-auto pt-1">
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

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border !border-[#E8E6E0] !bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
            {label}
          </p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums !text-[#16211B]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A]">
          {icon}
        </div>
      </div>
    </div>
  );
}