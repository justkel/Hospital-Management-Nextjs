'use client';

import { Drawer, Switch, message } from 'antd';
import { useEffect, useState } from 'react';

import {
  GetWardsQuery,
  WardClass,
  WardDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type WardItem =
  GetWardsQuery['wards']['items'][number];

interface Props {
  ward: WardItem | null;
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

export default function UpdateWardDrawer({
  ward,
  open,
  onClose,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    code: '',
    floor: '',
    department: WardDepartment.General,
    wardClass: WardClass.Standard,
    isActive: true,
  });

  useEffect(() => {
    if (!ward) return;

    setForm({
      name: ward.name,
      code: ward.code || '',
      floor: ward.floor?.toString() || '',
      department:
        ward.department || WardDepartment.General,
      wardClass:
        ward.wardClass || WardClass.Standard,
      isActive: ward.isActive,
    });
  }, [ward]);

  async function handleSubmit() {
    if (!ward) return;

    try {
      setLoading(true);

      const res = await clientFetch('/api/ward/update', {
        method: 'POST',
        body: JSON.stringify({
          wardId: ward.id,

          name: form.name,
          code: form.code || undefined,

          floor: form.floor
            ? Number(form.floor)
            : undefined,

          department: form.department,

          wardClass: form.wardClass,

          isActive: form.isActive,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error || 'Failed to update ward'
        );
        return;
      }

      message.success('Ward updated successfully');

      onUpdated();
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={null}
      size="default"
      className="md:!max-w-[600px]"
      styles={{
        body: {
          padding: 0,
          background: '#FAFAF8',
        },
      }}
    >
      <div className="flex h-full flex-col">
        <div className="border-b !border-[#E8E6E0] !bg-white px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                  Update ward
                </h2>
                <p className="mt-1 text-sm !text-[#767570]">
                  Modify ward details and availability.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
            >
              <span className="text-lg">✕</span>
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 hide-scrollbar">
          <Input
            label="Ward Name"
            placeholder="e.g Male Surgical Ward"
            value={form.name}
            onChange={v =>
              setForm(prev => ({
                ...prev,
                name: v,
              }))
            }
          />

          <Input
            label="Ward Code"
            placeholder="e.g MSW-01"
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
            placeholder="e.g 2"
            value={form.floor}
            onChange={v =>
              setForm(prev => ({
                ...prev,
                floor: v,
              }))
            }
          />

          <Select
            label="Department"
            value={form.department}
            onChange={v =>
              setForm(prev => ({
                ...prev,
                department: v as WardDepartment,
              }))
            }
            options={Object.values(WardDepartment)}
          />

          <Select
            label="Ward Class"
            value={form.wardClass}
            onChange={v =>
              setForm(prev => ({
                ...prev,
                wardClass: v as WardClass,
              }))
            }
            options={Object.values(WardClass)}
          />

          <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-semibold !text-[#16211B]">
                  Ward Status
                </p>
                <p className="text-sm !text-[#767570]">
                  Enable or disable this ward
                </p>
              </div>

              <div className="flex shrink-0 items-center">
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
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="h-12 w-full rounded-xl !bg-[#0c1a12] font-semibold !text-white transition hover:!bg-[#16211B] disabled:opacity-50"
          >
            {loading
              ? 'Updating Ward...'
              : 'Update Ward'}
          </button>
        </div>
      </div>
    </Drawer>
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
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
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
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 cursor-pointer"
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