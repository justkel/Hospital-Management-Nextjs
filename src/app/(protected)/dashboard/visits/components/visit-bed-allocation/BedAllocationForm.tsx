'use client';

import { useState } from 'react';
import { BedDouble, ReceiptText } from 'lucide-react';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';
import { useWardBedPicker } from './useWardBedPicker';
import WardBedPickerFields from './WardBedPickerFields';
import { formatCurrency } from './TransferBedAllocationDrawer';

interface Props {
    catalogs: ChargeCatalogOption[];
    submitting: boolean;
    onCreate: (payload: {
        bedId: string;
        chargeCatalogId: string;
        reason?: string;
    }) => Promise<void>;
}

export default function BedAllocationForm({
    catalogs,
    submitting,
    onCreate,
}: Props) {
    const picker = useWardBedPicker();
    const [chargeCatalogId, setChargeCatalogId] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);

    const noCatalogs = !catalogs || catalogs.length === 0;

    const handleSubmit = async () => {
        if (!picker.selectedWardId) {
            setError('Select a ward to continue.');
            return;
        }

        if (!picker.selectedBedId) {
            setError('Select an available bed.');
            return;
        }

        if (noCatalogs) {
            setError(
                'No billing catalogs are configured for bed allocation yet. Contact an administrator.'
            );
            return;
        }

        if (!chargeCatalogId) {
            setError('A charge type is required to allocate a bed.');
            return;
        }

        setError(null);

        await onCreate({
            bedId: picker.selectedBedId,
            chargeCatalogId,
            reason: reason.trim() || undefined,
        });

        picker.reset();
        setChargeCatalogId('');
        setReason('');
    };

    return (
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-teal-50 to-white px-6 py-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                    <BedDouble size={20} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">Allocate a bed</h3>
                    <p className="text-sm text-slate-500">
                        Find an available bed and assign it to this visit.
                    </p>
                </div>
            </div>

            <div className="space-y-5 p-6">
                <WardBedPickerFields
                    department={picker.department}
                    onDepartmentChange={picker.setDepartment}
                    wardClass={picker.wardClass}
                    onWardClassChange={picker.setWardClass}
                    wards={picker.wards}
                    loadingWards={picker.loadingWards}
                    selectedWardId={picker.selectedWardId}
                    onWardChange={picker.setSelectedWardId}
                    beds={picker.beds}
                    loadingBeds={picker.loadingBeds}
                    selectedBedId={picker.selectedBedId}
                    onBedChange={picker.setSelectedBedId}
                />

                <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                        <ReceiptText size={15} className="text-teal-600" />
                        Billing
                    </div>

                    <p className="text-xs leading-relaxed text-slate-500">
                        A charge type is required — options come from catalogs mapped to
                        the <span className="font-medium text-slate-700">Bed</span>{' '}
                        domain.
                    </p>

                    {noCatalogs && (
                        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                            No bed charge catalogs are configured yet. Contact an
                            administrator to set one up.
                        </div>
                    )}

                    <select
                        className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-400"
                        value={chargeCatalogId}
                        disabled={noCatalogs}
                        onChange={e => {
                            setChargeCatalogId(e.target.value);
                            if (error) setError(null);
                        }}
                    >
                        <option value="">Select charge type</option>
                        {catalogs?.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {`${cat.name} — ${formatCurrency(cat.unitPrice, cat.currency || 'NGN')}`}
                            </option>
                        ))}
                    </select>
                </div>

                <textarea
                    placeholder="Reason (optional)"
                    className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
                    value={reason}
                    onChange={e => {
                        setReason(e.target.value);
                        if (error) setError(null);
                    }}
                />

                {error && (
                    <p className="text-sm font-medium text-red-600">{error}</p>
                )}

                <button
                    disabled={submitting || noCatalogs}
                    onClick={handleSubmit}
                    className="w-full rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white! shadow-md shadow-teal-200 transition hover:bg-teal-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto cursor-pointer"
                >
                    {submitting ? 'Allocating…' : 'Allocate bed'}
                </button>
            </div>
        </div>
    );
}