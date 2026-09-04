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
import CollapsibleSection from '@/app/(protected)/dashboard/visits/components/CollapsibleSection';

export type Category =
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/admins/billing/organization/charge-catalog"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-5 text-xs font-semibold !text-white transition hover:!bg-[#16211B]"
            >
              Visit Charge Catalog
              <span className="text-white/50">→</span>
            </Link>

            <Link
              href="/admins/billing/charge-domain-mappings"
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E4A] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
            >
              Manage Domain Mapping
              <span className="!text-[#B4B2A9]">→</span>
            </Link>
          </div>
        </div>

        <CreateCategoryCard
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          createCategory={createCategory}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 lg:flex-shrink-0">
            <CategorySidebar
              categories={categories}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              startEdit={startEdit}
            />
          </div>

          <div className="flex-1 min-w-0 space-y-8">
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
                <CollapsibleSection title="Items Grid" defaultOpen={false}>
                  <ItemsGrid selectedCategory={selectedCategory} />
                </CollapsibleSection>

                <AddItemCard
                  selectedCategory={selectedCategory}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  createItem={createItem}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}