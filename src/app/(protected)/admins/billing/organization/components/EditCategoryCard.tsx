'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil } from 'lucide-react';

export default function EditCategoryCard({
  editCategory,
  setEditCategory,
  updateCategory,
  cancel,
}: any) {
  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm overflow-hidden">

      <div className="px-6 sm:px-8 py-6 border-b border-emerald-50 bg-linear-to-r from-emerald-50/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
            <Pencil size={18} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Edit Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Update category details and billing structure.
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 sm:px-8 py-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              CATEGORY CODE
            </label>
            <input
              value={editCategory.code}
              onChange={e =>
                setEditCategory((prev: any) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              CATEGORY NAME
            </label>
            <input
              value={editCategory.name}
              onChange={e =>
                setEditCategory((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-medium text-gray-500 tracking-wide">
              DESCRIPTION
            </label>
            <textarea
              value={editCategory.description}
              onChange={e =>
                setEditCategory((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 focus:outline-none transition"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">

          <button
            onClick={cancel}
            className="w-full sm:w-auto rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={updateCategory}
            className="w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}