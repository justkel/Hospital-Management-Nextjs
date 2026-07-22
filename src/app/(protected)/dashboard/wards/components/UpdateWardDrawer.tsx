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
      size={520}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Update Ward
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Modify ward details and availability.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
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

          <div className="rounded-2xl border border-gray-200 p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                Ward Status
              </p>

              <p className="text-sm text-gray-500">
                Enable or disable this ward
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

        <div className="border-t border-gray-100 p-6 bg-white">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 !text-white font-semibold transition disabled:opacity-50"
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
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
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
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>

      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
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