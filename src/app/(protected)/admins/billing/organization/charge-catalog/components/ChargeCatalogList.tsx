import {
  OrganizationChargeCatalogsQuery,
  UpdateChargeCatalogInput,
} from '@/shared/graphql/generated/graphql';

import { Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

type PaginationResult =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs'];

type ChargeCatalogItem = PaginationResult['items'][number];

interface Props {
  data: PaginationResult;
  onEdit: (charge: UpdateChargeCatalogInput) => void;
  onToggleActive?: (charge: ChargeCatalogItem) => void;
}

export default function ChargeCatalogList({
  data,
  onEdit,
  onToggleActive,
}: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="flex flex-col gap-3 border-b !border-[#E8E6E0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-sm font-semibold !text-[#16211B] sm:text-base">
              Existing Charges
            </h2>
            <p className="text-xs !text-[#767570]">
              {data.items.length} item{data.items.length !== 1 && 's'}
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="!bg-[#FAFAF8]">
            <tr className="text-left text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
              <th className="px-4 py-3 sm:px-5">Code</th>
              <th className="px-4 py-3 sm:px-5">Name</th>
              <th className="px-4 py-3 sm:px-5">Price</th>
              <th className="px-4 py-3 sm:px-5">Type</th>
              <th className="px-4 py-3 sm:px-5">Category</th>
              <th className="px-4 py-3 sm:px-5 text-center">Status</th>
              <th className="px-4 py-3 sm:px-5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y !divide-[#F0EFE9]">
            {data.items.map(charge => (
              <tr
                key={charge.id}
                onMouseEnter={() => setHoveredId(charge.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="transition hover:!bg-[#F7F7F5]"
              >
                <td className="px-4 py-3.5 sm:px-5 text-sm font-semibold !text-[#16211B]">
                  {charge.code}
                </td>

                <td className="px-4 py-3.5 sm:px-5 text-sm !text-[#5F5E5A]">
                  {charge.name}
                </td>

                <td className="px-4 py-3.5 sm:px-5 text-sm font-semibold !text-[#16211B]">
                  ₦{Number(charge.unitPrice).toLocaleString()}
                </td>

                <td className="px-4 py-3.5 sm:px-5">
                  <span className="inline-flex rounded-full !bg-[#F7F7F5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">
                    {charge.billingType}
                  </span>
                </td>

                <td className="px-4 py-3.5 sm:px-5 text-sm !text-[#767570]">
                  {charge.category?.name || '—'}
                </td>

                <td className="px-4 py-3.5 sm:px-5 text-center">
                  <button
                    onClick={() => onToggleActive?.(charge)}
                    className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                      charge.isActive
                        ? '!text-[#1D9E75]'
                        : '!text-[#B4B2A9]'
                    }`}
                  >
                    {charge.isActive ? (
                      <ToggleRight size={16} />
                    ) : (
                      <ToggleLeft size={16} />
                    )}
                    {charge.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>

                <td className="px-4 py-3.5 sm:px-5 text-center">
                  <button
                    onClick={() => onEdit({
                      chargeCatalogId: charge.id,
                      name: charge.name,
                      code: charge.code,
                      unitPrice: charge.unitPrice,
                      billingType: charge.billingType,
                      description: charge.description ?? '',
                      currency: charge.currency,
                      isActive: charge.isActive,
                    })}
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                      hoveredId === charge.id
                        ? '!text-[#1D6FE0]'
                        : '!text-[#B4B2A9]'
                    }`}
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {data.items.map(charge => (
          <div
            key={charge.id}
            className="overflow-hidden rounded-xl border !border-[#E8E6E0] !bg-white p-4 transition hover:!border-[#D3D1C7]"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold !text-[#16211B]">
                {charge.code}
              </span>
              <span className="inline-flex shrink-0 rounded-full !bg-[#F7F7F5] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide !text-[#767570]">
                {charge.billingType}
              </span>
            </div>

            <p className="mt-2 text-sm !text-[#5F5E5A]">
              {charge.name}
            </p>

            <div className="mt-3 flex items-center justify-between gap-2 border-t !border-[#F0EFE9] pt-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
                  Price
                </p>
                <p className="text-sm font-semibold !text-[#16211B]">
                  ₦{Number(charge.unitPrice).toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
                  Category
                </p>
                <p className="text-sm !text-[#767570]">
                  {charge.category?.name || '—'}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t !border-[#F0EFE9] pt-3">
              <button
                onClick={() => onToggleActive?.(charge)}
                className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                  charge.isActive
                    ? '!text-[#1D9E75]'
                    : '!text-[#B4B2A9]'
                }`}
              >
                {charge.isActive ? (
                  <ToggleRight size={16} />
                ) : (
                  <ToggleLeft size={16} />
                )}
                {charge.isActive ? 'Active' : 'Inactive'}
              </button>

              <button
                onClick={() => onEdit({
                  chargeCatalogId: charge.id,
                  name: charge.name,
                  code: charge.code,
                  unitPrice: charge.unitPrice,
                  billingType: charge.billingType,
                  description: charge.description ?? '',
                  currency: charge.currency,
                  isActive: charge.isActive,
                })}
                className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide !text-[#1D6FE0] transition hover:!text-[#1D6FE0]/80"
              >
                <Edit2 size={14} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium !text-[#B4B2A9]">
            No charges found
          </p>
          <p className="mt-1 text-xs !text-[#B4B2A9]">
            Create your first charge catalog item to get started.
          </p>
        </div>
      )}
    </div>
  );
}