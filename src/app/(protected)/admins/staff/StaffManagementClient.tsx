'use client';

import { useEffect, useState } from 'react';
import {
  StaffRole,
  GetAllStaffQuery,
  CreateStaffInput,
  UpdateStaffRolesInput,
} from '@/shared/graphql/generated/graphql';
import CreateStaffModal from './CreateStaffModal';
import { ROLE_STYLES } from '@/shared/utils/enums/roles';
import { PencilIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/solid';
import { clientFetch } from '@/lib/clientFetch';

type StaffItem = GetAllStaffQuery['staffs'][number];

export default function StaffManagementClient({ staffs }: { staffs: StaffItem[] }) {
  const [list, setList] = useState<StaffItem[]>(staffs);
  const [baseList, setBaseList] = useState<StaffItem[]>(staffs);
  const [openCreate, setOpenCreate] = useState(false);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [rolesToUpdate, setRolesToUpdate] = useState<StaffRole[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [details, setDetails] = useState<StaffItem | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const filtered = roleFilter === 'ALL' ? list : list.filter(s => s.roles.includes(roleFilter));

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setList(baseList);
        return;
      }
      const res = await clientFetch(`/api/staff/search?query=${encodeURIComponent(search)}`);
      const json = await res.json();
      setList(json.staff ?? []);
    };
    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [search, baseList]);

  function openRoleModal(staff: StaffItem) {
    setEditingStaff(staff);
    setRolesToUpdate(staff.roles);
    setRoleError(null);
  }

  async function openDetails(id: string) {
    setSelectedId(id);
    setLoadingDetails(true);
    setDetails(null);

    const res = await clientFetch(`/api/staff/get-by-id?id=${id}`);
    const json = await res.json();

    setDetails(json.staff ?? null);
    setLoadingDetails(false);
  }

  function closeDetails() {
    setSelectedId(null);
    setDetails(null);
  }

  function toggleRole(role: StaffRole) {
    setRolesToUpdate(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  }

  async function handleUpdateRoles() {
    if (!editingStaff) return;
    setUpdatingRoles(true);
    setRoleError(null);

    const body: UpdateStaffRolesInput = {
        staffId: editingStaff.id,
        roles: rolesToUpdate,
    };

    const res = await clientFetch('/api/staff/update-roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok) {
        setRoleError(json.error ?? 'Something went wrong');
        setUpdatingRoles(false);
        return;
    }

    setBaseList(prev => prev.map(s => (s.id === json.staff.id ? json.staff : s)));
    setList(prev => prev.map(s => (s.id === json.staff.id ? json.staff : s)));
    setEditingStaff(null);
    setUpdatingRoles(false);
  }

  async function handleCreate(data: CreateStaffInput) {
    const res = await clientFetch('/api/staff/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    const json = await res.json();
    if (json.staff) {
      setBaseList(prev => [json.staff, ...prev]);
      setList(prev => [json.staff, ...prev]);
      setOpenCreate(false);
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage and explore staff across your organization</p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
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
            className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition group"
          >
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={() => openDetails(staff.id)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-indigo-600 hover:text-white transition"
                >
                <EyeIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => openRoleModal(staff)}
                className="p-1 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>

            <h2 className="text-lg font-semibold">{staff.fullName}</h2>
            <p className="text-gray-500 text-sm mt-1">{staff.email}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {staff.roles.map(r => {
                const style = ROLE_STYLES[r];
                return (
                  <span
                    key={r}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                  >
                    {r}
                  </span>
                );
              })}
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
            closeDetails();
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-md h-full bg-white p-6 sm:p-8 animate-drawer-in"
          >
            <button
              onClick={closeDetails}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>

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
                    {details.roles.map(r => {
                        const style = ROLE_STYLES[r];
                        return (
                        <span
                            key={r}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                        >
                            {r}
                        </span>
                        );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 mt-12">Staff not found</p>
            )}
          </div>
        </div>
      )}

      {editingStaff && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-center items-center"
          onClick={() => setEditingStaff(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl animate-fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Update Roles</h2>
              <button onClick={() => setEditingStaff(null)}>
                <XMarkIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm text-gray-500">Full Name</label>
                <input
                  value={editingStaff.fullName}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                <input
                  value={editingStaff.email}
                  disabled
                  className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <p className="text-sm font-semibold text-gray-700">Roles</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(StaffRole).map(role => {
                  const active = rolesToUpdate.includes(role);
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            {roleError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                {roleError}
                </p>
            )}

            <button
              onClick={handleUpdateRoles}
              disabled={updatingRoles}
              className="w-full py-2 rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingRoles ? 'Updating...' : 'Save Roles'}
            </button>
          </div>
        </div>
      )}

      {openCreate && (
        <CreateStaffModal onClose={() => setOpenCreate(false)} onCreate={handleCreate} />
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

