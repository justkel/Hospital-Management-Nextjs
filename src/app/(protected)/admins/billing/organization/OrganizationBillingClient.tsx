'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import {
  GetOrganizationBillingCategoriesQuery,
} from '@/shared/graphql/generated/graphql';

type Category =
  GetOrganizationBillingCategoriesQuery['organizationBillingCategories'][number];

interface Props {
  categories: Category[];
}

export default function OrganizationBillingClient({ categories: initial }: Props) {
  const [categories, setCategories] = useState(
    initial.map(cat => ({
      ...cat,
      items: cat.items ?? [],
    }))
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    initial[0]?.id ?? null
  );

  const [newCategory, setNewCategory] = useState({
    code: '',
    name: '',
    description: '',
  });

  const [newItem, setNewItem] = useState({
    code: '',
    name: '',
    description: '',
  });

  const selectedCategory = categories.find(c => c.id === selectedId);

  async function createCategory() {
    const res = await clientFetch('/api/billing/create-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCategory),
    });

    const json = await res.json();
    if (!res.ok) return;

    setCategories(prev => [...prev, { ...json.category, items: [] }]);
    setNewCategory({ code: '', name: '', description: '' });
  }

  async function createItem() {
    if (!selectedId) return;

    const res = await clientFetch('/api/billing/create-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newItem,
        categoryId: selectedId,
      }),
    });

    const json = await res.json();
    if (!res.ok) return;

    setCategories(prev =>
      prev.map(cat =>
        cat.id === selectedId
          ? {
              ...cat,
              items: [...(cat.items ?? []), json.item],
            }
          : cat
      )
    );

    setNewItem({ code: '', name: '', description: '' });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Organization Billing
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Manage your billing categories and items. Create structured billing
            models tailored to your organization.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Category
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              placeholder="Code"
              value={newCategory.code}
              onChange={e =>
                setNewCategory({ ...newCategory, code: e.target.value })
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <input
              placeholder="Name"
              value={newCategory.name}
              onChange={e =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
            <input
              placeholder="Description"
              value={newCategory.description}
              onChange={e =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          <div>
            <button
              onClick={createCategory}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition active:scale-[0.98] cursor-pointer"
            >
              Create Category
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 space-y-2 h-fit">
            <h3 className="text-sm font-semibold text-gray-500 px-2 pb-2">
              Categories
            </h3>

            {categories.length === 0 && (
              <div className="text-sm text-gray-400 px-2 py-6 text-center">
                No categories yet.
              </div>
            )}

            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedId(cat.id)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
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
            ))}
          </div>

          <div className="lg:col-span-3 space-y-8">

            {selectedCategory ? (
              <>
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Add Item to {selectedCategory.name}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      placeholder="Code"
                      value={newItem.code}
                      onChange={e =>
                        setNewItem({ ...newItem, code: e.target.value })
                      }
                      className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                    <input
                      placeholder="Name"
                      value={newItem.name}
                      onChange={e =>
                        setNewItem({ ...newItem, name: e.target.value })
                      }
                      className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                    <input
                      placeholder="Description"
                      value={newItem.description}
                      onChange={e =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>

                  <button
                    onClick={createItem}
                    className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition active:scale-[0.98] cursor-pointer"
                  >
                    Create Item
                  </button>
                </div>
                {selectedCategory.items.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedCategory.items.map(item => (
                      <div
                        key={item.id}
                        className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                      >
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition">
                          {item.name}
                        </h3>

                        <p className="text-xs text-gray-400 mt-1 tracking-wide">
                          CODE · {item.code}
                        </p>

                        {item.description && (
                          <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-400">
                    No items in this category yet.
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-16 text-center text-gray-400">
                Select a category to view and manage its items.
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}