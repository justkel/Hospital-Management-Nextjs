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
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff across your organization</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
        >
          + New Staff
        </button>
      </div>

      <div className="flex gap-2">
        {(['ALL', ...Object.values(StaffRole)] as const).map(r => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1 rounded-full text-sm ${roleFilter === r ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filtered.map(staff => (
          <div key={staff.id} className="flex items-center justify-between rounded-xl border p-4 hover:shadow-sm transition">
            <div>
              <p className="font-medium">{staff.fullName}</p>
              <p className="text-sm text-muted-foreground">{staff.email}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {staff.roles.map(r => (
                <span key={r} className="px-2 py-1 rounded-md bg-gray-100 text-xs">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {open && <CreateStaffModal onClose={() => setOpen(false)} onCreate={handleCreate} />}
    </div>
  );
}
