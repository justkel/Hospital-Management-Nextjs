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
import { PencilIcon, XMarkIcon } from '@heroicons/react/24/solid';

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

  const filtered = roleFilter === 'ALL' ? list : list.filter(s => s.roles.includes(roleFilter));

  useEffect(() => {
    const run = async () => {
      if (!search.trim()) {
        setList(baseList);
        return;
      }
      const res = await fetch(`/api/staff/search?query=${encodeURIComponent(search)}`);
      const json = await res.json();
      setList(json.staff ?? []);
    };
    const t = setTimeout(run, 350);
    return () => clearTimeout(t);
  }, [search, baseList]);

  function openRoleModal(staff: StaffItem) {
    setEditingStaff(staff);
    setRolesToUpdate(staff.roles);
  }

  function toggleRole(role: StaffRole) {
    setRolesToUpdate(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  }

  async function handleUpdateRoles() {
    if (!editingStaff) return;
    setUpdatingRoles(true);

    const body: UpdateStaffRolesInput = {
      staffId: editingStaff.id,
      roles: rolesToUpdate,
    };

    const res = await fetch('/api/staff/update-roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const json = await res.json();

    if (json.staff) {
      setBaseList(prev => prev.map(s => (s.id === json.staff.id ? json.staff : s)));
      setList(prev => prev.map(s => (s.id === json.staff.id ? json.staff : s)));
      setEditingStaff(null);
    }

    setUpdatingRoles(false);
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

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(staff => (
          <div
            key={staff.id}
            className="relative bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl transition group"
          >
            {/* Edit icon */}
            <button
              onClick={() => openRoleModal(staff)}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition"
            >
              <PencilIcon className="h-5 w-5" />
            </button>

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

      {/* Role Update Modal */}
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
