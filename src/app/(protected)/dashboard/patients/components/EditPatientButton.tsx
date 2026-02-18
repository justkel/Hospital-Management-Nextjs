'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/clientFetch';
import {
    BloodGroup,
    UpdatePatientInput,
} from '@/shared/graphql/generated/graphql';
import { Select } from '../CreatePatientModal';

interface Props {
    patient: {
        id: string;
        phoneNumber?: string | null;
        nextOfKinName?: string | null;
        nextOfKinPhone?: string | null;
        bloodGroup?: string | null;
        extraDetails?: string | null;
        allergies?: string[] | null;
    };
}

export default function EditPatientButton({ patient }: Props) {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warning, setWarning] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [form, setForm] = useState<{
        phoneNumber: string;
        nextOfKinName: string;
        nextOfKinPhone: string;
        bloodGroup?: BloodGroup;
        extraDetails: string;
        allergies: string;
        addressLine1: string;
        city: string;
        state: string;
        country: string;
    }>({
        phoneNumber: patient.phoneNumber ?? '',
        nextOfKinName: patient.nextOfKinName ?? '',
        nextOfKinPhone: patient.nextOfKinPhone ?? '',
        bloodGroup: patient.bloodGroup as BloodGroup | undefined,
        extraDetails: patient.extraDetails ?? '',
        allergies: patient.allergies?.join(', ') ?? '',
        addressLine1: '',
        city: '',
        state: '',
        country: '',
    });

    const openModal = () => {
        setWarning(null);
        setSuccess(null);
        setOpen(true);
    };

    const closeModal = () => {
        setWarning(null);
        setSuccess(null);
        setOpen(false);
    };

    const handleChange = <K extends keyof typeof form>(
        key: K,
        value: (typeof form)[K]
    ) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setWarning(null);
        setSuccess(null);

        const payload: UpdatePatientInput = {
            id: patient.id,
            phoneNumber: form.phoneNumber || undefined,
            nextOfKinName: form.nextOfKinName || undefined,
            nextOfKinPhone: form.nextOfKinPhone || undefined,
            bloodGroup: form.bloodGroup || undefined,
            extraDetails: form.extraDetails || undefined,
            allergies: form.allergies
                ? form.allergies.split(',').map(a => a.trim())
                : undefined,
        };

        const isAddressComplete =
            form.addressLine1 &&
            form.city &&
            form.state &&
            form.country;

        const isAddressPartiallyFilled =
            form.addressLine1 ||
            form.city ||
            form.state ||
            form.country;

        if (isAddressComplete) {
            payload.addresses = [
                {
                    addressLine1: form.addressLine1,
                    city: form.city,
                    state: form.state,
                    country: form.country,
                },
            ];
        }

        const res = await clientFetch('/api/patients/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setLoading(false);

        if (!res.ok) return;

        setSuccess('Patient updated successfully.');

        if (!isAddressComplete && isAddressPartiallyFilled) {
            setWarning('Incomplete address detected — it was ignored.');

            setTimeout(() => {
                closeModal();
                router.refresh();
            }, 4000);

            return;
        }

        setTimeout(() => {
            closeModal();
            router.refresh();
        }, 1500);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="p-2 rounded-xl hover:bg-gray-100 transition cursor-pointer"
            >
                <Pencil size={18} />
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-xl p-6 sm:p-8">

                        <h2 className="text-xl font-semibold mb-6">
                            Edit Patient
                        </h2>

                        {warning && (
                            <div className="mb-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 text-sm">
                                ⚠️ {warning}
                            </div>
                        )}

                        {success && (
                            <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 text-sm">
                                ✅ {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <Input label="Phone Number" value={form.phoneNumber}
                                onChange={v => handleChange('phoneNumber', v)} />

                            <Input label="Next of Kin Name" value={form.nextOfKinName}
                                onChange={v => handleChange('nextOfKinName', v)} />

                            <Input label="Next of Kin Phone" value={form.nextOfKinPhone}
                                onChange={v => handleChange('nextOfKinPhone', v)} />

                            <Select
                                label="Blood Group"
                                value={form.bloodGroup}
                                options={Object.values(BloodGroup)}
                                onChange={v => handleChange('bloodGroup', v as BloodGroup)}
                            />

                            <div className="sm:col-span-2">
                                <Input
                                    label="Allergies (comma separated)"
                                    value={form.allergies}
                                    onChange={v => handleChange('allergies', v)}
                                />
                            </div>
                        </div>

                        <h3 className="text-md font-semibold mt-8 mb-4 border-b pb-2">
                            Address
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Address Line"
                                value={form.addressLine1}
                                onChange={v => handleChange('addressLine1', v)} />

                            <Input label="City"
                                value={form.city}
                                onChange={v => handleChange('city', v)} />

                            <Input label="State"
                                value={form.state}
                                onChange={v => handleChange('state', v)} />

                            <Select
                                label="Country"
                                value={form.country}
                                options={['NIGERIA']}
                                onChange={v => handleChange('country', v)}
                            />

                            <div className="sm:col-span-2">
                                <label className="text-sm text-gray-600">
                                    Extra Details
                                </label>
                                <textarea
                                    value={form.extraDetails}
                                    onChange={e =>
                                        handleChange('extraDetails', e.target.value)
                                    }
                                    className="w-full border rounded-xl p-3 text-sm mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    rows={4}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition cursor-pointer disabled:opacity-70 text-white!"
                                style={{ color: '#ffffff' }}
                            >
                                {loading ? 'Wait' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Input({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <input
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm mt-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
        </div>
    );
}
