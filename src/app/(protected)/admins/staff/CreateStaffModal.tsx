'use client';

import { useState } from 'react';
import { CreateStaffInput, StaffRole } from '@/shared/graphql/generated/graphql';

interface Props {
  onClose: () => void;
  onCreate: (data: CreateStaffInput) => void;
}

export default function CreateStaffModal({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<CreateStaffInput>({
    fullName: '',
    email: '',
    password: '',
    roles: [],
    phoneNumber: undefined,
  });

  function update<K extends keyof CreateStaffInput>(key: K, value: CreateStaffInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleRole(role: StaffRole) {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  }

  const canSubmit =
    form.fullName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.roles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-6 animate-in fade-in zoom-in">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Staff</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <Input label="Full Name" value={form.fullName} onChange={(v) => update('fullName', v)} />
          <Input label="Email Address" type="email" value={form.email} onChange={(v) => update('email', v)} />
          <Input label="Password" type="password" value={form.password} onChange={(v) => update('password', v)} />
          <Input label="Phone Number (optional)" value={form.phoneNumber ?? ''} onChange={(v) => update('phoneNumber', v || undefined)} />

          <div className="space-y-2">
            <p className="text-sm font-medium">Roles</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(StaffRole).map((role) => {
                const active = form.roles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1 rounded-full text-sm border transition ${
                      active ? 'bg-black text-white border-black' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm hover:bg-gray-100">
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onCreate(form)}
            className="px-5 py-2 rounded-lg bg-black text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          >
            Create Staff
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, type = 'text', onChange }: { label: string; value: string; type?: string; onChange: (value: string) => void; }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-black/20"
      />
    </div>
  );
}
