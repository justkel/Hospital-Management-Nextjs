/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pencil } from 'lucide-react';

export default function CategorySidebar({
  categories,
  selectedId,
  setSelectedId,
  startEdit,
}: any) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-2 h-fit">
      <h3 className="text-sm font-semibold text-gray-500 px-2 pb-2">
        Categories
      </h3>

      {categories.length === 0 && (
        <div className="text-sm text-gray-400 px-2 py-6 text-center">
          No categories yet.
        </div>
      )}

      {categories.map((cat: any) => (
        <div
          key={cat.id}
          className="flex items-center gap-2 group px-2 py-1 rounded-2xl hover:bg-gray-50 transition"
        >
          <button
            onClick={() => setSelectedId(cat.id)}
            className={`flex-1 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
              selectedId === cat.id
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400">
                {cat.items?.length ?? 0}
              </span>
            </div>
          </button>

          <button
            onClick={() => startEdit(cat)}
            className="opacity-0 group-hover:opacity-100 transition p-2 rounded-xl hover:bg-gray-200 text-gray-400 hover:text-emerald-600"
          >
            <Pencil size={18} />
          </button>
        </div>
      ))}
    </div>
  );
}