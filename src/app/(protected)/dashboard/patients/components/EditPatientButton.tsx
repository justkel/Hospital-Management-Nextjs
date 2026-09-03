'use client';

import { useState, useRef } from 'react';
import { Pencil, X, User, Phone, Heart, Users, MapPin, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/clientFetch';
import {
    BloodGroup,
    UpdatePatientInput,
} from '@/shared/graphql/generated/graphql';
import { NIGERIAN_STATES } from './CreatePatientModal';

interface Props {
    patient: {
        id: string;
        phoneNumber?: string | null;
        email?: string | null;
        dateOfBirth?: string | null;
        nextOfKinName?: string | null;
        nextOfKinPhone?: string | null;
        bloodGroup?: string | null;
        extraDetails?: string | null;
        allergies?: string[] | null;
        address?: {
            addressLine1?: string | null;
            city?: string | null;
            state?: string | null;
            country?: string | null;
        } | null;
    };
}

export default function EditPatientButton({ patient }: Props) {
    const router = useRouter();
    const contentRef = useRef<HTMLDivElement>(null);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [warning, setWarning] = useState<string | null>(null);
    const [addressWarning, setAddressWarning] = useState<string | null>(null);

    const [form, setForm] = useState<{
        phoneNumber: string;
        email: string;
        dateOfBirth: string;
        nextOfKinName: string;
        nextOfKinPhone: string;
        bloodGroup?: BloodGroup | null;
        extraDetails: string;
        allergies: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
    }>({
        phoneNumber: patient.phoneNumber ?? '',
        email: patient.email ?? '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        nextOfKinName: patient.nextOfKinName ?? '',
        nextOfKinPhone: patient.nextOfKinPhone ?? '',
        bloodGroup: patient.bloodGroup as BloodGroup | null | undefined,
        extraDetails: patient.extraDetails ?? '',
        allergies: patient.allergies?.join(', ') ?? '',
        addressLine1: patient.address?.addressLine1 ?? '',
        city: patient.address?.city ?? '',
        state: patient.address?.state ?? '',
        country: patient.address?.country ?? 'NIGERIA',
    });

    const openModal = () => {
        setError(null);
        setWarning(null);
        setSuccess(null);
        setAddressWarning(null);
        setOpen(true);
    };

    const closeModal = () => {
        setError(null);
        setWarning(null);
        setSuccess(null);
        setAddressWarning(null);
        setOpen(false);
    };

    const handleChange = <K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) => {
        if (loading || success) return;
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        if (loading || success) return;

        contentRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        setError(null);
        setWarning(null);
        setSuccess(null);
        setAddressWarning(null);

        setLoading(true);

        const isAddressComplete =
            form.addressLine1?.trim() &&
            form.city?.trim() &&
            form.state?.trim() &&
            form.country?.trim();

        const isAddressPartiallyFilled =
            form.addressLine1?.trim() ||
            form.city?.trim() ||
            form.state?.trim() ||
            form.country?.trim();

        const payload: UpdatePatientInput = {
            id: patient.id,
            phoneNumber: form.phoneNumber || undefined,
            email: form.email || undefined,
            dateOfBirth: form.dateOfBirth || undefined,
            nextOfKinName: form.nextOfKinName || undefined,
            nextOfKinPhone: form.nextOfKinPhone || undefined,
            bloodGroup: form.bloodGroup || undefined,
            extraDetails: form.extraDetails || undefined,
            allergies: form.allergies
                ? form.allergies.split(',').map(a => a.trim()).filter(Boolean)
                : undefined,
            addresses: isAddressComplete
                ? [
                    {
                        addressLine1: form.addressLine1.trim(),
                        city: form.city.trim(),
                        state: form.state.trim(),
                        country: form.country.trim(),
                    },
                ]
                : undefined,
        };

        if (!isAddressComplete && isAddressPartiallyFilled) {
            setAddressWarning('Incomplete address detected — it will be ignored.');
        }

        try {
            const res = await clientFetch('/api/patients/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to update patient');
            }

            setSuccess('Patient updated successfully');

            setTimeout(() => {
                closeModal();
                router.refresh();
            }, 2500);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const isLocked = loading || !!success;

    return (
        <>
            <button
                onClick={openModal}
                className="p-2 rounded-xl !text-white hover:bg-green-700 transition cursor-pointer"
            >
                <Pencil size={18} />
            </button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto sm:items-center">
                    <div className="relative w-full max-w-5xl my-10 sm:my-14 md:my-18 lg:my-20 overflow-hidden rounded-2xl !bg-white shadow-2xl flex flex-col max-h-[85vh]">
                        <div className="sticky top-0 z-10 border-b !border-[#E8E6E0] !bg-white px-5 py-4 sm:px-6 sm:py-5 shrink-0">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
                                        <User size={18} className="!text-[#1D9E75]" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                                            Edit Patient
                                        </h2>
                                        <p className="mt-1 text-sm !text-[#767570]">
                                            Update patient information
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B] disabled:opacity-40"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div 
                            className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-5 hide-scrollbar"
                            ref={contentRef}
                        >
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

                            <div className="grid gap-5 sm:grid-cols-2">
                                <Section title="Contact" icon={<Phone size={16} />}>
                                    <Input
                                        label="Phone Number"
                                        value={form.phoneNumber}
                                        disabled={isLocked}
                                        onChange={v => handleChange('phoneNumber', v)}
                                    />
                                    <Input
                                        label="Email"
                                        value={form.email}
                                        type="email"
                                        disabled={isLocked}
                                        onChange={v => handleChange('email', v)}
                                    />
                                    <Input
                                        label="Date of Birth"
                                        value={form.dateOfBirth}
                                        type="date"
                                        disabled={isLocked}
                                        onChange={v => handleChange('dateOfBirth', v)}
                                    />
                                </Section>

                                <Section title="Next of Kin" icon={<Users size={16} />}>
                                    <Input
                                        label="Name"
                                        value={form.nextOfKinName}
                                        disabled={isLocked}
                                        onChange={v => handleChange('nextOfKinName', v)}
                                    />
                                    <Input
                                        label="Phone"
                                        value={form.nextOfKinPhone}
                                        disabled={isLocked}
                                        onChange={v => handleChange('nextOfKinPhone', v)}
                                    />
                                </Section>

                                <Section title="Medical" icon={<Heart size={16} />}>
                                    <Select
                                        label="Blood Group"
                                        value={form.bloodGroup || ''}
                                        disabled={isLocked}
                                        options={Object.values(BloodGroup)}
                                        onChange={v => handleChange('bloodGroup', v as BloodGroup)}
                                    />
                                    <Input
                                        label="Allergies (comma separated)"
                                        value={form.allergies}
                                        disabled={isLocked}
                                        onChange={v => handleChange('allergies', v)}
                                    />
                                </Section>

                                <Section title="Address" icon={<MapPin size={16} />}>
                                    <Input
                                        label="Address Line"
                                        value={form.addressLine1}
                                        disabled={isLocked}
                                        onChange={v => handleChange('addressLine1', v)}
                                    />
                                    <Input
                                        label="City"
                                        value={form.city}
                                        disabled={isLocked}
                                        onChange={v => handleChange('city', v)}
                                    />
                                    <Select
                                        label="Country"
                                        value={form.country}
                                        disabled={isLocked}
                                        options={['NIGERIA']}
                                        onChange={v => handleChange('country', v)}
                                    />
                                    <Select
                                        label="State"
                                        value={form.state}
                                        disabled={isLocked}
                                        options={NIGERIAN_STATES}
                                        onChange={v => handleChange('state', v)}
                                    />
                                </Section>
                            </div>

                            <div className="space-y-3 pb-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg !bg-[#ECFBF5] !text-[#1D9E75]">
                                        <AlertCircle size={16} />
                                    </div>
                                    <h3 className="text-sm font-semibold !text-[#16211B]">Additional Information</h3>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                        Extra Details
                                    </label>
                                    <textarea
                                        value={form.extraDetails}
                                        disabled={isLocked}
                                        onChange={e => handleChange('extraDetails', e.target.value)}
                                        className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 disabled:!bg-[#F7F7F5] disabled:cursor-not-allowed resize-y"
                                        rows={4}
                                        placeholder="Any additional information..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 z-10 border-t !border-[#E8E6E0] !bg-white px-5 py-4 sm:px-6 sm:py-5 shrink-0">
                            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    onClick={closeModal}
                                    disabled={loading}
                                    className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                                >
                                    Cancel
                                </button>

                                <button
                                    disabled={isLocked}
                                    onClick={handleSubmit}
                                    className="h-10 w-full sm:w-auto rounded-xl !bg-[#0c1a12] px-6 text-xs font-semibold !text-white transition hover:!bg-[#16211B] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {success ? '✓ Updated' : loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
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
    value,
    onChange,
    disabled,
}: {
    label: string;
    type?: string;
    value: string;
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
                value={value}
                placeholder={type === 'date' ? 'DD/MM/YYYY' : ''}
                disabled={disabled}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 disabled:!bg-[#F7F7F5] disabled:cursor-not-allowed"
            />
        </div>
    );
}

function Select({
    label,
    options,
    value,
    onChange,
    disabled,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                {label}
            </label>
            <select
                value={value}
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