'use client';

import { useMemo, useState } from 'react';
import { Pencil, Search } from 'lucide-react';
import {
  GetOrganizationBillingCategoriesQuery,
} from '@/shared/graphql/generated/graphql';

type Category =
  GetOrganizationBillingCategoriesQuery['organizationBillingCategories'][number];

interface CategorySidebarProps {
  categories: Category[];
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
  startEdit: (category: Category) => void;
}

export default function CategorySidebar({
  categories,
  selectedId,
  setSelectedId,
  startEdit,
}: CategorySidebarProps) {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    return [...categories]
      .sort((a, b) =>
        a.code.localeCompare(b.code, undefined, {
          sensitivity: 'base',
        })
      )
      .filter((cat) =>
        cat.code.toLowerCase().includes(search.toLowerCase())
      );
  }, [categories, search]);

  return (
    <div className="flex h-[75vh] flex-col overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="sticky top-0 z-10 border-b !border-[#E8E6E0] !bg-white p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold !text-[#16211B]">
              Categories
            </h3>
            <p className="text-[10px] !text-[#767570]">
              {categories.length} total
            </p>
          </div>
        </div>

        <div className="relative mt-3">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 !text-[#B4B2A9]"
          />
          <input
            placeholder="Search by code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border !border-[#E8E6E0] !bg-white pl-9 pr-3.5 py-2 text-xs !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
          />
        </div>
      </div>

      <div 
        className="flex-1 space-y-1 overflow-y-auto p-3 hide-scrollbar"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {filteredCategories.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium !text-[#B4B2A9]">
              No matching categories found.
            </p>
          </div>
        )}

        {filteredCategories.map((cat) => (
          <div
            key={cat.id}
            className="group flex items-center gap-1.5 rounded-lg transition hover:!bg-[#F7F7F5]"
          >
            <button
              onClick={() => setSelectedId(cat.id)}
              className={`flex-1 min-w-0 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition ${
                selectedId === cat.id
                  ? '!bg-[#ECFBF5] !text-[#1D9E75]'
                  : '!text-[#5F5E5A] hover:!text-[#16211B]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold !text-[#16211B]">
                    {cat.name}
                  </p>
                  <p className="text-[10px] font-medium !text-[#B4B2A9]">
                    {cat.code}
                  </p>
                </div>

                <span className="shrink-0 rounded-full !bg-[#F7F7F5] px-2 py-0.5 text-[10px] font-semibold !text-[#767570]">
                  {cat.items?.length ?? 0}
                </span>
              </div>
            </button>

            <button
              onClick={() => startEdit(cat)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg !text-[#B4B2A9] transition hover:!bg-[#F7F7F5] hover:!text-[#1D6FE0]"
              title="Edit category"
            >
              <Pencil size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}