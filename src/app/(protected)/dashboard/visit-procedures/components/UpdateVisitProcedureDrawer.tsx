'use client';

import { useEffect, useState } from 'react';
import { Drawer, Grid } from 'antd';

import {
    GetVisitProceduresQuery,
    VisitProcedurePriority,
    VisitProcedureStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';
import Link from 'next/link';

const { useBreakpoint } = Grid;

type ProcedureItem =
    GetVisitProceduresQuery['visitProcedures']['items'][number];

export default function UpdateVisitProcedureDrawer({
    open,
    onClose,
    procedure,
    onUpdated,
}: {
    open: boolean;
    onClose: () => void;
    procedure: ProcedureItem | null;
    onUpdated?: () => void;
}) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);

    const [status, setStatus] = useState<VisitProcedureStatus>(
        VisitProcedureStatus.Pending
    );

    const [priority, setPriority] = useState<VisitProcedurePriority>(
        VisitProcedurePriority.Normal
    );

    const [notes, setNotes] = useState('');
    const [cancellationReason, setCancellationReason] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!procedure) return;

        setStatus(procedure.status as VisitProcedureStatus);
        setPriority(procedure.priority as VisitProcedurePriority);
        setNotes(procedure.notes || '');
        setCancellationReason(procedure.cancellationReason || '');
        setEstimatedDuration(
            procedure.estimatedDuration
                ? String(procedure.estimatedDuration)
                : ''
        );
    }, [procedure]);

    async function handleSubmit() {
        if (!procedure) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const payload: any = {
                visitProcedureId: procedure.id,
                status,
                priority,
                notes,
                cancellationReason,
                estimatedDuration: estimatedDuration
                    ? Number(estimatedDuration)
                    : undefined,
            };

            if (status === VisitProcedureStatus.InProgress) {
                payload.startedAt = new Date().toISOString();
            }

            if (status === VisitProcedureStatus.Completed) {
                payload.completedAt = new Date().toISOString();
            }

            if (status === VisitProcedureStatus.Cancelled) {
                payload.cancelledAt = new Date().toISOString();
            }

            const res = await clientFetch('/api/visit-procedure/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json.error || 'Failed to update procedure'
                );
            }

            setSuccess('Procedure updated successfully.');

            setTimeout(() => {
                onUpdated?.();
            }, 900);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Drawer
            title={
                <div>
                    <h2 className="text-xl font-black text-gray-900">
                        Update Procedure
                    </h2>
                </div>
            }
            placement={isMobile ? 'bottom' : 'right'}
            onClose={onClose}
            open={open}
            size={isMobile ? 'large' : 'default'}
            rootClassName={
                isMobile
                    ? '[&_.ant-drawer-content]:h-[95vh] [&_.ant-drawer-content]:rounded-t-[2rem]'
                    : '[&_.ant-drawer-content]:w-[680px]'
            }
            styles={{
                body: {
                    padding: isMobile ? 16 : 24,
                },
            }}
        >
            <div className="space-y-6 pb-10">
                <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
                    <p className="text-sm text-blue-100 uppercase tracking-wider">
                        Procedure
                    </p>

                    <h3 className="mt-2 text-2xl font-black">
                        {procedure?.procedureCatalog?.name ||
                            procedure?.customProcedureName ||
                            'Procedure'}
                    </h3>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm text-blue-100">
                        <Link
                            href={`/dashboard/visits/${procedure?.visitId}`}
                            className="
                                inline-flex items-center gap-2
                                rounded-full border border-white/20
                                bg-white/10 backdrop-blur-md
                                px-4 py-2
                                text-sm font-medium text-white
                                hover:bg-white/20
                                transition-all duration-200
                                hover:scale-[1.02]
                            "
                        >
                            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />

                            <span>
                                Open Visit
                            </span>
                        </Link>

                        {procedure?.orderedBy?.fullName && (
                            <span>
                                Ordered By: {procedure.orderedBy.fullName}
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Procedure Status
                        </label>

                        <select
                            value={status}
                            onChange={e =>
                                setStatus(e.target.value as VisitProcedureStatus)
                            }
                            className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(VisitProcedureStatus).map(item => (
                                <option key={item} value={item}>
                                    {item.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Priority Level
                        </label>

                        <select
                            value={priority}
                            onChange={e =>
                                setPriority(e.target.value as VisitProcedurePriority)
                            }
                            className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(VisitProcedurePriority).map(item => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Estimated Duration (minutes)
                    </label>

                    <input
                        type="number"
                        value={estimatedDuration}
                        onChange={e => setEstimatedDuration(e.target.value)}
                        placeholder="e.g 90"
                        className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Clinical Notes
                    </label>

                    <textarea
                        rows={5}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Document observations, findings, or procedural notes..."
                        className="w-full rounded-3xl border border-gray-200 px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {status === VisitProcedureStatus.Cancelled && (
                    <div className="space-y-2 rounded-3xl border border-red-100 bg-red-50 p-5">
                        <label className="text-sm font-semibold text-red-700">
                            Cancellation Reason
                        </label>

                        <textarea
                            rows={4}
                            value={cancellationReason}
                            onChange={e => setCancellationReason(e.target.value)}
                            placeholder="Provide a reason for cancellation"
                            className="w-full rounded-2xl border border-red-200 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                    </div>
                )}

                {error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {success}
                    </div>
                )}

                <div className="sticky bottom-0 bg-white pt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="
                            w-full h-14 rounded-2xl
                            bg-gradient-to-r from-blue-600 to-indigo-600
                            text-white font-bold text-base
                            shadow-xl hover:shadow-2xl
                            hover:scale-[1.01]
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {loading ? 'Updating Procedure...' : 'Save Procedure Changes'}
                    </button>
                </div>
            </div>
        </Drawer>
    );
}