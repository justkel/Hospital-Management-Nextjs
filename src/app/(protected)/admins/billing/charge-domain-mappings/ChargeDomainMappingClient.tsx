'use client';

import { useMemo, useState } from 'react';
import { Select, Button, Card, message } from 'antd';
import {
  ChargeDomain,
  ChargeDomainMappingsQuery,
  OrganizationChargeCatalogsQuery,
  SyncChargeDomainMappingInput,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

type Catalog =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs']['items'][number];

interface Props {
  mappings: Mapping[];
  catalogs: Catalog[];
}

export default function ChargeDomainMappingClient({
  mappings,
  catalogs,
}: Props) {
  const [selectedDomain, setSelectedDomain] =
    useState<ChargeDomain | null>(null);

  const [selectedCatalogIds, setSelectedCatalogIds] =
    useState<string[]>([]);

  const grouped = useMemo(() => {
    const map: Record<string, Mapping[]> = {};

    mappings.forEach(m => {
      if (!map[m.chargeDomain]) map[m.chargeDomain] = [];
      map[m.chargeDomain].push(m);
    });

    return map;
  }, [mappings]);

  async function handleSync() {
    if (!selectedDomain) {
      message.error('Please select a domain');
      return;
    }

    const payload: SyncChargeDomainMappingInput = {
      chargeDomain: selectedDomain,
      chargeCatalogIds: selectedCatalogIds,
    };

    const res = await clientFetch(
      '/api/billing/sync-charge-domain-mapping',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const json = await res.json();

    if (!res.ok) {
      message.error(json.error || 'Sync failed');
      return;
    }

    message.success('Domain synced successfully');
    window.location.reload();
  }

  return (
    <div className="space-y-10">

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Charge Domain Mapping
        </h1>
        <p className="text-gray-500">
          Assign charge catalogs to billing domains.
        </p>
      </div>

      <Card className="rounded-2xl shadow-sm">
        <div className="space-y-4">

          <Select
            placeholder="Select Charge Domain"
            className="w-full"
            onChange={value => {
              setSelectedDomain(value);
              const existing =
                grouped[value]?.map(m => m.chargeCatalogId) || [];
              setSelectedCatalogIds(existing);
            }}
            options={Object.values(ChargeDomain).map(domain => ({
              label: domain,
              value: domain,
            }))}
          />

          <Select
            mode="multiple"
            placeholder="Select Charge Catalogs"
            className="w-full"
            value={selectedCatalogIds}
            onChange={setSelectedCatalogIds}
            options={catalogs.map(c => ({
              label: `${c.name} (${c.code})`,
              value: c.id,
            }))}
          />

          <Button
            type="primary"
            onClick={handleSync}
            className="rounded-xl"
          >
            Sync Domain
          </Button>

        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(grouped).map(([domain, domainMappings]) => (
          <Card
            key={domain}
            title={domain}
            className="rounded-2xl shadow-sm"
          >
            <ul className="space-y-2">
              {domainMappings.map(m => (
                <li key={m.id}>
                  {m.chargeCatalog.name} ({m.chargeCatalog.code})
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

    </div>
  );
}