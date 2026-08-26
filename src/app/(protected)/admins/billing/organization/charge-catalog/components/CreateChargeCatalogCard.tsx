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
  const [serverError, setServerError] = useState<string | null>(null);
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

    const price = form.unitPrice;
    if (price === undefined || price === null || Number.isNaN(price)) {
      newErrors.unitPrice = 'Unit price is required';
    } else {
      const isManual = form.billingType === BillingType.Manual;

      if (!isManual && price <= 0) {
        newErrors.unitPrice =
          'Unit price must be greater than 0 for this billing type';
      }

      if (isManual && price < 0) {
        newErrors.unitPrice = 'Unit price cannot be negative';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError(null);

      await onCreate(form);
      setSuccess(true);

      setForm({
        catalogueItemId: '',
        categoryId: '',
        name: '',
        code: '',
        description: '',
        unitPrice: 0,
        billingType: BillingType.Fixed,
        currency: 'NGN',
      });

      setSelectedItem(null);
      setSearch('');

      setTimeout(() => setSuccess(false), 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Something went wrong');
      }
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
    <div className="w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div className="border-b !border-[#E8E6E0] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                Create Charge Catalog
              </h2>
              <p className="mt-1 text-sm !text-[#767570]">
                Configure billing structure and pricing.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
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
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
            />

            {errors.item && (
              <p className="text-xs !text-[#DC2626]">{errors.item}</p>
            )}

            {showDropdown && (
              <div className="absolute z-10 mt-1 w-full rounded-xl border !border-[#E8E6E0] !bg-white shadow-lg max-h-60 overflow-y-auto">
                {sortedItems.length === 0 && (
                  <div className="p-3 text-sm !text-[#767570]">
                    No results found
                  </div>
                )}
                {sortedItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-3 text-sm !text-[#16211B] hover:!bg-[#F7F7F5] cursor-pointer transition"
                  >
                    {item.name} ({item.code})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t !border-[#E8E6E0]" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Name
              </label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
              {errors.name && (
                <p className="text-xs !text-[#DC2626]">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Code
              </label>
              <input
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
              {errors.code && (
                <p className="text-xs !text-[#DC2626]">{errors.code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Unit Price
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm !text-[#B4B2A9]">
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
                  className="w-full pl-7 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>
              <p className="text-xs !text-[#767570]">
                {formatter.format(form.unitPrice || 0)}
              </p>
              {errors.unitPrice && (
                <p className="text-xs !text-[#DC2626]">{errors.unitPrice}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
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
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 cursor-pointer"
              >
                {Object.values(BillingType).map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t !border-[#E8E6E0]" />

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description ?? ''}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20 resize-none"
            />
          </div>

          {serverError && (
            <div className="rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3 text-sm font-medium !text-[#DC2626]">
              {serverError}
            </div>
          )}

          <div className="pt-4 border-t !border-[#E8E6E0]">
            <button
              disabled={isDisabled}
              onClick={handleSubmit}
              className={`w-full rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2
                ${isDisabled
                  ? '!bg-[#F7F7F5] !text-[#B4B2A9] cursor-not-allowed'
                  : success
                    ? '!bg-[#ECFBF5] !text-[#1D9E75]'
                    : '!bg-[#0c1a12] !text-white hover:!bg-[#16211B]'
                }`}
            >
              {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {success ? '✓ Created Successfully' : 'Create Charge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}