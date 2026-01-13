'use client';

import { useState } from 'react';
import { StaffRole, GetAllStaffQuery, CreateStaffInput } from '@/shared/graphql/generated/graphql';
import CreateStaffModal from './CreateStaffModal';

type StaffItem = GetAllStaffQuery['staffs'][number];

export default function StaffManagementClient({ staffs }: { staffs: StaffItem[] }) {
  const [list, setList] = useState<StaffItem[]>(staffs);
  const [open, setOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState<StaffRole | 'ALL'>('ALL');

  const filtered = roleFilter === 'ALL' ? list : list.filter(s => s.roles.includes(roleFilter));

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
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Staff Management</h1>
          <p className="text-gray-500 mt-1">Manage your staff across the organization</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium hover:scale-105 transition-transform"
        >
          + Add Staff
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['ALL', ...Object.values(StaffRole)] as const).map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-4 py-1 rounded-full text-sm font-medium transition ${
              roleFilter === r
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(staff => (
          <div
            key={staff.id}
            className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{staff.fullName}</h2>
              <p className="text-gray-500 text-sm mt-1">{staff.email}</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
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

      {open && <CreateStaffModal onClose={() => setOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}
