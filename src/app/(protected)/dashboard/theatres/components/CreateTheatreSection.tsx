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
    <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/70 via-transparent to-blue-50/40" />

      <div className="relative p-6 sm:p-8">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-xs font-semibold text-cyan-700 mb-4">
              <Building2 className="w-4 h-4" />
              New Operating Theatre
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Register Theatre
            </h2>

            <p className="text-slate-500 mt-2 max-w-2xl">
              Configure surgical theatre details, floor location,
              departmental assignment, and operational capacity.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-5 py-4">
            <p className="text-sm font-semibold text-cyan-700">
              Surgical Operations
            </p>

            <p className="text-xs text-cyan-600 mt-1">
              Optimized for multi-department coordination
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <Input
            label="Theatre Name"
            placeholder="e.g Main Surgical Theatre"
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
            label="Theatre Code"
            placeholder="e.g T-01"
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
            placeholder="e.g 2"
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
            placeholder="e.g 10"
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

          <div className="rounded-3xl border border-gray-200 bg-gray-50/60 p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">
                Active Theatre
              </p>

              <p className="text-sm text-slate-500">
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

          <div className="xl:col-span-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-14 w-full sm:w-auto px-8 rounded-2xl bg-cyan-600 hover:bg-cyan-700 !text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-cyan-200"
            >
              {loading
                ? 'Creating Theatre...'
                : 'Create Theatre'}
            </button>
          </div>
        </form>
      </div>
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
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
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
          className="w-full h-13 rounded-2xl border border-gray-200 bg-white pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-cyan-600 placeholder:text-gray-400"
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
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}
      </label>

      <select
        value={value}
        onChange={e =>
          onChange(e.target.value)
        }
        className="w-full h-13 rounded-2xl border border-gray-200 bg-white px-4 focus:outline-none focus:ring-2 focus:ring-cyan-600"
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