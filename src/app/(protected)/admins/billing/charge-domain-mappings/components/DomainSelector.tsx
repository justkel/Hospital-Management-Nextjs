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

const AVAILABLE_DOMAINS: ChargeDomain[] = [
  ChargeDomain.Bed,
  ChargeDomain.Consultation,
  ChargeDomain.Diagnosis,
  ChargeDomain.Lab,
  ChargeDomain.Other,
  ChargeDomain.Procedure,
  ChargeDomain.Vitals,
];

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
        showSearch={{
          optionFilterProp: 'label',
        }}
        placeholder="Choose billing domain"
        className="w-full"
        value={selectedDomain ?? undefined}
        onChange={(value: ChargeDomain) => {
          setSelectedDomain(value);

          const existing =
            grouped[value]?.map((m) => m.chargeCatalogId) || [];

          setSelectedCatalogIds(existing);
        }}
        options={AVAILABLE_DOMAINS.map((domain) => ({
          label: domain.replace(/_/g, ' ').toUpperCase(),
          value: domain,
        }))}
      />
    </div>
  );
}