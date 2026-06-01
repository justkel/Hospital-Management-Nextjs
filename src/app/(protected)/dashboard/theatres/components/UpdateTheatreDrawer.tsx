'use client';

import { Drawer, Switch, message } from 'antd';
import { useEffect, useState } from 'react';

import {
  GetTheatresQuery,
  TheatreDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import {
  Activity,
  Building2,
  Layers3,
  Users,
} from 'lucide-react';

type TheatreItem =
  GetTheatresQuery['theatres']['items'][number];

interface Props {
  theatre: TheatreItem | null;
  open: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function UpdateTheatreDrawer({
  theatre,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    floor: '',
    capacity: '',
    department:
      TheatreDepartment.GeneralSurgery,
    isActive: true,
  });

  useEffect(() => {
    if (!theatre) return;

    setForm({
      name: theatre.name,
      code: theatre.code || '',
      floor:
        theatre.floor?.toString() || '',
      capacity:
        theatre.capacity?.toString() ||
        '',
      department:
        theatre.department ||
        TheatreDepartment.GeneralSurgery,
      isActive: theatre.isActive,
    });
  }, [theatre]);

  async function handleSubmit() {
    if (!theatre) return;

    try {
      setLoading(true);

      const res = await clientFetch(
        '/api/theatre/update',
        {
          method: 'POST',
          body: JSON.stringify({
            theatreId: theatre.id,

            name: form.name,

            code:
              form.code || undefined,

            floor: form.floor
              ? Number(form.floor)
              : undefined,

            capacity: form.capacity
              ? Number(form.capacity)
              : undefined,

            department:
              form.department,

            isActive:
              form.isActive,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error ||
          'Failed to update theatre'
        );

        return;
      }

      message.success(
        'Theatre updated successfully'
      );

      onUpdated();
      onClose();
    } catch (error) {
      console.error(error);

      message.error(
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={null}
      size={560}
      destroyOnHidden
      styles={{
        body: {
          padding: 0,
          background:
            'linear-gradient(to bottom, #f8fafc, #ffffff)',
        },
      }}
    >
      <div className="flex h-full flex-col">

        <div className="relative overflow-hidden border-b border-cyan-100 bg-gradient-to-r from-cyan-50 via-white to-blue-50 px-6 py-6">

          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-100/40 blur-3xl" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700 shadow-sm">
              <Building2 className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Update Theatre
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Modify theatre details,
                capacity and operational
                availability.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <div className="mb-6 grid grid-cols-3 gap-3">

            <MiniStatCard
              icon={
                <Activity className="h-4 w-4" />
              }
              label="Status"
              value={
                form.isActive
                  ? 'Active'
                  : 'Inactive'
              }
            />

            <MiniStatCard
              icon={
                <Layers3 className="h-4 w-4" />
              }
              label="Floor"
              value={
                form.floor || '—'
              }
            />

            <MiniStatCard
              icon={
                <Users className="h-4 w-4" />
              }
              label="Capacity"
              value={
                form.capacity || '—'
              }
            />
          </div>

          <div className="space-y-5">

            <Input
              label="Theatre Name"
              placeholder="e.g Main Surgical Theatre"
              value={form.name}
              onChange={v =>
                setForm(prev => ({
                  ...prev,
                  name: v,
                }))
              }
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <Input
                label="Theatre Code"
                placeholder="e.g T-001"
                value={form.code}
                onChange={v =>
                  setForm(prev => ({
                    ...prev,
                    code: v,
                  }))
                }
              />

              <Input
                label="Floor"
                type="number"
                placeholder="e.g 3"
                value={form.floor}
                onChange={v =>
                  setForm(prev => ({
                    ...prev,
                    floor: v
                      ? String(Math.max(0, Number(v)))
                      : '',
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              <Input
                label="Capacity"
                type="number"
                placeholder="e.g 6"
                value={form.capacity}
                onChange={v =>
                  setForm(prev => ({
                    ...prev,
                    capacity: v
                      ? String(Math.max(0, Number(v)))
                      : '',
                  }))
                }
              />

              <Select
                label="Department"
                value={form.department}
                onChange={v =>
                  setForm(prev => ({
                    ...prev,
                    department:
                      v as TheatreDepartment,
                  }))
                }
                options={Object.values(
                  TheatreDepartment
                )}
              />
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    Theatre Availability
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Enable or disable this
                    theatre for operations
                    and scheduling.
                  </p>
                </div>

                <Switch
                  checked={form.isActive}
                  onChange={checked =>
                    setForm(prev => ({
                      ...prev,
                      isActive: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white p-6">
          <div className="flex flex-col gap-3 sm:flex-row">

            <button
              onClick={onClose}
              className="h-12 flex-1 rounded-2xl border border-gray-200 bg-white font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 flex-1 rounded-2xl bg-cyan-600 font-semibold !text-white shadow-lg shadow-cyan-200 transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Updating Theatre...'
                : 'Update Theatre'}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

function MiniStatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-lg font-black text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: InputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        min={type === 'number' ? 0 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-600"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={e =>
          onChange(e.target.value)
        }
        className="h-12 w-full rounded-2xl border border-gray-200 bg-white px-4 text-slate-900 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-600"
      >
        {options.map(item => (
          <option
            key={item}
            value={item}
          >
            {item.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}