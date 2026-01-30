/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
    BloodGroup,
    CreatePatientInput,
} from '@/shared/graphql/generated/graphql';

type ValidationErrors = Partial<Record<keyof CreatePatientInput, string>>;

export default function CreatePatientModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (data: CreatePatientInput) => Promise<void>;
}) {
    const [form, setForm] = useState<CreatePatientInput>({
        gender: '',
        emergency: false,
        allergies: [],
        addresses: [],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function update<K extends keyof CreatePatientInput>(
        key: K,
        value: CreatePatientInput[K]
    ) {
        setForm(prev => ({ ...prev, [key]: value }));
    }

    function validate(form: CreatePatientInput): ValidationErrors {
        const errors: ValidationErrors = {};

        if (!form.gender) errors.gender = 'Gender is required';

        if (!form.emergency) {
            if (!form.fullName?.trim())
                errors.fullName = 'Full name is required';

            if (!form.dateOfBirth)
                errors.dateOfBirth = 'Date of birth is required';

            if (!form.phoneNumber)
                errors.phoneNumber = 'Phone number is required';

            if (!form.email)
                errors.email = 'Email is required';

            if (!form.bloodGroup)
                errors.bloodGroup = 'Blood group is required';

            if (!form.allergies || form.allergies.length === 0)
                errors.allergies = 'Specify allergies (use "None" if applicable)';

            if (!form.nextOfKinName)
                errors.nextOfKinName = 'Next of kin name is required';

            if (!form.nextOfKinPhone)
                errors.nextOfKinPhone = 'Next of kin phone is required';

            if (!form.addresses || form.addresses.length === 0) {
                errors.addresses = 'At least one address is required';
            } else {
                const a = form.addresses[0];
                if (!a.addressLine1 || !a.city || !a.state || !a.country) {
                    errors.addresses = 'Address must be complete';
                }
            }
        }

        return errors;
    }

    async function submit() {
        setError(null);

        const errors = validate(form);
        if (Object.keys(errors).length > 0) {
            setError(Object.values(errors)[0]!);
            return;
        }

        setLoading(true);
        try {
            await onCreate(form);
            onClose();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    const hasErrors = Object.keys(validate(form)).length > 0;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col">

                <div className="sticky top-0 z-10 bg-white border-b px-6 py-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Register Patient
                        </h2>
                        <p className="text-sm text-gray-500">
                            Emergency cases allow partial registration
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl px-3 py-2 text-gray-500 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                    {error && (
                        <div className="rounded-2xl bg-red-50 text-red-700 px-4 py-3">
                            {error}
                        </div>
                    )}
                    <div className="flex items-center justify-between rounded-2xl border p-4 bg-gray-50">
                        <div>
                            <p className="font-medium text-gray-900">Emergency Case</p>
                            <p className="text-sm text-gray-500">
                                Skip non-critical fields ( Please select Gender )
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={form.emergency}
                            onChange={e => update('emergency', e.target.checked)}
                            className="h-5 w-5 accent-emerald-600"
                        />
                    </div>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Identity</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Full Name" onChange={v => update('fullName', v)} />
                            <Input label="Date of Birth" type="date" onChange={v => update('dateOfBirth', v)} />
                            <Select
                                label="Gender"
                                options={['MALE', 'FEMALE']}
                                onChange={v => update('gender', v as 'MALE' | 'FEMALE')}
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Phone Number" onChange={v => update('phoneNumber', v)} />
                            <Input label="Secondary Phone" onChange={v => update('secondaryPhoneNumber', v)} />
                            <Input label="Email" type="email" onChange={v => update('email', v)} />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Medical</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Select
                                label="Blood Group"
                                options={Object.values(BloodGroup)}
                                onChange={v => update('bloodGroup', v as BloodGroup)}
                            />
                            <Input
                                label="Allergies (comma separated)"
                                onChange={v =>
                                    update(
                                        'allergies',
                                        v.split(',').map(s => s.trim()).filter(Boolean)
                                    )
                                }
                            />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Next of Kin</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input label="Name" onChange={v => update('nextOfKinName', v)} />
                            <Input label="Phone" onChange={v => update('nextOfKinPhone', v)} />
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input
                                label="Address Line"
                                onChange={v =>
                                    update('addresses', [{ ...(form.addresses?.[0] ?? {}), addressLine1: v } as any])
                                }
                            />
                            <Input
                                label="City"
                                onChange={v =>
                                    update('addresses', [{ ...(form.addresses?.[0] ?? {}), city: v } as any])
                                }
                            />
                            <Input
                                label="State"
                                onChange={v =>
                                    update('addresses', [{ ...(form.addresses?.[0] ?? {}), state: v } as any])
                                }
                            />
                            <Input
                                label="Country"
                                onChange={v =>
                                    update('addresses', [{ ...(form.addresses?.[0] ?? {}), country: v } as any])
                                }
                            />
                        </div>
                    </section>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={hasErrors || loading}
                        onClick={submit}
                        className="px-6 py-2 rounded-xl bg-green-400 text-white disabled:opacity-40"
                    >
                        {loading ? 'Creating…' : 'Create Patient'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Input({
    label,
    type = 'text',
    onChange,
}: {
    label: string;
    type?: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                type={type}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 focus:ring-4 focus:ring-emerald-500/20"
                autoComplete="off"
            />
        </div>
    );
}

function Select({
    label,
    options,
    onChange,
}: {
    label: string;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <select
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 bg-white focus:ring-4 focus:ring-emerald-500/20"
            >
                <option value="">Select</option>
                {options.map(o => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
