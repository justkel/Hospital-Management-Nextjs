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
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Meta, Avatar, DetailsSkeleton } from '@/components/DetailsParts';
import StaffCard from './components/StaffCard';
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
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Staff Management
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Manage and explore staff across your organization
          </p>
        </div>

        <button
          onClick={() => setOpenCreate(true)}
          className="px-6 py-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-[1.03] transition self-start"
        >
          + Add Staff
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center">
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
              className={`px-4 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filtered.map(staff => (
            <StaffCard
            key={staff.id}
            staff={staff}
            onView={openDetails}
            onEdit={openRoleModal}
            />
        ))}
      </div>

      {selectedId && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end sm:items-stretch items-end"
          onClick={closeDetails}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full sm:max-w-md h-[92vh] sm:h-full bg-white p-5 sm:p-8 rounded-t-3xl sm:rounded-none animate-drawer-in relative"
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
                    <h2 className="text-lg sm:text-xl font-extrabold">
                      {details.fullName}
                    </h2>
                    <p className="text-sm text-gray-500 break-all">
                      {details.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                  <Meta label="Staff ID" value={details.id} />
                  <Meta label="User Code" value={details.userCode} />
                  <Meta label="Phone" value={details.phoneNumber ?? '—'} />
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingStaff(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl animate-fade-in"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Update Roles</h2>
              <button onClick={() => setEditingStaff(null)}>
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <input
                value={editingStaff.fullName}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm"
              />
              <input
                value={editingStaff.email}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {Object.values(StaffRole).map(role => (
                <button
                  key={role}
                  onClick={() => toggleRole(role)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    rolesToUpdate.includes(role)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {roleError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
                {roleError}
              </p>
            )}

            <button
              onClick={handleUpdateRoles}
              disabled={updatingRoles}
              className="w-full py-2 rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {updatingRoles ? 'Updating…' : 'Save Roles'}
            </button>
          </div>
        </div>
      )}

      {openCreate && (
        <CreateStaffModal
          onClose={() => setOpenCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
