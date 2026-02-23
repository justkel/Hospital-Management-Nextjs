'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlusCircle } from 'lucide-react';

export default function AddItemCard({
  selectedCategory,
  newItem,
  setNewItem,
  createItem,
}: any) {
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

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              ITEM CODE
            </label>
            <input
              value={newItem.code}
              onChange={e =>
                setNewItem((prev: any) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              ITEM NAME
            </label>
            <input
              value={newItem.name}
              onChange={e =>
                setNewItem((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2 xl:col-span-3 space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              rows={4}
              value={newItem.description}
              onChange={e =>
                setNewItem((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">

          <button
            onClick={createItem}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition"
          >
            <PlusCircle size={16} />
            Create Item
          </button>

        </div>
      </div>
    </div>
  );
}