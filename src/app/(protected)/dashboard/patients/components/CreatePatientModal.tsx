'use client';

import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
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

type AddressInput = NonNullable<CreatePatientInput['addresses']>[number];

export default function CreatePatientModal({
    onClose,
    onCreate,
}: {
    onClose: () => void;
    onCreate: (
        data: CreatePatientInput
    ) => Promise<{ warning?: string; matches?: unknown[] }>;
}) {
    const [form, setForm] = useState<CreatePatientInput>({
        gender: '',
        emergency: false,
        allergies: [],
        addresses: undefined,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [addressWarning, setAddressWarning] = useState<string | null>(null);

    const contentRef = useRef<HTMLDivElement>(null);

    const isLocked = loading || !!success;

    function update<K extends keyof CreatePatientInput>(
        key: K,
        value: CreatePatientInput[K]
    ) {
        if (isLocked) return;
        setForm(prev => ({ ...prev, [key]: value }));
    }

    function updateAddress(partial: Partial<AddressInput>) {
        if (isLocked) return;
        setForm(prev => ({
            ...prev,
            addresses: [
                { ...(prev.addresses?.[0] ?? {}), ...partial } as AddressInput,
            ],
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
            if (!a?.addressLine1 || !a?.city || !a?.state || !a?.country) {
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
        setAddressWarning(null);

        const errors = validate(form);
        if (Object.keys(errors).length > 0) {
            setError(Object.values(errors)[0]!);
            return;
        }

        setLoading(true);

        try {
            const address = form.addresses?.[0];

            const isAddressComplete =
                address?.addressLine1 &&
                address?.city &&
                address?.state &&
                address?.country;

            const isAddressPartiallyFilled =
                address?.addressLine1 ||
                address?.city ||
                address?.state ||
                address?.country;

            const payload: CreatePatientInput = {
                ...form,
                addresses: isAddressComplete
                    ? form.addresses
                    : undefined,
            };

            const result = await onCreate(payload);

            setSuccess('Patient created successfully');

            if (!isAddressComplete && isAddressPartiallyFilled) {
                setAddressWarning('Incomplete address detected — it was ignored.');
            }

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-slate-900/70 via-purple-900/50 to-slate-900/70 backdrop-blur-md">
            <div className="relative w-full max-w-6xl max-h-[95vh] overflow-hidden rounded-3xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400" />

                <div className="relative bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 !text-white shadow-lg shadow-emerald-200">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Register Patient
                            </h2>
                            <p className="text-sm text-slate-500">
                                Emergency cases allow partial registration
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="group rounded-full p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-all duration-200"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" ref={contentRef}>
                    <div className="space-y-3">
                        {success && (
                            <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3.5 text-emerald-800">
                                <svg className="h-5 w-5 flex-shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{success}</span>
                            </div>
                        )}

                        {warning && (
                            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3.5 text-amber-800">
                                <svg className="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="font-medium">⚠️ {warning}</span>
                            </div>
                        )}

                        {addressWarning && (
                            <div className="flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3.5 text-amber-800">
                                <svg className="h-5 w-5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{addressWarning}</span>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-200 px-4 py-3.5 text-red-800">
                                <svg className="h-5 w-5 flex-shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/80 p-5 transition-all hover:border-emerald-300 hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 !text-white shadow-lg shadow-amber-200">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">Emergency Case</p>
                                    <p className="text-sm text-slate-500">
                                        Skip non-critical fields (Gender required)
                                    </p>
                                </div>
                            </div>

                            <label className="relative inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={form.emergency}
                                    disabled={isLocked}
                                    onChange={e => update('emergency', e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="h-7 w-12 rounded-full bg-slate-300 transition-all duration-300 peer-checked:bg-emerald-500 peer-disabled:opacity-40 peer-disabled:cursor-not-allowed">
                                    <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-all duration-300 peer-checked:translate-x-5 shadow-md"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <Section title="Identity" icon="person">
                            <Input disabled={isLocked} label="Full Name" onChange={v => update('fullName', v)} />
                            <Input disabled={isLocked} label="Date of Birth" type="date" onChange={v => update('dateOfBirth', v)} />
                            <Select disabled={isLocked} label="Gender" options={['MALE', 'FEMALE']} onChange={v => update('gender', v as string)} />
                        </Section>

                        <Section title="Contact" icon="phone">
                            <Input disabled={isLocked} label="Phone Number" onChange={v => update('phoneNumber', v)} />
                            <Input disabled={isLocked} label="Secondary Phone" onChange={v => update('secondaryPhoneNumber', v)} />
                            <Input disabled={isLocked} label="Email" type="email" onChange={v => update('email', v)} />
                        </Section>

                        <Section title="Medical" icon="heart">
                            <Select disabled={isLocked} label="Blood Group" options={Object.values(BloodGroup)} onChange={v => update('bloodGroup', v as BloodGroup)} />
                            <Input disabled={isLocked} label="Allergies (comma separated)" onChange={v => update('allergies', v.split(',').map(s => s.trim()).filter(Boolean))} />
                        </Section>

                        <Section title="Next of Kin" icon="users">
                            <Input disabled={isLocked} label="Name" onChange={v => update('nextOfKinName', v)} />
                            <Input disabled={isLocked} label="Phone" onChange={v => update('nextOfKinPhone', v)} />
                        </Section>
                    </div>

                    <Section title="Address" icon="location">
                        <Input disabled={isLocked} label="Address Line" onChange={v => updateAddress({ addressLine1: v })} />
                        <Input disabled={isLocked} label="City" onChange={v => updateAddress({ city: v })} />
                        <Select
                            label="Country"
                            disabled={isLocked}
                            options={['NIGERIA']}
                            onChange={v => updateAddress({ country: v })}
                        />
                        <Select
                            label="State"
                            disabled={isLocked}
                            options={NIGERIAN_STATES}
                            onChange={v => updateAddress({ state: v })}
                        />
                    </Section>
                </div>

                <div className="relative bg-gradient-to-r from-slate-50 to-white border-t border-slate-200/60 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40 transition-all duration-200 font-medium order-2 sm:order-1"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={hasErrors || isLocked}
                        onClick={submit}
                        className="relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 !text-white font-medium shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 transition-all duration-200 order-1 sm:order-2"
                    >
                        <span className="relative z-10">
                            {success ? '✓ Created' : loading ? 'Creating...' : 'Create Patient'}
                        </span>
                        {!success && !loading && (
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 hover:opacity-100 transition-opacity duration-200" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon?: string; children: ReactNode }) {
    const icons = {
        person: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
        ),
        phone: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        heart: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        users: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        location: (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2.5">
                {icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-600">
                        {icons[icon as keyof typeof icons] || null}
                    </div>
                )}
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">{children}</div>
        </div>
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
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                type={type}
                value={undefined}
                defaultValue=""
                placeholder={type === 'date' ? 'DD/MM/YYYY' : ''}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed"
            />
        </div>
    );
}

export function Select({
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
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
                {label}
            </label>
            <select
                value={value}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all duration-200 disabled:bg-slate-50 disabled:cursor-not-allowed"
            >
                {!value && <option value="">Select {label}</option>}
                {options.map(o => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
