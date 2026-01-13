'use client';

import { useEffect, useState } from 'react';
import {
  StaffRole,
  GetAllStaffQuery,
  CreateStaffInput,
} from '@/shared/graphql/generated/graphql';
import CreateStaffModal from './CreateStaffModal';

type StaffItem = GetAllStaffQuery['staffs'][number];

export default function StaffManagementClient({
  staffs,
}: {
  staffs: StaffItem[];
}) {
  const [list, setList] = useState<StaffItem[]>(staffs);
  const [baseList] = useState<StaffItem[]>(staffs);
  const [open, setOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<StaffItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setList(baseList);
        return;
      }

      const res = await fetch(
        `/api/staff/search?query=${encodeURIComponent(search)}`
      );
      const json = await res.json();
      setList(json.staff ?? []);
    };

    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [search, baseList]);

  const filtered =
    roleFilter === 'ALL'
      ? list
      : list.filter(s => s.roles.includes(roleFilter));

  async function openDetails(id: string) {
    setSelectedId(id);
    setLoadingDetails(true);
    setDetails(null);

    const res = await fetch(`/api/staff/get-by-id?id=${id}`);
    const json = await res.json();

    setDetails(json.staff ?? null);
    setLoadingDetails(false);
  }

  async function handleCreate(data: CreateStaffInput) {
    const res = await fetch('/api/staff/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await res.json();
    if (json.staff) {
      setList(prev => [json.staff, ...prev]);
      setOpen(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Staff Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and explore staff across your organization
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="self-start px-6 py-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 transition"
        >
          + Add Staff
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full md:max-w-sm px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex flex-wrap gap-2">
          {(['ALL', ...Object.values(StaffRole)] as const).map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                roleFilter === r
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(staff => (
          <div
            key={staff.id}
            onClick={() => openDetails(staff.id)}
            className="cursor-pointer bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition group"
          >
            <h2 className="text-lg font-semibold group-hover:text-indigo-600 transition">
              {staff.fullName}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{staff.email}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {staff.roles.map(r => (
                <span
                  key={r}
                  className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end"
          onClick={() => {
            setSelectedId(null);
            setDetails(null);
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-md h-full bg-white p-6 sm:p-8 animate-drawer-in"
          >
            {loadingDetails ? (
              <DetailsSkeleton />
            ) : details ? (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <Avatar name={details.fullName} />
                  <div>
                    <h2 className="text-xl font-extrabold">
                      {details.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">{details.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
                  <Meta label="Staff ID" value={details.id} />
                  <Meta label="User Code" value={details.userCode} />
                  <Meta
                    label="Phone"
                    value={details.phoneNumber ?? '—'}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Assigned roles
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {details.roles.map(r => (
                      <span
                        key={r}
                        className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-12">Staff not found</p>
            )}
          </div>
        </div>
      )}

      {open && (
        <CreateStaffModal
          onClose={() => setOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">
        {value}
      </p>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-lg bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
      {initials}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded col-span-2" />
      </div>

      <div className="flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full" />
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}
