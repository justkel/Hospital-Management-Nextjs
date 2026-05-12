'use client';

import { useState } from 'react';

import {
    WardClass,
    WardDepartment,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import { message } from 'antd';

interface Props {
    onCreated: () => void;
}

export default function CreateWardSection({
    onCreated,
}: Props) {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: '',
        code: '',
        floor: '',
        department: WardDepartment.General,
        wardClass: WardClass.Standard,
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await clientFetch('/api/ward/create', {
                method: 'POST',
                body: JSON.stringify({
                    name: form.name,
                    code: form.code || undefined,
                    floor: form.floor ? Number(form.floor) : undefined,
                    department: form.department,
                    wardClass: form.wardClass,
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                message.error(json.error || 'Failed to create ward');
                return;
            }

            message.success('Ward created successfully');

            setForm({
                name: '',
                code: '',
                floor: '',
                department: WardDepartment.General,
                wardClass: WardClass.Standard,
            });

            onCreated();
        } catch (error) {
            console.error(error);
            message.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Create Ward
                </h2>

                <p className="text-gray-500 mt-2">
                    Register and manage hospital wards across departments.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
            >
                <Input
                    label="Ward Name"
                    placeholder="e.g Male Surgical Ward"
                    value={form.name}
                    onChange={v => setForm(prev => ({ ...prev, name: v }))}
                    required
                />

                <Input
                    label="Ward Code"
                    placeholder="e.g MSW-01"
                    value={form.code}
                    onChange={v => setForm(prev => ({ ...prev, code: v }))}
                />

                <Input
                    label="Floor"
                    type="number"
                    placeholder="e.g 2"
                    value={form.floor}
                    onChange={v => setForm(prev => ({ ...prev, floor: v }))}
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

                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 !text-white font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Create Ward'}
                    </button>
                </div>
            </form>
        </section>
    );
}

interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: React.HTMLInputTypeAttribute;
    required?: boolean;
    placeholder?: string;
}

function Input({
    label,
    value,
    onChange,
    type = 'text',
    required,
    placeholder,
}: InputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
                {label}
            </label>

            <input
                type={type}
                required={required}
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-gray-400"
            />
        </div>
    );
}

interface SelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
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