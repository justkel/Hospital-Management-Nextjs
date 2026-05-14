'use client';

import { useState, useMemo } from 'react';
import { message } from 'antd';
import {
  CreateVisitProcedureInput,
  VisitProcedurePriority,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import {
  ClipboardPlus,
  Loader2,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';

export default function CreateVisitProcedureForm({
  visitId,
  catalogs,
  onCreated,
}: {
  visitId: string;
  catalogs: any[];
  onCreated: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [form, setForm] =
    useState<CreateVisitProcedureInput>({
      visitId,
      priority: VisitProcedurePriority.Normal,
    });

  const hasCustom =
    !!form.customProcedureName?.trim() ||
    !!form.customProcedureCode?.trim();

  const hasCatalog = !!form.procedureCatalogId;

  const conflict = hasCustom && hasCatalog;

  const setCatalog = (value?: string) => {
    if (value) {
      setForm({
        ...form,
        procedureCatalogId: value,
        customProcedureName: undefined,
        customProcedureCode: undefined,
      });
    } else {
      setForm({
        ...form,
        procedureCatalogId: undefined,
      });
    }
  };

  const setCustomField = (field: any, value: string) => {
    const updated = {
      ...form,
      [field]: value || undefined,
    };

    const hasAnyCustom =
      updated.customProcedureName?.trim() ||
      updated.customProcedureCode?.trim();

    if (hasAnyCustom) {
      updated.procedureCatalogId = undefined;
    }

    setForm(updated);
  };

  const submit = async () => {
    try {
      setLoading(true);

      const payload = {
        ...form,
        procedureCatalogId:
          form.procedureCatalogId || undefined,
      };

      const res = await clientFetch(
        '/api/visit-procedure/create',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        messageApi.error(
          json.error || 'Failed to create procedure'
        );
        return;
      }

      await onCreated();

      messageApi.success('Procedure created successfully');

      setForm({
        visitId,
        priority: VisitProcedurePriority.Normal,
      });
    } finally {
      setLoading(false);
    }
  };

  const disableCustom = hasCatalog;
  const disableCatalog = hasCustom;

  return (
    <>
      {contextHolder}

      <div className="relative overflow-hidden rounded-3xl border bg-white shadow-sm">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-indigo-500/5" />

        <div className="relative p-6 md:p-8">

          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
              <ClipboardPlus className="text-blue-700" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Add New Procedure
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Create and assign a new procedure to this visit
              </p>
            </div>
          </div>

          <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
            <AlertTriangle size={16} className="mt-0.5" />
            <p>
              You can only use either a <b>procedure catalog</b> OR
              <b> custom procedure fields</b>, not both.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Custom Procedure Name
              </label>

              <input
                disabled={disableCustom}
                type="text"
                placeholder="Enter procedure name"
                value={form.customProcedureName ?? ''}
                onChange={e =>
                  setCustomField(
                    'customProcedureName',
                    e.target.value
                  )
                }
                className={`w-full h-12 rounded-xl border px-4 text-sm outline-none transition
                  ${disableCustom
                    ? 'bg-slate-100 cursor-not-allowed'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Custom Procedure Code
              </label>

              <input
                disabled={disableCustom}
                type="text"
                placeholder="Enter code (e.g XR-001)"
                value={form.customProcedureCode ?? ''}
                onChange={e =>
                  setCustomField(
                    'customProcedureCode',
                    e.target.value
                  )
                }
                className={`w-full h-12 rounded-xl border px-4 text-sm outline-none transition
                  ${disableCustom
                    ? 'bg-slate-100 cursor-not-allowed'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Procedure Catalog
              </label>

              <select
                disabled={disableCatalog}
                value={form.procedureCatalogId ?? ''}
                onChange={e => setCatalog(e.target.value)}
                className={`w-full h-12 rounded-xl border px-4 text-sm outline-none transition
                  ${disableCatalog
                    ? 'bg-slate-100 cursor-not-allowed'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
                  }`}
              >
                <option value="">Select procedure catalog</option>

                {catalogs?.map((c: any) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Estimated Duration (minutes)
              </label>

              <input
                type="number"
                value={form.estimatedDuration ?? ''}
                onChange={e =>
                  setForm({
                    ...form,
                    estimatedDuration: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
                className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Notes
              </label>

              <textarea
                rows={4}
                value={form.notes ?? ''}
                onChange={e =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold !text-white hover:bg-blue-700 disabled:opacity-50 shadow-xl"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Procedure...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Create Procedure
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}