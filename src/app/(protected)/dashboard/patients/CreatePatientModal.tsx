/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import {
    BloodGroup,
    CreatePatientInput,
} from '@/shared/graphql/generated/graphql';

const NIGERIAN_STATES = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
    'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
    'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
    'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
    'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
    'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
    'FCT',
];

type ValidationErrors = Partial<Record<keyof CreatePatientInput, string>>;

export default function CreatePatientModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (
        data: CreatePatientInput
    ) => Promise<{ warning?: string; matches?: any[] }>;
}) {
    const [form, setForm] = useState<CreatePatientInput>({
        gender: '',
        emergency: false,
        allergies: [],
        addresses: [
            {
                country: 'NIGERIA',
            } as any,
        ],
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);

    const isLocked = loading || !!success;

    function update<K extends keyof CreatePatientInput>(
        key: K,
        value: CreatePatientInput[K]
    ) {
        if (isLocked) return;
        setForm(prev => ({ ...prev, [key]: value }));
    }

    function updateAddress(partial: any) {
        if (isLocked) return;
        setForm(prev => ({
            ...prev,
            addresses: [{ ...(prev.addresses?.[0] ?? {}), ...partial }],
        }));
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

            if (!form.nextOfKinName)
                errors.nextOfKinName = 'Next of kin name is required';

            if (!form.nextOfKinPhone)
                errors.nextOfKinPhone = 'Next of kin phone is required';

            const a = form.addresses?.[0];
            if (!a?.addressLine1 || !a.city || !a.state || !a.country) {
                errors.addresses = 'Address must be complete';
            }
        }

        return errors;
    }

    async function submit() {
        if (isLocked) return;

        contentRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setError(null);
        setSuccess(null);
        setWarning(null);

        const errors = validate(form);
        if (Object.keys(errors).length > 0) {
            setError(Object.values(errors)[0]!);
            return;
        }

        setLoading(true);
        try {
            const result = await onCreate(form);

            setSuccess('Patient created successfully');
            if (result?.warning) setWarning(result.warning);

            setTimeout(onClose, 4500);
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

                <div className="sticky top-0 bg-white border-b px-6 py-5 flex justify-between">
                    <div>
                        <h2 className="text-2xl font-semibold">Register Patient</h2>
                        <p className="text-sm text-gray-500">
                            Emergency cases allow partial registration
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl px-3 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8" ref={contentRef}>

                    {success && (
                        <div className="rounded-2xl bg-green-50 text-green-700 px-4 py-3">
                            {success}
                        </div>
                    )}

                    {warning && (
                        <div className="rounded-2xl bg-yellow-50 text-yellow-800 px-4 py-3">
                            ⚠️ {warning}
                        </div>
                    )}

                    {error && (
                        <div className="rounded-2xl bg-red-50 text-red-700 px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between rounded-2xl border p-4 bg-gray-50">
                        <div>
                            <p className="font-medium">Emergency Case</p>
                            <p className="text-sm text-gray-500">
                                Skip non-critical fields (Gender required)
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            checked={form.emergency}
                            disabled={isLocked}
                            onChange={e => update('emergency', e.target.checked)}
                            className="h-5 w-5 accent-emerald-600"
                        />
                    </div>

                    <Section title="Identity">
                        <Input disabled={isLocked} label="Full Name" onChange={v => update('fullName', v)} />
                        <Input disabled={isLocked} label="Date of Birth" type="date" onChange={v => update('dateOfBirth', v)} />
                        <Select disabled={isLocked} label="Gender" options={['MALE', 'FEMALE']} onChange={v => update('gender', v as any)} />
                    </Section>

                    <Section title="Contact">
                        <Input disabled={isLocked} label="Phone Number" onChange={v => update('phoneNumber', v)} />
                        <Input disabled={isLocked} label="Secondary Phone" onChange={v => update('secondaryPhoneNumber', v)} />
                        <Input disabled={isLocked} label="Email" type="email" onChange={v => update('email', v)} />
                    </Section>

                    <Section title="Medical">
                        <Select disabled={isLocked} label="Blood Group" options={Object.values(BloodGroup)} onChange={v => update('bloodGroup', v as BloodGroup)} />
                        <Input disabled={isLocked} label="Allergies (comma separated)" onChange={v => update('allergies', v.split(',').map(s => s.trim()).filter(Boolean))} />
                    </Section>

                    <Section title="Next of Kin">
                        <Input disabled={isLocked} label="Name" onChange={v => update('nextOfKinName', v)} />
                        <Input disabled={isLocked} label="Phone" onChange={v => update('nextOfKinPhone', v)} />
                    </Section>

                    <Section title="Address">
                        <Input disabled={isLocked} label="Address Line" onChange={v => updateAddress({ addressLine1: v })} />
                        <Input disabled={isLocked} label="City" onChange={v => updateAddress({ city: v })} />

                        <Select
                            label="Country"
                            disabled
                            options={['NIGERIA']}
                            value="NIGERIA"
                            onChange={() => { }}
                        />

                        <Select
                            label="State"
                            disabled={isLocked}
                            options={NIGERIAN_STATES}
                            onChange={v => updateAddress({ state: v })}
                        />
                    </Section>
                </div>

                <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={hasErrors || isLocked}
                        onClick={submit}
                        className="px-6 py-2 rounded-xl bg-green-500 text-white disabled:opacity-40 cursor-pointer"
                    >
                        {success ? 'Created ✓' : loading ? 'Creating…' : 'Create Patient'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: any }) {
    return (
        <section className="space-y-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="grid gap-4 sm:grid-cols-2">{children}</div>
        </section>
    );
}

function Input({
    label,
    type = 'text',
    onChange,
    disabled,
}: {
    label: string;
    type?: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <input
                type={type}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
        </div>
    );
}

function Select({
    label,
    options,
    onChange,
    disabled,
    value,
}: {
    label: string;
    options: string[];
    onChange: (v: string) => void;
    disabled?: boolean;
    value?: string;
}) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium">{label}</label>
            <select
                value={value}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 bg-white
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                {!value && <option value="">Select</option>}
                {options.map(o => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
