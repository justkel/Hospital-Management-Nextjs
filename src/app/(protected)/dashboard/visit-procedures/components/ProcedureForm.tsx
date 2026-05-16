'use client';

import { Select } from 'antd';

import {
    UpdateVisitProcedureInput,
    VisitProcedurePriority,
    VisitProcedureStatus,
} from '@/shared/graphql/generated/graphql';

import { ChargeCatalogOption } from '../../visits/components/vitals/VisitVitalsSection';

export default function ProcedureForm({
    form,
    setForm,
    catalogs,
    disableCatalog,
    disableCustom,
    setCatalog,
    setCustomField,
}: {
    form: UpdateVisitProcedureInput;

    setForm: React.Dispatch<
        React.SetStateAction<UpdateVisitProcedureInput>
    >;

    catalogs: ChargeCatalogOption[];

    disableCatalog: boolean;

    disableCustom: boolean;

    setCatalog: (value?: string) => void;

    setCustomField: (
        field:
            | 'customProcedureName'
            | 'customProcedureCode',
        value: string
    ) => void;
}) {
    return (
        <>
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
                        optionFilterProp: 'label',
                        filterSort: (a, b) =>
                            (a.label ?? '')
                                .toString()
                                .localeCompare(
                                    (b.label ?? '').toString()
                                ),
                    }}
                    allowClear
                    placeholder="Select procedure catalog"
                    value={
                        form.procedureCatalogId ??
                        undefined
                    }
                    onChange={value =>
                        setCatalog(value)
                    }
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
                    options={catalogs?.map(
                        (c: any) => ({
                            value: c.id,
                            label: c.name,
                        })
                    )}
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
                            form.estimatedDuration ??
                            ''
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
        </>
    );
}