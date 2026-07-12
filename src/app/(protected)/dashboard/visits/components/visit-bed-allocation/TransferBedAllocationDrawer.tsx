'use client';

import { useState } from 'react';
import { Drawer } from 'antd';
import { ArrowRightLeft, ReceiptText } from 'lucide-react';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';
import { VisitBedAllocationStatus } from '@/shared/graphql/generated/graphql';
import { useWardBedPicker } from './useWardBedPicker';
import WardBedPickerFields from './WardBedPickerFields';
import { BedAllocationItem } from './VisitBedAllocationsSection';

interface Props {
    open: boolean;
    onClose: () => void;
    allocation: BedAllocationItem;
    catalogs: ChargeCatalogOption[];
    submitting: boolean;
    onTransfer: (payload: {
        newBedId: string;
        chargeCatalogId: string;
        newStatus?: VisitBedAllocationStatus;
        reason?: string;
    }) => Promise<void>;
}

export const formatCurrency = (amount: number, currency = 'NGN') =>
    new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);

export default function TransferBedAllocationDrawer({
    open,
    onClose,
    allocation,
    catalogs,
    submitting,
    onTransfer,
}: Props) {
    const picker = useWardBedPicker({ excludeBedId: allocation.bedId });
    const [chargeCatalogId, setChargeCatalogId] = useState('');
    const [newStatus, setNewStatus] = useState<VisitBedAllocationStatus>(
        VisitBedAllocationStatus.Reserved
    );
    const [reason, setReason] = useState('');
    const [error, setError] = useState<string | null>(null);

    const noCatalogs = !catalogs || catalogs.length === 0;

    const sameClassAsCurrent = (bedClass?: string) =>
        bedClass && allocation.bed?.class && bedClass === allocation.bed.class;

    const selectedBed = picker.beds.find(b => b.id === picker.selectedBedId);

    const handleSubmit = async () => {
        if (!picker.selectedBedId) {
            setError('Select the bed to transfer into.');
            return;
        }

        if (noCatalogs) {
            setError(
                'No billing catalogs are configured for bed allocation yet.'
            );
            return;
        }

        if (!chargeCatalogId) {
            setError('A charge type is required for the new allocation.');
            return;
        }

        setError(null);

        await onTransfer({
            newBedId: picker.selectedBedId,
            chargeCatalogId,
            newStatus,
            reason: reason.trim() || undefined,
        });

        picker.reset();
        setChargeCatalogId('');
        setReason('');
    };

    return (
        <Drawer
            open={open}
            onClose={onClose}
            placement="right"
            size="large"
            title={null}
            closable={false}
            styles={{
                body: {
                    padding: 0,
                    background: 'linear-gradient(to bottom right, #f8fafc, #f0fdfa)',
                },
            }}
        >
            <div className="flex h-full flex-col overflow-y-auto p-5 sm:p-7">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                        <ArrowRightLeft size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Transfer bed allocation
                        </h3>
                        <p className="text-sm text-slate-500">
                            Moving out of{' '}
                            <span className="font-medium text-slate-700">
                                {allocation.bed?.name}
                            </span>{' '}
                            ({allocation.bed?.class})
                        </p>
                    </div>
                </div>

                <div className="flex-1 space-y-5">
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

                    {selectedBed && (
                        <div
                            className={`rounded-xl px-4 py-3 text-xs font-medium ${sameClassAsCurrent(selectedBed.class)
                                    ? 'bg-slate-50 text-slate-600'
                                    : 'bg-teal-50 text-teal-700'
                                }`}
                        >
                            {sameClassAsCurrent(selectedBed.class)
                                ? 'Same accommodation class — the current charge will be merged into the new one.'
                                : `Different accommodation class (${selectedBed.class}) — the current charge stays, and a new one is added.`}
                        </div>
                    )}

                    <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                            <ReceiptText size={15} className="text-teal-600" />
                            Billing for the new bed
                        </div>

                        {noCatalogs && (
                            <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                                No bed charge catalogs are configured yet.
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

                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-700">
                            New allocation status
                        </p>
                        <div className="flex gap-2">
                            {[
                                VisitBedAllocationStatus.Reserved,
                                VisitBedAllocationStatus.Occupied,
                            ].map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setNewStatus(status)}
                                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition cursor-pointer ${newStatus === status
                                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                                        }`}
                                >
                                    {status === VisitBedAllocationStatus.Reserved
                                        ? 'Reserved'
                                        : 'Occupied'}
                                </button>
                            ))}
                        </div>
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
                </div>

                <div className="flex gap-3 border-t border-slate-100 pt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={submitting || noCatalogs}
                        onClick={handleSubmit}
                        className="flex-1 rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white! shadow-md shadow-teal-200 transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                        {submitting ? 'Transferring…' : 'Confirm transfer'}
                    </button>
                </div>
            </div>
        </Drawer>
    );
}