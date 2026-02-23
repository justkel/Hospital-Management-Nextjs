'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { Pencil, Search } from 'lucide-react';

export default function CategorySidebar({
  categories,
  selectedId,
  setSelectedId,
  startEdit,
}: any) {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { sensitivity: 'base' })
      )
      .filter(cat =>
        cat.code.toLowerCase().includes(search.toLowerCase())
      );
  }, [categories, search]);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[75vh]">

      <div className="sticky top-0 bg-white z-10 p-5 border-b border-gray-100 rounded-t-3xl space-y-4">

        <h3 className="text-sm font-semibold text-gray-600 tracking-wide">
          Categories
        </h3>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search by code..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">

        {filteredCategories.length === 0 && (
          <div className="text-sm text-gray-400 px-2 py-10 text-center">
            No matching categories found.
          </div>
        )}

        {filteredCategories.map((cat: any) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 group rounded-2xl transition"
          >
            <button
              onClick={() => setSelectedId(cat.id)}
              className={`flex-1 text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                selectedId === cat.id
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-gray-400 tracking-wide">
                    {cat.code}
                  </span>
                </div>

                <span className="text-xs text-gray-400">
                  {cat.items?.length ?? 0}
                </span>
              </div>
            </button>

            <button
              onClick={() => startEdit(cat)}
              className="opacity-0 group-hover:opacity-100 transition p-2 rounded-xl hover:bg-gray-200 text-gray-400 hover:text-emerald-600"
              title="Edit category"
            >
              <Pencil size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}