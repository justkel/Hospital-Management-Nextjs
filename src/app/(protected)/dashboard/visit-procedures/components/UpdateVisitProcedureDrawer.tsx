'use client';

import { useEffect, useMemo, useState } from 'react';
import { Drawer, Grid, Select } from 'antd';
import Link from 'next/link';

import {
    GetVisitProceduresQuery,
    UpdateVisitProcedureInput,
    VisitProcedurePriority,
    VisitProcedureStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';
import { ChargeCatalogOption } from '../../visits/components/vitals/VisitVitalsSection';

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

    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

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

    const canSubmit = useMemo(() => {
        if (
            !form.procedureCatalogId &&
            !form.customProcedureName?.trim()
        ) {
            return false;
        }

        return true;
    }, [form]);

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

            const payload: UpdateVisitProcedureInput = {
                ...form,

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
                    : '[&_.ant-drawer-content]:w-[720px]'
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
                            "
                        >
                            <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />

                            <span>Open Visit</span>
                        </Link>

                        {procedure?.orderedBy?.fullName && (
                            <span>
                                Ordered By:{' '}
                                {procedure.orderedBy.fullName}
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
                            value={form.status ?? ''}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    status:
                                        e.target
                                            .value as VisitProcedureStatus,
                                }))
                            }
                            className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(
                                VisitProcedureStatus
                            ).map(item => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item.replace(
                                        /_/g,
                                        ' '
                                    )}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Priority Level
                        </label>

                        <select
                            value={form.priority ?? ''}
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    priority:
                                        e.target
                                            .value as VisitProcedurePriority,
                                }))
                            }
                            className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {Object.values(
                                VisitProcedurePriority
                            ).map(item => (
                                <option
                                    key={item}
                                    value={item}
                                >
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Custom Procedure Name
                        </label>

                        <input
                            disabled={disableCustom}
                            type="text"
                            value={
                                form.customProcedureName ??
                                ''
                            }
                            onChange={e =>
                                setCustomField(
                                    'customProcedureName',
                                    e.target.value
                                )
                            }
                            placeholder="Enter custom procedure name"
                            className={`
                                w-full h-12 rounded-2xl border px-4
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${disableCustom
                                    ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                    : 'border-gray-200'
                                }
                            `}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Custom Procedure Code
                        </label>

                        <input
                            disabled={disableCustom}
                            type="text"
                            value={
                                form.customProcedureCode ??
                                ''
                            }
                            onChange={e =>
                                setCustomField(
                                    'customProcedureCode',
                                    e.target.value
                                )
                            }
                            placeholder="e.g PROC-001"
                            className={`
                                w-full h-12 rounded-2xl border px-4
                                focus:outline-none focus:ring-2 focus:ring-blue-500
                                ${disableCustom
                                    ? 'bg-gray-100 cursor-not-allowed border-gray-200'
                                    : 'border-gray-200'
                                }
                            `}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Procedure Catalog
                    </label>

                    <Select
                        disabled={disableCatalog}
                        showSearch={{
                            filterSort: (a, b) =>
                                (a.label ?? '')
                                    .toString()
                                    .localeCompare(
                                        (b.label ?? '').toString()
                                    ),
                        }}
                        allowClear
                        placeholder="Select procedure catalog"
                        value={form.procedureCatalogId ?? undefined}
                        onChange={value => setCatalog(value)}
                        optionFilterProp="label"
                        size="large"
                        className="
                            w-full
                            [&_.ant-select-selector]:!rounded-2xl
                            [&_.ant-select-selector]:!min-h-12
                            [&_.ant-select-selector]:!h-auto
                            [&_.ant-select-selector]:!py-1.5
                            [&_.ant-select-selector]:!px-4
                            [&_.ant-select-selector]:!items-start
                            [&_.ant-select-selector]:!border-gray-200
                            [&_.ant-select-selector]:!shadow-none

                            [&_.ant-select-selection-wrap]:!items-start
                            [&_.ant-select-selection-wrap]:!flex-col

                            [&_.ant-select-selection-item]:!leading-5
                            [&_.ant-select-selection-placeholder]:!leading-5
                        "
                        options={catalogs?.map((c: any) => ({
                            value: c.id,
                            label: c.name,
                        }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Estimated Duration (minutes)
                        </label>

                        <input
                            type="number"
                            value={
                                form.estimatedDuration ?? ''
                            }
                            onChange={e =>
                                setForm(prev => ({
                                    ...prev,
                                    estimatedDuration:
                                        e.target.value
                                            ? Number(
                                                e.target.value
                                            )
                                            : undefined,
                                }))
                            }
                            placeholder="e.g 90"
                            className="w-full h-12 rounded-2xl border border-gray-200 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Clinical Notes
                    </label>

                    <textarea
                        rows={5}
                        value={form.notes ?? ''}
                        onChange={e =>
                            setForm(prev => ({
                                ...prev,
                                notes: e.target.value,
                            }))
                        }
                        placeholder="Document findings, observations, or procedural notes..."
                        className="w-full rounded-3xl border border-gray-200 px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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