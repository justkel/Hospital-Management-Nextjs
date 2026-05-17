'use client';

import { useEffect, useMemo, useState } from 'react';
import { Drawer, Grid } from 'antd';

import {
    GetVisitProceduresQuery,
    UpdateVisitProcedureInput,
    VisitProcedurePriority,
    VisitProcedureStatus,
    VisitProcedureOutcome,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import { ChargeCatalogOption } from '../../visits/components/vitals/VisitVitalsSection';

import ProcedureDrawerHeader from './ProcedureDrawerHeader';
import ProcedureForm from './ProcedureForm';

const { useBreakpoint } = Grid;

type ProcedureItem =
    GetVisitProceduresQuery['visitProcedures']['items'][number];

export default function UpdateVisitProcedureDrawer({
    open,
    onClose,
    procedure,
    catalogs = [],
    onUpdated,
}: {
    open: boolean;
    onClose: () => void;
    procedure: ProcedureItem | null;
    catalogs: ChargeCatalogOption[];
    onUpdated?: () => void;
}) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading] = useState(false);

    const [form, setForm] =
        useState<UpdateVisitProcedureInput>({
            visitProcedureId: '',
            priority: VisitProcedurePriority.Normal,
            _validation: true,
        });

    const [success, setSuccess] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!procedure) return;

        setForm({
            visitProcedureId: procedure.id,

            status:
                (procedure.status as VisitProcedureStatus) ??
                VisitProcedureStatus.Pending,

            priority:
                (procedure.priority as VisitProcedurePriority) ??
                VisitProcedurePriority.Normal,

            notes: procedure.notes || undefined,

            outcome:
                procedure.outcome as VisitProcedureOutcome | undefined,

            estimatedDuration:
                procedure.estimatedDuration || undefined,

            customProcedureCode:
                procedure.customProcedureCode || undefined,

            customProcedureName:
                procedure.customProcedureName || undefined,

            procedureCatalogId:
                procedure.procedureCatalog?.id || undefined,

            bedAllocationId:
                procedure.bedAllocation?.id || undefined,

            _validation: true,
        });

        setError(null);
        setSuccess(null);
    }, [procedure]);

    const hasCustom =
        !!form.customProcedureName?.trim() ||
        !!form.customProcedureCode?.trim();

    const hasCatalog = !!form.procedureCatalogId;

    const disableCustom = hasCatalog;
    const disableCatalog = hasCustom;
    const isCompleted =
        procedure?.status === VisitProcedureStatus.Completed;

    const canSubmit = useMemo(() => {
        if (isCompleted) {
            return !!form.outcome;
        }

        if (
            !form.procedureCatalogId &&
            !form.customProcedureName?.trim()
        ) {
            return false;
        }

        return true;
    }, [form, isCompleted]);

    const resetState = () => {
        setLoading(false);
        setError(null);
        setSuccess(null);
    };

    const setCatalog = (value?: string) => {
        const normalized =
            value && value.trim().length > 0
                ? value
                : undefined;

        if (normalized) {
            setForm(prev => ({
                ...prev,
                procedureCatalogId: normalized,
                customProcedureName: undefined,
                customProcedureCode: undefined,
            }));
        } else {
            setForm(prev => ({
                ...prev,
                procedureCatalogId: undefined,
            }));
        }
    };

    const setCustomField = (
        field:
            | 'customProcedureName'
            | 'customProcedureCode',
        value: string
    ) => {
        setForm(prev => {
            const updated = {
                ...prev,
                [field]: value || undefined,
            };

            const hasAnyCustom =
                updated.customProcedureName?.trim() ||
                updated.customProcedureCode?.trim();

            if (hasAnyCustom) {
                updated.procedureCatalogId = undefined;
            }

            return updated;
        });
    };

    async function handleSubmit() {
        if (!procedure) return;

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const payload: UpdateVisitProcedureInput = isCompleted
                ? {
                    visitProcedureId: procedure.id,
                    outcome: form.outcome,
                    _validation: true,
                }
                : {
                    ...form,

                    visitProcedureId: procedure.id,

                    estimatedDuration:
                        form.estimatedDuration || undefined,

                    notes: form.notes?.trim() || undefined,

                    procedureCatalogId:
                        form.procedureCatalogId?.trim()
                            ? form.procedureCatalogId
                            : undefined,

                    customProcedureName:
                        form.customProcedureName?.trim() ||
                        undefined,

                    customProcedureCode:
                        form.customProcedureCode?.trim() ||
                        undefined,

                    startedAt:
                        form.status ===
                            VisitProcedureStatus.InProgress &&
                            !procedure.startedAt
                            ? new Date().toISOString()
                            : undefined,

                    completedAt:
                        form.status ===
                            VisitProcedureStatus.Completed &&
                            !procedure.completedAt
                            ? new Date().toISOString()
                            : undefined,
                };

            const res = await clientFetch(
                '/api/visit-procedure/update',
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();

            if (!res.ok) {
                throw new Error(
                    json.error ||
                    'Failed to update procedure'
                );
            }

            setSuccess(
                'Procedure updated successfully.'
            );

            setTimeout(() => {
                resetState();
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
            onClose={() => {
                resetState();
                onClose();
            }}
            open={open}
            size={isMobile ? 'large' : 'default'}
            rootClassName={
                isMobile
                    ? '[&_.ant-drawer-content]:h-[95vh] [&_.ant-drawer-content]:rounded-t-[2rem]'
                    : '[&_.ant-drawer-content]:w-[720px]'
            }
            styles={{
                body: {
                    padding: isMobile ? 16 : 24,
                },
            }}
        >
            <div className="space-y-6 pb-10">
                <ProcedureDrawerHeader
                    procedure={procedure}
                />

                {!isCompleted ? (
                    <ProcedureForm
                        form={form}
                        setForm={setForm}
                        catalogs={catalogs}
                        disableCatalog={disableCatalog}
                        disableCustom={disableCustom}
                        setCatalog={setCatalog}
                        setCustomField={setCustomField}
                    />
                ) : (
                    <div className="space-y-5 rounded-[2rem] border border-emerald-200 bg-emerald-50/60 p-5">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-500">
                                Procedure Completion
                            </p>

                            <h3 className="mt-1 text-xl font-black text-emerald-900">
                                Finalize Procedure Outcome
                            </h3>

                            <p className="mt-2 text-sm leading-relaxed text-emerald-700">
                                This procedure is being marked as completed.
                                Select the final clinical outcome.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-slate-700">
                                Procedure Outcome
                            </label>

                            <select
                                value={form.outcome || ''}
                                onChange={e =>
                                    setForm(prev => ({
                                        ...prev,
                                        outcome:
                                            e.target.value as VisitProcedureOutcome,
                                    }))
                                }
                                className="
                                    h-14 w-full rounded-2xl
                                    border border-emerald-300
                                    bg-white px-4
                                    text-sm font-medium text-slate-800
                                    outline-none transition-all
                                    focus:border-emerald-500
                                    focus:ring-4 focus:ring-emerald-100
                                "
                            >
                                <option value="">
                                    Select outcome
                                </option>

                                {Object.values(VisitProcedureOutcome).map(
                                    outcome => (
                                        <option
                                            key={outcome}
                                            value={outcome}
                                        >
                                            {outcome.replace(/_/g, ' ')}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
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
                        disabled={loading || !canSubmit}
                        className="
                            w-full h-14 rounded-2xl
                            bg-gradient-to-r from-blue-600 to-indigo-600
                            !text-white font-bold text-base
                            shadow-xl hover:shadow-2xl
                            hover:scale-[1.01]
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {loading
                            ? 'Updating Procedure...'
                            : 'Save Procedure Changes'}
                    </button>
                </div>
            </div>
        </Drawer>
    );
}