/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditCategoryCard({
  editCategory,
  setEditCategory,
  updateCategory,
  cancel,
}: any) {
  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-8 space-y-6 animate-fadeIn">
      <h2 className="text-lg font-semibold text-gray-900">
        Edit Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          value={editCategory.code}
          onChange={e =>
            setEditCategory((prev: any) => ({ ...prev, code: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          value={editCategory.name}
          onChange={e =>
            setEditCategory((prev: any) => ({ ...prev, name: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
        <input
          value={editCategory.description}
          onChange={e =>
            setEditCategory((prev: any) => ({ ...prev, description: e.target.value }))
          }
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={updateCategory}
          className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition"
        >
          Save Changes
        </button>
        <button
          onClick={cancel}
          className="rounded-xl bg-gray-100 px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-200 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}