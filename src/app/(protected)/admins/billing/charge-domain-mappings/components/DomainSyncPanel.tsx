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

      <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div className="border-b !border-[#E8E6E0] px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                Domain Sync
              </h2>
              <p className="mt-1 text-sm !text-[#767570]">
                Map charge catalogs to billing domains
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

          <div className="border-t !border-[#E8E6E0] pt-4">
            <button
              onClick={handleSync}
              disabled={loading}
              className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-6 text-xs font-semibold !text-white transition hover:!bg-[#16211B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/20 !border-t-white" />
                  Syncing...
                </>
              ) : (
                'Sync Domain'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}