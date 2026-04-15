'use client';

import { useMemo, useState } from 'react';
import {
  ChargeDomainMappingsQuery,
  OrganizationChargeCatalogsQuery,
} from '@/shared/graphql/generated/graphql';

import DomainSyncPanel from './components/DomainSyncPanel';
import DomainMappingGrid from './components/DomainMappingGrid';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

type Catalog =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs']['items'][number];

interface Props {
  mappings: Mapping[];
  catalogs: Catalog[];
}

export default function ChargeDomainMappingClient({
  mappings: initialMappings,
  catalogs,
}: Props) {
  const [mappings, setMappings] = useState<Mapping[]>(initialMappings);

  const grouped = useMemo(() => {
    const map: Record<string, Mapping[]> = {};

    mappings.forEach(m => {
      if (!map[m.chargeDomain]) map[m.chargeDomain] = [];
      map[m.chargeDomain].push(m);
    });

    return map;
  }, [mappings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Charge Domain Mapping
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Structure billing logic by assigning charge catalogs to billing domains.
          </p>
        </div>

        <DomainSyncPanel
          catalogs={catalogs}
          grouped={grouped}
          setMappings={setMappings}
        />

        <DomainMappingGrid grouped={grouped} />

      </div>
    </div>
  );
}