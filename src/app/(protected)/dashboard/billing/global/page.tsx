/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import {
  GetGlobalBillingCategoriesQuery,
} from '@/shared/graphql/generated/graphql';

type Category =
  GetGlobalBillingCategoriesQuery['globalBillingCategories'][number];

export default function GlobalBillingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingClone, setLoadingClone] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCategory = categories.find(c => c.id === selectedId);

  useEffect(() => {
    let active = true;

    const run = async () => {
      try {
        const res = await clientFetch('/api/billing/global-categories');
        const json = await res.json();

        if (!res.ok) throw new Error(json.error || 'Failed to load');

        if (active) {
          setCategories(json.categories);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoadingCategories(false);
        }
      }
    };

    run();

    return () => {
      active = false;
    };
  }, []);

  async function handleClone() {
    if (!selectedId) return;

    setLoadingClone(true);
    setFeedback(null);
    setError(null);

    try {
      const res = await clientFetch('/api/billing/clone-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId: selectedId }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || 'Clone failed');

      setFeedback('Category successfully cloned to your organization.');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingClone(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Global Billing Catalogue
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Browse standardized global billing categories and clone them
            into your organization for immediate use.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">

          <div className="flex flex-col lg:flex-row lg:items-end gap-6">

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Select Category
              </label>

              <select
                value={selectedId ?? ''}
                onChange={e => setSelectedId(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              >
                <option value="">Choose a category...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:pb-0.5">
              <button
                onClick={handleClone}
                disabled={!selectedId || loadingClone}
                className="w-full sm:w-auto rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loadingClone ? 'Cloning...' : 'Clone Category'}
              </button>
            </div>
          </div>

          {feedback && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
              {feedback}
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {selectedCategory && (
          <div className="space-y-6">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedCategory.name} Items
              </h2>

              <span className="text-sm text-gray-500">
                {selectedCategory.items?.length || 0} items
              </span>
            </div>

            {loadingCategories ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center text-gray-500">
                Loading categories...
              </div>
            ) : selectedCategory.items?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {selectedCategory.items.map(item => (
                  <div
                    key={item.id}
                    className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="space-y-3">

                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1 tracking-wide">
                          CODE: {item.code}
                        </p>
                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-12 text-center text-gray-500">
                No items available in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
