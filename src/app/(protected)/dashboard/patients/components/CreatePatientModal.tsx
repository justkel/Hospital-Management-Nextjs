'use client';

import { useState, useRef } from 'react';
import type { ReactNode } from 'react';
import {
    BloodGroup,
    CreatePatientInput,
} from '@/shared/graphql/generated/graphql';
import { X, User, Phone, Heart, Users, MapPin, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

export const NIGERIAN_STATES = [
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
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto sm:items-center">
            <div className="relative w-full max-w-5xl my-4 sm:my-8 overflow-hidden rounded-2xl !bg-white shadow-2xl flex flex-col max-h-[95vh]">
                <div className="sticky top-0 z-10 border-b !border-[#E8E6E0] !bg-white px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
                                <User size={18} className="!text-[#1D9E75]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                                    Register Patient
                                </h2>
                                <p className="mt-1 text-sm !text-[#767570]">
                                    Emergency cases allow partial registration
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B] disabled:opacity-40"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-5 hide-scrollbar" ref={contentRef}>
                    <div className="space-y-3">
                        {success && (
                            <div className="flex items-start gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3">
                                <CheckCircle size={18} className="mt-0.5 shrink-0 !text-[#1D9E75]" />
                                <span className="text-sm font-medium !text-[#1D9E75]">{success}</span>
                            </div>
                        )}

                        {warning && (
                            <div className="flex items-start gap-3 rounded-xl border !border-[#F5E3C0] !bg-[#FFF8EC] px-4 py-3">
                                <AlertTriangle size={18} className="mt-0.5 shrink-0 !text-[#B9770E]" />
                                <span className="text-sm font-medium !text-[#B9770E]">{warning}</span>
                            </div>
                        )}

                        {addressWarning && (
                            <div className="flex items-start gap-3 rounded-xl border !border-[#F5E3C0] !bg-[#FFF8EC] px-4 py-3">
                                <AlertTriangle size={18} className="mt-0.5 shrink-0 !text-[#B9770E]" />
                                <span className="text-sm font-medium !text-[#B9770E]">{addressWarning}</span>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3">
                                <AlertCircle size={18} className="mt-0.5 shrink-0 !text-[#DC2626]" />
                                <span className="text-sm font-medium !text-[#DC2626]">{error}</span>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg !bg-[#FFF8EC]">
                                    <AlertTriangle size={16} className="!text-[#B9770E]" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold !text-[#16211B]">Emergency Case</p>
                                    <p className="text-xs !text-[#767570]">Skip non-critical fields (Gender required)</p>
                                </div>
                            </div>

                            <label className="relative inline-flex cursor-pointer items-center shrink-0">
                                <input
                                    type="checkbox"
                                    checked={form.emergency}
                                    disabled={isLocked}
                                    onChange={e => update('emergency', e.target.checked)}
                                    className="peer sr-only"
                                />
                                <div className="h-7 w-12 rounded-full !bg-[#D3D1C7] transition-all duration-300 peer-checked:!bg-[#1D9E75] peer-disabled:opacity-40 peer-disabled:cursor-not-allowed">
                                    <div className="absolute left-1 top-1 h-5 w-5 rounded-full !bg-white transition-all duration-300 peer-checked:translate-x-5 shadow-sm"></div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <Section title="Identity" icon={<User size={16} />}>
                            <Input disabled={isLocked} label="Full Name" onChange={v => update('fullName', v)} />
                            <Input disabled={isLocked} label="Date of Birth" type="date" onChange={v => update('dateOfBirth', v)} />
                            <Select disabled={isLocked} label="Gender" options={['MALE', 'FEMALE']} onChange={v => update('gender', v as string)} />
                        </Section>

                        <Section title="Contact" icon={<Phone size={16} />}>
                            <Input disabled={isLocked} label="Phone Number" onChange={v => update('phoneNumber', v)} />
                            <Input disabled={isLocked} label="Secondary Phone" onChange={v => update('secondaryPhoneNumber', v)} />
                            <Input disabled={isLocked} label="Email" type="email" onChange={v => update('email', v)} />
                        </Section>

                        <Section title="Medical" icon={<Heart size={16} />}>
                            <Select disabled={isLocked} label="Blood Group" options={Object.values(BloodGroup)} onChange={v => update('bloodGroup', v as BloodGroup)} />
                            <Input disabled={isLocked} label="Allergies (comma separated)" onChange={v => update('allergies', v.split(',').map(s => s.trim()).filter(Boolean))} />
                        </Section>

                        <Section title="Next of Kin" icon={<Users size={16} />}>
                            <Input disabled={isLocked} label="Name" onChange={v => update('nextOfKinName', v)} />
                            <Input disabled={isLocked} label="Phone" onChange={v => update('nextOfKinPhone', v)} />
                        </Section>
                    </div>

                    <Section title="Address" icon={<MapPin size={16} />}>
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

                <div className="sticky bottom-0 z-10 border-t !border-[#E8E6E0] !bg-white px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                        >
                            Cancel
                        </button>

                        <button
                            disabled={hasErrors || isLocked}
                            onClick={submit}
                            className="h-10 w-full sm:w-auto rounded-xl !bg-[#0c1a12] px-6 text-xs font-semibold !text-white transition hover:!bg-[#16211B] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {success ? '✓ Created' : loading ? 'Creating...' : 'Create Patient'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                {icon && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg !bg-[#ECFBF5] !text-[#1D9E75]">
                        {icon}
                    </div>
                )}
                <h3 className="text-sm font-semibold !text-[#16211B]">{title}</h3>
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
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                {label}
            </label>
            <input
                type={type}
                defaultValue=""
                placeholder={type === 'date' ? 'DD/MM/YYYY' : ''}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 disabled:!bg-[#F7F7F5] disabled:cursor-not-allowed"
            />
        </div>
    );
}

export function Select({
    label,
    options,
    onChange,
    disabled,
}: {
    label: string;
    options: string[];
    onChange: (v: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                {label}
            </label>
            <select
                defaultValue=""
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 disabled:!bg-[#F7F7F5] disabled:cursor-not-allowed cursor-pointer"
            >
                <option value="">Select {label}</option>
                {options.map(o => (
                    <option key={o} value={o}>
                        {o}
                    </option>
                ))}
            </select>
        </div>
    );
}
