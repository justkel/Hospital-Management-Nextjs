'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BillingType,
  CreateChargeCatalogInput,
  OrganizationChargeItemsQuery,
} from '@/shared/graphql/generated/graphql';

type ChargeItem =
  OrganizationChargeItemsQuery['organizationChargeItems'][number];

interface Props {
  items: ChargeItem[];
  onCreate: (data: CreateChargeCatalogInput) => Promise<void> | void;
}

export default function CreateChargeCatalogCard({
  items,
  onCreate,
}: Props) {
  const [selectedItem, setSelectedItem] = useState<ChargeItem | null>(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateChargeCatalogInput>({
    catalogueItemId: '',
    categoryId: '',
    name: '',
    code: '',
    description: '',
    unitPrice: 0,
    billingType: BillingType.Fixed,
    currency: 'NGN',
  });

  const formatter = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  });

  const sortedItems = useMemo(() => {
    return [...items]
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
      )
      .filter(i =>
        `${i.name} ${i.code}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
  }, [items, search]);

  function handleSelect(item: ChargeItem) {
    if (!item.category) return;

    setSelectedItem(item);
    setSearch(`${item.name} (${item.code})`);
    setShowDropdown(false);

    setForm(prev => ({
      ...prev,
      catalogueItemId: item.id,
      categoryId: item.category!.id,
      name: item.name,
      code: item.code,
      description: item.description ?? '',
    }));
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (!selectedItem) newErrors.item = 'Please select a charge item';
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.code.trim()) newErrors.code = 'Code is required';
    if (!form.unitPrice || form.unitPrice <= 0)
      newErrors.unitPrice = 'Unit price must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setLoading(true);
      await onCreate(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDisabled = loading;

  return (
    <div className="w-full max-w-4xl mx-auto pb-32">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-10">

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Create Charge Catalog
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure billing structure and pricing.
          </p>
        </div>

        <div className="border-t border-gray-100" />

        <div className="space-y-2 relative" ref={dropdownRef}>
          <label className="text-sm font-medium text-gray-700">
            Charge Item
          </label>

          <input
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search by name or code..."
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
          />

          {errors.item && (
            <p className="text-xs text-red-500">{errors.item}</p>
          )}

          {showDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {sortedItems.length === 0 && (
                <div className="p-3 text-sm text-gray-500">
                  No results found
                </div>
              )}
              {sortedItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer"
                >
                  {item.name} ({item.code})
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Code</label>
            <input
              value={form.code}
              onChange={e => setForm({ ...form, code: e.target.value })}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            />
            {errors.code && (
              <p className="text-xs text-red-500">{errors.code}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Unit Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-400 text-sm">
                ₦
              </span>
              <input
                type="number"
                value={form.unitPrice}
                onChange={e =>
                  setForm({
                    ...form,
                    unitPrice: Number(e.target.value),
                  })
                }
                className="w-full pl-8 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
              />
            </div>
            <p className="text-xs text-gray-400">
              {formatter.format(form.unitPrice || 0)}
            </p>
            {errors.unitPrice && (
              <p className="text-xs text-red-500">
                {errors.unitPrice}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Billing Type
            </label>
            <select
              value={form.billingType}
              onChange={e =>
                setForm({
                  ...form,
                  billingType: e.target.value as BillingType,
                })
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
            >
              {Object.values(BillingType).map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={4}
            value={form.description ?? ''}
            onChange={e =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
          />
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:static md:border-none md:p-0 md:mt-8">
        <button
          disabled={isDisabled}
          onClick={handleSubmit}
          className={`w-full rounded-xl py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
          ${
            isDisabled
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : success
              ? 'bg-green-600 text-white!'
              : 'bg-blue-700 text-white! hover:bg-blue-800 active:scale-[0.98]'
          }`}
        >
          {loading && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {success ? 'Created Successfully ✓' : 'Create Charge'}
        </button>
      </div>
    </div>
  );
}