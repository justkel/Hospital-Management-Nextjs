'use client';

import { useState } from 'react';
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
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';

export default function CreateVisitProcedureForm({
  visitId,
  catalogs,
  onCreated,
}: {
  visitId: string;
  catalogs: ChargeCatalogOption[];
  onCreated: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const initialFormState: CreateVisitProcedureInput = {
    visitId,
    priority: VisitProcedurePriority.Normal,
  };

  const [form, setForm] =
    useState<CreateVisitProcedureInput>(initialFormState);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const hasCustom =
    !!form.customProcedureName?.trim() ||
    !!form.customProcedureCode?.trim();

  const hasCatalog = !!form.procedureCatalogId;

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

  const setCustomField = (
    field: 'customProcedureName' | 'customProcedureCode',
    value: string,
  ) => {
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

      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const disableCustom = hasCatalog;
  const disableCatalog = hasCustom;

  return (
    <>
      {contextHolder}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <div className="mb-6">
            <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <ClipboardPlus size={13} />
              Add procedure
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              New visit procedure
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
              Assign a procedure from the catalog or enter custom details for this visit.
            </p>
          </div>

          <div className="mb-6 h-px bg-slate-100" />

          <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              Use either a <strong className="font-semibold">procedure catalog</strong> or{' '}
              <strong className="font-semibold">custom fields</strong> — not both at the same time.
            </p>
          </div>
          <div className="mb-5">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              From catalog
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-500">
                Procedure catalog
              </label>
              <select
                disabled={disableCatalog}
                value={form.procedureCatalogId ?? ''}
                onChange={e => setCatalog(e.target.value)}
                className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition
    ${disableCatalog
                    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-3 focus:ring-blue-100'
                  }`}
              >
                <option value="">Select a procedure catalog…</option>
                {catalogs?.map((c: ChargeCatalogOption) => (
                  <option key={c.id} value={c.id}>
                    {`${c.name} — ₦${c.unitPrice.toLocaleString()}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-100" />
            <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
              or enter custom
            </span>
            <div className="h-px flex-1 bg-slate-100" />
          </div>

          <div className="mb-5">
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Custom procedure
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Procedure name
                </label>
                <input
                  disabled={disableCustom}
                  type="text"
                  placeholder="e.g. Chest X-Ray"
                  value={form.customProcedureName ?? ''}
                  onChange={e => setCustomField('customProcedureName', e.target.value)}
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition
                    ${disableCustom
                      ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-3 focus:ring-blue-100'
                    }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Procedure code
                </label>
                <input
                  disabled={disableCustom}
                  type="text"
                  placeholder="e.g. XR-001"
                  value={form.customProcedureCode ?? ''}
                  onChange={e => setCustomField('customProcedureCode', e.target.value)}
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition
                    ${disableCustom
                      ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                      : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-3 focus:ring-blue-100'
                    }`}
                />
              </div>
            </div>
          </div>

          <div className="mb-5 h-px bg-slate-100" />

          <div>
            <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-slate-400">
              Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Priority
                </label>
                <select
                  value={form.priority ?? ''}
                  onChange={e => setForm({ ...form, priority: e.target.value as VisitProcedurePriority })}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                >
                  <option value={VisitProcedurePriority.Normal}>Normal</option>
                  <option value={VisitProcedurePriority.Urgent}>Urgent</option>
                  <option value={VisitProcedurePriority.High}>High</option>
                  <option value={VisitProcedurePriority.Low}>Low</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">
                  Estimated duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={form.estimatedDuration ?? ''}
                  onChange={e => setForm({ ...form, estimatedDuration: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-slate-500">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Any relevant clinical notes for this procedure…"
                  value={form.notes ?? ''}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={resetForm}
              className="h-9 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-5 text-sm font-medium text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <PlusCircle size={14} />
                  Create procedure
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}