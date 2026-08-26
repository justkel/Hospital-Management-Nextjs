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
          background: '#FAFAF8',
        },
      }}
    >
      <div className="flex h-full flex-col">

        <div className="border-b !border-[#E8E6E0] !bg-white px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5] !text-[#1D9E75]">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight !text-[#16211B]">
                Update theatre
              </h2>
              <p className="mt-1 text-sm !text-[#767570]">
                Modify theatre details, capacity and operational availability.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">

          <div className="mb-6 grid grid-cols-3 gap-3">
            <MiniStatCard
              icon={<Activity className="h-4 w-4" />}
              label="Status"
              value={form.isActive ? 'Active' : 'Inactive'}
            />

            <MiniStatCard
              icon={<Layers3 className="h-4 w-4" />}
              label="Floor"
              value={form.floor || '—'}
            />

            <MiniStatCard
              icon={<Users className="h-4 w-4" />}
              label="Capacity"
              value={form.capacity || '—'}
            />
          </div>

          <div className="space-y-5">

            <Input
              label="Theatre name"
              placeholder="e.g. Main Surgical Theatre"
              value={form.name}
              onChange={v =>
                setForm(prev => ({
                  ...prev,
                  name: v,
                }))
              }
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Theatre code"
                placeholder="e.g. T-001"
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
                placeholder="e.g. 3"
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Capacity"
                type="number"
                placeholder="e.g. 6"
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
                    department: v as TheatreDepartment,
                  }))
                }
                options={Object.values(TheatreDepartment)}
              />
            </div>

            <div className="rounded-xl border !border-[#E8E6E0] !bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold !text-[#16211B]">
                    Theatre availability
                  </p>
                  <p className="mt-0.5 text-xs !text-[#767570]">
                    Enable or disable this theatre for operations and scheduling.
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

        <div className="border-t !border-[#E8E6E0] !bg-white p-4 sm:p-5">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <button
              onClick={onClose}
              className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white text-sm font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] sm:w-auto sm:flex-1"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:flex-1"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                  Updating…
                </>
              ) : (
                'Update theatre'
              )}
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
    <div className="rounded-xl border !border-[#E8E6E0] !bg-white p-3.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
            {label}
          </p>
          <p className="mt-1.5 truncate text-sm font-semibold !text-[#16211B]">
            {value}
          </p>
        </div>

        <div className="hidden min-[500px]:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg !bg-[#F7F7F5] !text-[#5F5E5A]">
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <input
        type={type}
        min={type === 'number' ? 0 : undefined}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
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
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
      >
        {options.map(item => (
          <option key={item} value={item}>
            {item.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );
}