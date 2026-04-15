'use client';

import { Select } from 'antd';
import {
  ChargeDomain,
  ChargeDomainMappingsQuery,
} from '@/shared/graphql/generated/graphql';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

interface Props {
  selectedDomain: ChargeDomain | null;
  grouped: Record<string, Mapping[]>;
  setSelectedDomain: React.Dispatch<
    React.SetStateAction<ChargeDomain | null>
  >;
  setSelectedCatalogIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export default function DomainSelector({
  selectedDomain,
  grouped,
  setSelectedDomain,
  setSelectedCatalogIds,
}: Props) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700">
        Select Domain
      </label>

      <Select
        size="large"
        showSearch={{ optionFilterProp: 'label' }}
        placeholder="Choose billing domain"
        className="w-full"
        value={selectedDomain ?? undefined}
        onChange={value => {
          setSelectedDomain(value);

          const existing =
            grouped[value]?.map(m => m.chargeCatalogId) || [];

          setSelectedCatalogIds(existing);
        }}
        options={Object.values(ChargeDomain).map(domain => ({
          label: domain.replace(/_/g, ' '),
          value: domain,
        }))}
      />
    </div>
  );
}