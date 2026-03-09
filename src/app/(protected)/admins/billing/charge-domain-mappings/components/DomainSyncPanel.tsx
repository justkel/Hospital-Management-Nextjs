'use client';

import { useMemo, useState } from 'react';
import { Button, message } from 'antd';
import {
  ChargeDomain,
  OrganizationChargeCatalogsQuery,
  SyncChargeDomainMappingInput,
  ChargeDomainMappingsQuery,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import DomainSelector from './DomainSelector';
import CatalogSelector from './CatalogSelector';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

type Catalog =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs']['items'][number];

interface Props {
  catalogs: Catalog[];
  grouped: Record<string, Mapping[]>;
  setMappings: React.Dispatch<React.SetStateAction<Mapping[]>>;
}

export default function DomainSyncPanel({
  catalogs,
  grouped,
  setMappings,
}: Props) {
  const [selectedDomain, setSelectedDomain] =
    useState<ChargeDomain | null>(null);

  const [selectedCatalogIds, setSelectedCatalogIds] =
    useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (
    type: 'success' | 'error',
    content: string
  ) => {
    messageApi.open({
      type,
      content,
      duration: 3,
    });
  };

  async function handleSync() {
    if (!selectedDomain) {
      showMessage('error', 'Please select a domain');
      return;
    }

    setLoading(true);

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
    setLoading(false);

    if (!res.ok) {
      if (json.code === 'CATALOG_ALREADY_MAPPED') {
        showMessage('error', json.error);
        return;
      }

      showMessage('error', 'Sync failed');
      return;
    }

    setMappings(prev => {
      const otherDomains = prev.filter(
        m => m.chargeDomain !== selectedDomain
      );

      return [...otherDomains, ...json.mappings];
    });

    showMessage('success', 'Domain synced successfully');
  }

  const catalogDomainMap = useMemo(() => {
    const map: Record<string, string> = {};

    Object.entries(grouped).forEach(([domain, mappings]) => {
      mappings.forEach(m => {
        map[m.chargeCatalogId] = domain;
      });
    });

    return map;
  }, [grouped]);

  return (
    <>
      {contextHolder}

      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <DomainSelector
            selectedDomain={selectedDomain}
            grouped={grouped}
            setSelectedDomain={setSelectedDomain}
            setSelectedCatalogIds={setSelectedCatalogIds}
          />

          <CatalogSelector
            catalogs={catalogs}
            catalogDomainMap={catalogDomainMap}
            selectedDomain={selectedDomain}
            selectedCatalogIds={selectedCatalogIds}
            setSelectedCatalogIds={setSelectedCatalogIds}
          />

        </div>

        <div className="flex justify-end">
          <Button
            type="primary"
            size="large"
            loading={loading}
            onClick={handleSync}
            className="rounded-2xl px-8 font-semibold h-12"
          >
            Sync Domain
          </Button>
        </div>
      </div>
    </>
  );
}