'use client';

import { useState } from 'react';

import {
  CreateTheatreInput,
  TheatreDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import { message, Switch } from 'antd';

import {
  Building2,
  Hash,
  Layers3,
  Users,
} from 'lucide-react';

interface Props {
  onCreated: () => void;
}

export default function CreateTheatreSection({
  onCreated,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CreateTheatreInput>({
      name: '',
      code: '',
      floor: undefined,
      capacity: undefined,
      department:
        TheatreDepartment.GeneralSurgery,
      isActive: true,
    });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await clientFetch(
        '/api/theatre/create',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error ||
          'Failed to create theatre'
        );

        return;
      }

      message.success(
        'Theatre created successfully'
      );

      setForm({
        name: '',
        code: '',
        floor: undefined,
        capacity: undefined,
        department:
          TheatreDepartment.GeneralSurgery,
        isActive: true,
      });

      onCreated();
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
    <section className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white p-5 sm:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
          <Building2 size={17} className="!text-[#1D9E75]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
            Register theatre
          </h2>
          <p className="mt-1 text-sm !text-[#767570]">
            Configure surgical theatre details, floor location,
            departmental assignment, and operational capacity.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <Input
          label="Theatre name"
          placeholder="e.g. Main Surgical Theatre"
          value={form.name || ''}
          onChange={v =>
            setForm(prev => ({
              ...prev,
              name: v,
            }))
          }
          icon={<Building2 className="w-4 h-4" />}
          required
        />

        <Input
          label="Theatre code"
          placeholder="e.g. T-01"
          value={form.code || ''}
          onChange={v =>
            setForm(prev => ({
              ...prev,
              code: v,
            }))
          }
          icon={<Hash className="w-4 h-4" />}
        />

        <Input
          label="Floor"
          placeholder="e.g. 2"
          type="number"
          value={
            form.floor?.toString() || ''
          }
          onChange={v =>
            setForm(prev => ({
              ...prev,
              floor: v
                ? Math.max(0, Number(v))
                : undefined,
            }))
          }
          icon={<Layers3 className="w-4 h-4" />}
        />

        <Select
          label="Department"
          value={
            form.department ||
            TheatreDepartment.GeneralSurgery
          }
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

        <Input
          label="Capacity"
          placeholder="e.g. 10"
          type="number"
          value={
            form.capacity?.toString() ||
            ''
          }
          onChange={v =>
            setForm(prev => ({
              ...prev,
              capacity: v
                ? Math.max(0, Number(v))
                : undefined,
            }))
          }
          icon={<Users className="w-4 h-4" />}
        />

        <div className="flex items-center justify-between rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
          <div>
            <p className="text-sm font-semibold !text-[#16211B]">
              Active theatre
            </p>
            <p className="text-xs !text-[#767570]">
              Enable for scheduling
            </p>
          </div>

          <Switch
            checked={!!form.isActive}
            onChange={checked =>
              setForm(prev => ({
                ...prev,
                isActive: checked,
              }))
            }
          />
        </div>

        <div className="sm:col-span-2 xl:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-6 text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                Creating theatre…
              </>
            ) : (
              'Create theatre'
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 !text-[#B4B2A9]">
          {icon}
        </div>

        <input
          min={type === 'number' ? 0 : undefined}
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={e =>
            onChange(e.target.value)
          }
          className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white pl-10 pr-3.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <select
        value={value}
        onChange={e =>
          onChange(e.target.value)
        }
        className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
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