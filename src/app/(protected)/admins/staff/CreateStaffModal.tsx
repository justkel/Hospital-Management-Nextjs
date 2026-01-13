'use client';

import { useState } from 'react';
import { CreateStaffInput, StaffRole } from '@/shared/graphql/generated/graphql';

interface Props {
  onClose: () => void;
  onCreate: (data: CreateStaffInput) => void;
}

export default function CreateStaffModal({ onClose, onCreate }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState<CreateStaffInput>({
    fullName: '',
    email: '',
    password: '',
    roles: [],
    phoneNumber: undefined,
  });

  function update<K extends keyof CreateStaffInput>(key: K, value: CreateStaffInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function toggleRole(role: StaffRole) {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  }

  const canSubmit =
    form.fullName.trim() &&
    form.email.trim() &&
    form.password.trim() &&
    form.roles.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
      <div className="w-full max-w-xl rounded-3xl bg-linear-to-br from-white to-slate-50 shadow-2xl p-6 sm:p-8 space-y-8 animate-in fade-in zoom-in">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create staff</h2>
            <p className="text-sm text-slate-500 mt-1">
              Add a new staff member and assign roles
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field
            label="Full name"
            value={form.fullName}
            onChange={v => update('fullName', v)}
          />

          <Field
            label="Email address"
            type="email"
            value={form.email}
            onChange={v => update('email', v)}
          />

          <div className="sm:col-span-2 space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <Field
            label="Phone number (optional)"
            value={form.phoneNumber ?? ''}
            onChange={v => update('phoneNumber', v || undefined)}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">Assign roles</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(StaffRole).map(role => {
              const active = form.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.02]'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
          >
            Cancel
          </button>

          <button
            disabled={!canSubmit}
            onClick={() => onCreate(form)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create staff
          </button>
        </div>
      </div>
    </div>
  );
}


function Field({
  label,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
      />
    </div>
  );
}
