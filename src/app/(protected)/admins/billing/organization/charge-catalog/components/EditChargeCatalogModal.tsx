'use client';

import { useState } from 'react';
import {
  BillingType,
  UpdateChargeCatalogInput,
} from '@/shared/graphql/generated/graphql';
import { X } from 'lucide-react';

interface Props {
  charge: UpdateChargeCatalogInput;
  onClose: () => void;
  onUpdate: (data: UpdateChargeCatalogInput) => Promise<void>;
}

export default function EditChargeCatalogModal({
  charge,
  onClose,
  onUpdate,
}: Props) {
  const [form, setForm] = useState({
    chargeCatalogId: charge?.chargeCatalogId,
    name: charge?.name ?? '',
    code: charge?.code ?? '',
    unitPrice: charge?.unitPrice ?? 0,
    billingType: charge?.billingType ?? BillingType.Fixed,
    description: charge?.description ?? '',
    isActive: charge?.isActive ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpdate() {
    try {
      setLoading(true);
      setError(null);
      await onUpdate(form);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex items-start sm:items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl overflow-hidden rounded-2xl !bg-white shadow-2xl">
          <div className="border-b !border-[#E8E6E0] px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div>
                  <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                    Edit Charge
                  </h2>
                  <p className="mt-1 text-sm !text-[#767570]">
                    Update charge configuration
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {error && (
              <div className="rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3 text-sm font-medium !text-[#DC2626]">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Charge Name
                </label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                  placeholder="Delivery Fee"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Charge Code
                </label>
                <input
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                  placeholder="DLV001"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Unit Price
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm !text-[#B4B2A9]">
                    ₦
                  </span>
                  <input
                    type="number"
                    value={form.unitPrice}
                    onChange={e =>
                      setForm({
                        ...form,
                        unitPrice: Number(e.target.value),
                      })
                    }
                    className="w-full pl-7 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Billing Type
                </label>
                <select
                  value={form.billingType}
                  onChange={e =>
                    setForm({
                      ...form,
                      billingType: e.target.value as BillingType,
                    })
                  }
                  className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 cursor-pointer"
                >
                  {Object.values(BillingType).map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
            </div>

            <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold !text-[#16211B]">
                    Active Status
                  </p>
                  <p className="text-xs !text-[#767570]">
                    Enable or disable this charge
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
                    form.isActive ? '!bg-[#1D9E75]' : '!bg-[#D3D1C7]'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 rounded-full !bg-white shadow-md transition-all duration-300 ${
                      form.isActive ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t !border-[#E8E6E0] px-5 py-4 sm:px-6 sm:py-5 !bg-white">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={onClose}
                className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleUpdate}
                className="h-10 w-full sm:w-auto rounded-xl !bg-[#0c1a12] px-5 text-xs font-semibold !text-white transition hover:!bg-[#16211B] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}