'use client';

import { CalendarDays, Pencil } from 'lucide-react';
import { VisitPrescription } from '@/shared/graphql/generated/graphql';

interface Props {
    prescriptions: VisitPrescription[];
    loading: boolean;
    onEdit: (p: VisitPrescription) => void;
}

export default function VisitPrescriptionsList({
    prescriptions,
    loading,
    onEdit,
}: Props) {
    if (loading) {
        return <p className="text-sm text-gray-500">Loading prescriptions...</p>;
    }

    if (!prescriptions.length) {
        return (
            <p className="text-sm text-gray-400">
                No prescriptions recorded yet.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {prescriptions.map(p => (
                <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition"
                >
                    <div className="flex justify-between items-start gap-4">

                        <div className="space-y-1">
                            <p className="font-semibold text-gray-900">
                                {p.drug}
                            </p>

                            <p className="text-sm text-gray-500">
                                {p.dose || '—'} • {p.route || '—'} • {p.frequency || '—'}
                            </p>

                            <p className="text-xs text-gray-400 flex items-center gap-1">
                                <CalendarDays size={12} />
                                {p.startDate || '—'} → {p.endDate || '—'}
                            </p>

                            {p.notes && (
                                <p className="text-xs text-gray-500 italic">
                                    {p.notes}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <span
                                className={`text-xs px-2 py-1 rounded-full font-medium ${p.isProvidedInHouse
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                    }`}
                            >
                                {p.isProvidedInHouse ? 'In-house' : 'External'}
                            </span>

                            <button
                                onClick={() => onEdit(p)}
                                className="text-indigo-600 hover:underline"
                            >
                                <Pencil size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}