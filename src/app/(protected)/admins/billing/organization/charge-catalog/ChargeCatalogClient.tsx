'use client';

import { useState } from 'react';
import { Pagination } from 'antd';
import {
  OrganizationChargeItemsQuery,
  OrganizationChargeCatalogsQuery,
  CreateChargeCatalogInput,
  UpdateChargeCatalogInput,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import ChargeCatalogList from './components/ChargeCatalogList';
import CreateChargeCatalogCard from './components/CreateChargeCatalogCard';
import EditChargeCatalogModal from './components/EditChargeCatalogModal';

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

  const [page, setPage] = useState(initialCatalogs.page);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(initialCatalogs.total);

  const [editing, setEditing] =
    useState<UpdateChargeCatalogInput | null>(null);

  async function fetchPage(nextPage: number, nextLimit = limit) {
    const res = await clientFetch(
      `/api/billing/charge-catalogs?page=${nextPage}&limit=${nextLimit}`
    );

    const json = await res.json();
    if (!res.ok) return;

    setCatalogData(json.organizationChargeCatalogs);
    setPage(json.organizationChargeCatalogs.page);
    setTotal(json.organizationChargeCatalogs.total);
  }

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

    fetchPage(1);
  }

  async function updateCharge(data: UpdateChargeCatalogInput) {
    const payload = {
      chargeCatalogId: data.chargeCatalogId,
      name: data.name,
      code: data.code,
      unitPrice: data.unitPrice,
      billingType: data.billingType,
      description: data.description,
      isActive: data.isActive,
    };
    const res = await clientFetch('/api/billing/update-charge-catalog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || 'Failed to update charge');
    }

    setCatalogData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === json.charge.id ? json.charge : item
      ),
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
          onEdit={setEditing}
        />

        <div className="flex justify-center pt-4">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger
            pageSizeOptions={['5', '10', '20', '50']}
            onChange={(p, l) => {
              setLimit(l);
              fetchPage(p, l);
            }}
          />
        </div>

        {editing && (
          <EditChargeCatalogModal
            charge={editing}
            onClose={() => setEditing(null)}
            onUpdate={updateCharge}
          />
        )}

      </div>
    </div>
  );
}