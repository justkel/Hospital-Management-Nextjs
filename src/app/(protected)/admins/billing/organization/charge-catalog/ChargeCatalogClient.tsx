'use client';

import { useState } from 'react';
import {
  OrganizationChargeItemsQuery,
  OrganizationChargeCatalogsQuery,
  CreateChargeCatalogInput,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import ChargeCatalogList from './components/ChargeCatalogList';
import CreateChargeCatalogCard from './components/CreateChargeCatalogCard';

type ChargeItem =
  OrganizationChargeItemsQuery['organizationChargeItems'][number];

type PaginationResult =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs'];

interface Props {
  items: ChargeItem[];
  initialCatalogs: PaginationResult;
}

export default function ChargeCatalogClient({
  items,
  initialCatalogs,
}: Props) {
  const [catalogData, setCatalogData] =
    useState<PaginationResult>(initialCatalogs);

  async function createCharge(data: CreateChargeCatalogInput) {
    const res = await clientFetch('/api/billing/create-charge-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to create charge');
    }

    setCatalogData(prev => ({
      ...prev,
      items: [json.charge, ...prev.items],
      total: prev.total + 1,
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Charge Catalog Management
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Create and manage billable charges linked to catalog items.
          </p>
        </div>

        <CreateChargeCatalogCard
          items={items}
          onCreate={createCharge}
        />

        <ChargeCatalogList
          data={catalogData}
        />

      </div>
    </div>
  );
}