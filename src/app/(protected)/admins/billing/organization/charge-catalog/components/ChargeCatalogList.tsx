/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  OrganizationChargeCatalogsQuery,
} from '@/shared/graphql/generated/graphql';

import { Edit2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

type PaginationResult =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs'];

interface Props {
  data: PaginationResult;
  onEdit: (charge: any) => void;
  onToggleActive?: (charge: any) => void;
}

export default function ChargeCatalogList({
  data,
  onEdit,
  onToggleActive,
}: Props) {

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Existing Charges
        </h2>

        <span className="text-sm text-gray-500">
          {data.items.length} item{data.items.length !== 1 && 's'}
        </span>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3 text-left">Code</th>
              <th className="px-5 py-3 text-left">Name</th>
              <th className="px-5 py-3 text-left">Price</th>
              <th className="px-5 py-3 text-left">Type</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.items.map(charge => (
              <tr
                key={charge.id}
                onMouseEnter={() => setHoveredId(charge.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="transition-all duration-200 hover:bg-gray-50"
              >

                <td className="px-5 py-4 font-semibold text-gray-900">
                  {charge.code}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {charge.name}
                </td>

                <td className="px-5 py-4 font-medium text-gray-900">
                  ₦{Number(charge.unitPrice).toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100">
                    {charge.billingType}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {charge.category?.name}
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onToggleActive?.(charge)}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      charge.isActive
                        ? 'text-green-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {charge.isActive ? (
                      <ToggleRight size={18}/>
                    ) : (
                      <ToggleLeft size={18}/>
                    )}

                    {charge.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>

                <td className="px-5 py-4 text-center">
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
                      categoryId: charge.category?.id,
                      catalogueItemId: charge.catalogueItem?.id,
                    })}
                    className={`
                      inline-flex items-center gap-1 text-sm font-medium
                      transition-all duration-200
                      ${hoveredId === charge.id
                        ? 'text-blue-700'
                        : 'text-blue-600'}
                    `}
                  >
                    <Edit2 size={16}/>
                    Edit
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-5 md:hidden">
        {data.items.map(charge => (
          <div
            key={charge.id}
            className="p-5 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
          >

            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs uppercase text-gray-400 tracking-wide">
                  Code
                </p>
                <p className="font-semibold text-gray-900">
                  {charge.code}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                {charge.billingType}
              </span>
            </div>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Name
                </p>
                <p className="font-medium text-gray-800">
                  {charge.name}
                </p>
              </div>

              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-gray-400 uppercase">
                    Price
                  </p>
                  <p className="font-semibold">
                    ₦{Number(charge.unitPrice).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-400 uppercase">
                    Category
                  </p>
                  <p className="text-gray-700">
                    {charge.category?.name}
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() =>
                  onEdit({
                    chargeCatalogId: charge.id,
                    name: charge.name,
                    code: charge.code,
                    unitPrice: charge.unitPrice,
                    billingType: charge.billingType,
                    description: charge.description ?? '',
                    currency: charge.currency,
                    isActive: charge.isActive,
                    categoryId: charge.category?.id,
                    catalogueItemId: charge.catalogueItem?.id,
                  })
                }
                className="flex items-center gap-1 text-blue-600 text-sm font-medium"
              >
                <Edit2 size={16}/>
                Edit
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}