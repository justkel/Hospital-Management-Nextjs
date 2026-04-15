'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import {
  GetOrganizationBillingCategoriesQuery,
} from '@/shared/graphql/generated/graphql';

import CreateCategoryCard from './components/CreateCategoryCard';
import CategorySidebar from './components/CategorySidebar';
import EditCategoryCard from './components/EditCategoryCard';
import AddItemCard from './components/AddItemCard';
import ItemsGrid from './components/ItemsGrid';
import Link from 'next/link';

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

  const [isEditing, setIsEditing] = useState(false);

  const [editCategory, setEditCategory] = useState({
    categoryId: '',
    code: '',
    name: '',
    description: '',
  });

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

  async function updateCategory() {
    const res = await clientFetch('/api/billing/update-category', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editCategory),
    });

    const json = await res.json();
    if (!res.ok) return;

    setCategories(prev =>
      prev.map(cat =>
        cat.id === editCategory.categoryId
          ? { ...cat, ...json.category }
          : cat
      )
    );

    setIsEditing(false);
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

  function startEdit(category: Category) {
    setEditCategory({
      categoryId: category.id,
      code: category.code,
      name: category.name,
      description: category.description ?? '',
    });
    setIsEditing(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Organization Billing
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Manage your billing categories and items. Create structured billing
              models tailored to your organization.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">

            <Link
              href="/admins/billing/organization/charge-catalog"
              className="inline-flex items-center justify-center rounded-2xl bg-black text-white px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Visit Charge Catalog →
            </Link>

            <Link
              href="/admins/billing/charge-domain-mappings"
              className="inline-flex items-center justify-center rounded-2xl bg-white border border-gray-200 text-gray-900 px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Manage Domain Mapping →
            </Link>

          </div>
        </div>

        <CreateCategoryCard
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          createCategory={createCategory}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <CategorySidebar
            categories={categories}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            startEdit={startEdit}
          />

          <div className="lg:col-span-3 space-y-8">

            {isEditing && (
              <EditCategoryCard
                editCategory={editCategory}
                setEditCategory={setEditCategory}
                updateCategory={updateCategory}
                cancel={() => setIsEditing(false)}
              />
            )}

            {selectedCategory && !isEditing && (
              <>
                <AddItemCard
                  selectedCategory={selectedCategory}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  createItem={createItem}
                />

                <ItemsGrid selectedCategory={selectedCategory} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}