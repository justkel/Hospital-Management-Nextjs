'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function AddItemCard({
  selectedCategory,
  newItem,
  setNewItem,
  createItem,
}: any) {
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const validate = () => {
    const trimmedCode = newItem.code.trim();
    const trimmedName = newItem.name.trim();

    const newErrors: typeof errors = {};

    if (!trimmedCode) {
      newErrors.code = 'Item code is required';
    }

    if (!trimmedName) {
      newErrors.name = 'Item name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    setMessage(null);

    if (!validate()) return;

    try {
      await createItem();

      setErrors({});
      setMessage({
        type: 'success',
        text: 'Billing item created successfully.',
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: (err as Error).message || 'Failed to create billing item.',
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-gray-100 bg-linear-to-r from-emerald-50/50 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
              <PlusCircle size={18} />
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Add Billing Item
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Create a new item under
                <span className="ml-1 font-medium text-emerald-600">
                  {selectedCategory.name}
                </span>
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {selectedCategory.code}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-8 space-y-8">
        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              ITEM CODE
            </label>
            <input
              value={newItem.code}
              onChange={(e) => {
                setNewItem((prev: any) => ({
                  ...prev,
                  code: e.target.value,
                }));
                setMessage(null);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none ${
                errors.code
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400'
              }`}
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              ITEM NAME
            </label>
            <input
              value={newItem.name}
              onChange={(e) => {
                setNewItem((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }));
                setMessage(null);
              }}
              className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none ${
                errors.name
                  ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400'
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              rows={4}
              value={newItem.description}
              onChange={(e) => {
                setNewItem((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }));
                setMessage(null);
              }}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium cursor-pointer text-white! shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition"
          >
            <PlusCircle size={16} />
            Create Item
          </button>
        </div>
      </div>
    </div>
  );
}