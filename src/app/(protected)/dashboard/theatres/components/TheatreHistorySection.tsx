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

  return (
    <section className="space-y-6">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Theatre Directory
          </h2>

          <p className="text-slate-500 mt-2">
            Manage operating theatres and monitor departmental availability.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
          <FilterOutlined />
          Smart Filters Enabled
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          icon={<Building2 className="w-5 h-5" />}
          label="Total Theatres"
          value={String(total)}
        />

        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Active Theatres"
          value={String(
            list.filter(i => i.isActive)
              .length
          )}
        />

        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Combined Capacity"
          value={String(
            list.reduce(
              (acc, item) =>
                acc +
                (item.capacity || 0),
              0
            )
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select
          value={department}
          onChange={e =>
            setDepartment(
              e.target.value
            )
          }
          className="h-13 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
        >
          <option value="">
            All Departments
          </option>

          {Object.values(
            TheatreDepartment
          ).map(item => (
            <option
              key={item}
              value={item}
            >
              {item.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={isActive}
          onChange={e =>
            setIsActive(
              e.target.value
            )
          }
          className="h-13 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600"
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

      <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-6 py-5">
                  Theatre
                </th>

                <th className="px-6 py-5">
                  Department
                </th>

                <th className="px-6 py-5">
                  Floor
                </th>

                <th className="px-6 py-5">
                  Capacity
                </th>

                <th className="px-6 py-5">
                  Status
                </th>

                <th className="px-6 py-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {list.map(item => (
                <tr
                  key={item.id}
                  className="hover:bg-cyan-50/40 transition"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
                        <Building2 className="w-5 h-5" />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900">
                          {item.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {item.code ||
                            'No code assigned'}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                      {item.department}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Layers3 className="w-4 h-4 text-slate-400" />
                      {item.floor || '—'}
                    </div>
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      {item.capacity || '—'}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${item.isActive
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                        }`}
                    >
                      {item.isActive
                        ? 'ACTIVE'
                        : 'INACTIVE'}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">

                      <Link
                        href={`/dashboard/theatres/${item.id}`}
                        className="w-10 h-10 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-700 transition flex items-center justify-center"
                      >
                        <EyeOutlined />
                      </Link>

                      <HasRoles roles={[Roles.ADMIN]}>
                        <button
                          onClick={() =>
                            setEditingTheatre(
                              item
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
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
          <div className="py-24 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-5">
              <Building2 className="w-8 h-8 text-slate-400" />
            </div>

            <p className="text-lg font-bold text-slate-700">
              No theatres found
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Try adjusting filters or create a new theatre.
            </p>
          </div>
        )}
      </div>

      <UpdateTheatreDrawer
        theatre={editingTheatre}
        open={!!editingTheatre}
        onClose={() =>
          setEditingTheatre(null)
        }
        onUpdated={() => {
          fetchPage(page);

          setEditingTheatre(null);
          triggerRefresh();
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
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );
}