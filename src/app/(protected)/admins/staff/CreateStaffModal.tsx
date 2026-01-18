'use client';

import { useState } from 'react';
import { CreateStaffInput, StaffRole } from '@/shared/graphql/generated/graphql';

interface Props {
  onClose: () => void;
  onCreate: (data: CreateStaffInput) => Promise<void>;
}

export default function CreateStaffModal({ onClose, onCreate }: Props) {
  const [form, setForm] = useState<CreateStaffInput>({
    fullName: '',
    email: '',
    roles: [],
    phoneNumber: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function update<K extends keyof CreateStaffInput>(
    key: K,
    value: CreateStaffInput[K]
  ) {
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
    form.roles.length > 0 &&
    !loading;

  async function handleSubmit() {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await onCreate(form);
      setSuccess('Staff created successfully');
      setTimeout(onClose, 800);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Create Staff</h2>
            <p className="text-sm text-slate-500">
              Add a new staff member and assign roles
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            ✕
          </button>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl bg-green-50 text-green-700 px-4 py-3 text-sm">
            {success}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name" value={form.fullName} onChange={v => update('fullName', v)} />
          <Field label="Email Address" type="email" value={form.email} onChange={v => update('email', v)} />
          <Field
            label="Phone Number"
            value={form.phoneNumber ?? ''}
            onChange={v => update('phoneNumber', v || undefined)}
          />
        </div>

        <div className="space-y-2">
          <p className="font-medium text-slate-700">Assign Roles</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(StaffRole).map(role => {
              const active = form.roles.includes(role);
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => toggleRole(role)}
                  className={`px-4 py-2 rounded-full text-sm transition ${active
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="px-6 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40"
          >
            {loading ? 'Creating…' : 'Create Staff'}
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
        autoComplete="off"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-4 focus:ring-indigo-500/10"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
}
