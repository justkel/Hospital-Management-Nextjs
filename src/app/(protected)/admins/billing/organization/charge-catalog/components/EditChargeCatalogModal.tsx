/* eslint-disable @typescript-eslint/no-explicit-any */
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
  onUpdate: (data: any) => Promise<void>;
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
        
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">

          <div className="flex items-center justify-between px-6 sm:px-8 py-5 sm:py-4 bg-white rounded-t-3xl">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold">
                Edit Charge
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Update charge configuration
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Charge Name
                </label>
                <input
                  value={form.name}
                  onChange={e =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Delivery Fee"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Charge Code
                </label>
                <input
                  value={form.code}
                  onChange={e =>
                    setForm({ ...form, code: e.target.value })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="DLV001"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <input
                  type="number"
                  value={form.unitPrice}
                  onChange={e =>
                    setForm({
                      ...form,
                      unitPrice: Number(e.target.value),
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
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
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                >
                  {Object.values(BillingType).map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gray-50 p-5 rounded-2xl border">
              
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Active Status
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Enable or disable this charge
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, isActive: !form.isActive })
                }
                className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
                  form.isActive ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 h-7 w-7 bg-white rounded-full shadow-md transition-all duration-300 ${
                    form.isActive ? 'translate-x-7' : ''
                  }`}
                />
              </button>
            </div>

          </div>

          <div className="border-t px-6 sm:px-8 py-4 bg-white rounded-b-3xl">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleUpdate}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 text-white! text-sm font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition cursor-pointer"
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