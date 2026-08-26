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

      <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 sm:mb-6">
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1 text-xs font-medium !text-[#1D9E75]">
              <ClipboardPlus size={13} />
              Add procedure
            </div>
            <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
              New visit procedure
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed !text-[#767570]">
              Assign a procedure from the catalog or enter custom details for this visit.
            </p>
          </div>

          <div className="mb-5 h-px !bg-[#E8E6E0] sm:mb-6" />

          <div className="mb-5 flex items-start gap-2.5 rounded-xl border !border-[#F5E3C0] !bg-[#FFF8EC] px-4 py-3 text-sm !text-[#B9770E] sm:mb-6">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              Use either a <strong className="font-semibold">procedure catalog</strong> or{' '}
              <strong className="font-semibold">custom fields</strong> — not both at the same time.
            </p>
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              From catalog
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-medium !text-[#767570]">
                Procedure catalog
              </label>
              <select
                disabled={disableCatalog}
                value={form.procedureCatalogId ?? ''}
                onChange={e => setCatalog(e.target.value)}
                className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${
                  disableCatalog
                    ? 'cursor-not-allowed !border-[#E8E6E0] !bg-[#F7F7F5] !text-[#B4B2A9]'
                    : '!border-[#E8E6E0] !bg-white !text-[#16211B] focus:!border-[#1D9E75]'
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
            <div className="h-px flex-1 !bg-[#E8E6E0]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              or enter custom
            </span>
            <div className="h-px flex-1 !bg-[#E8E6E0]" />
          </div>

          <div className="mb-5">
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              Custom procedure
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium !text-[#767570]">
                  Procedure name
                </label>
                <input
                  disabled={disableCustom}
                  type="text"
                  placeholder="e.g. Chest X-Ray"
                  value={form.customProcedureName ?? ''}
                  onChange={e => setCustomField('customProcedureName', e.target.value)}
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${
                    disableCustom
                      ? 'cursor-not-allowed !border-[#E8E6E0] !bg-[#F7F7F5] !text-[#B4B2A9]'
                      : '!border-[#E8E6E0] !bg-white !text-[#16211B] placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium !text-[#767570]">
                  Procedure code
                </label>
                <input
                  disabled={disableCustom}
                  type="text"
                  placeholder="e.g. XR-001"
                  value={form.customProcedureCode ?? ''}
                  onChange={e => setCustomField('customProcedureCode', e.target.value)}
                  className={`h-10 w-full rounded-lg border px-3 text-sm outline-none transition ${
                    disableCustom
                      ? 'cursor-not-allowed !border-[#E8E6E0] !bg-[#F7F7F5] !text-[#B4B2A9]'
                      : '!border-[#E8E6E0] !bg-white !text-[#16211B] placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]'
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="mb-5 h-px !bg-[#E8E6E0]" />

          <div>
            <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              Details
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="space-y-1.5">
                <label className="text-xs font-medium !text-[#767570]">
                  Priority
                </label>
                <select
                  value={form.priority ?? ''}
                  onChange={e => setForm({ ...form, priority: e.target.value as VisitProcedurePriority })}
                  className="h-10 w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75]"
                >
                  <option value={VisitProcedurePriority.Normal}>Normal</option>
                  <option value={VisitProcedurePriority.Urgent}>Urgent</option>
                  <option value={VisitProcedurePriority.High}>High</option>
                  <option value={VisitProcedurePriority.Low}>Low</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium !text-[#767570]">
                  Estimated duration (minutes)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 30"
                  value={form.estimatedDuration ?? ''}
                  onChange={e => setForm({ ...form, estimatedDuration: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-10 w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium !text-[#767570]">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Any relevant clinical notes for this procedure…"
                  value={form.notes ?? ''}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t !border-[#E8E6E0] pt-5 xs:flex-row xs:items-center xs:justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="h-10 rounded-lg border !border-[#E8E6E0] px-4 text-sm font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg !bg-[#0c1a12] px-5 text-sm font-medium !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50"
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