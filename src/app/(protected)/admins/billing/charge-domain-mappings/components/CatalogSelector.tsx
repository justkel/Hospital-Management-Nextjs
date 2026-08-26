'use client';

import { Select } from 'antd';
import { useMemo } from 'react';
import {
  ChargeDomain,
  OrganizationChargeCatalogsQuery,
} from '@/shared/graphql/generated/graphql';

type Catalog =
  OrganizationChargeCatalogsQuery['organizationChargeCatalogs']['items'][number];

interface Props {
  catalogs: Catalog[];
  catalogDomainMap: Record<string, string>;
  selectedDomain: ChargeDomain | null;
  selectedCatalogIds: string[];
  setSelectedCatalogIds: React.Dispatch<
    React.SetStateAction<string[]>
  >;
}

export default function CatalogSelector({
  catalogs,
  catalogDomainMap,
  selectedDomain,
  selectedCatalogIds,
  setSelectedCatalogIds,
}: Props) {
  const catalogOptions = useMemo(() => {
    return catalogs.map(c => {
      const mappedDomain = catalogDomainMap[c.id];
      const inactive = !c.isActive;

      const alreadyMappedToSelectedDomain =
        mappedDomain === selectedDomain;

      const mappedToAnotherDomain =
        Boolean(mappedDomain) && mappedDomain !== selectedDomain;

      const disabled =
        mappedToAnotherDomain ||
        (inactive && !alreadyMappedToSelectedDomain);

      const isRed = inactive;

      return {
        value: c.id,
        disabled,
        label: (
          <span
            style={{
              color: isRed ? '#dc2626' : undefined,
              fontWeight: isRed ? 500 : undefined,
            }}
          >
            {c.name} • {c.code}
            {inactive && ' (inactive)'}
            {alreadyMappedToSelectedDomain && ' (synced)'}
          </span>
        ),
      };
    });
  }, [catalogs, catalogDomainMap, selectedDomain]);

  return (
    <div className="space-y-1.5 md:col-span-2">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        Assign Charge Catalogs
      </label>

      <Select
        size="large"
        mode="multiple"
        value={selectedCatalogIds}
        onChange={setSelectedCatalogIds}
        placeholder="Select charge catalogs"
        className="w-full"
        options={catalogOptions}
        tagRender={props => {
          const { label, closable, onClose } = props;

          return (
            <span className="inline-flex items-center gap-1 rounded-full !bg-[#F7F7F5] px-2.5 py-1 text-xs font-medium !text-[#5F5E5A] mr-1.5">
              {label}
              {closable && (
                <span
                  onClick={onClose}
                  className="ml-1 cursor-pointer !text-[#B4B2A9] hover:!text-[#DC2626] transition"
                >
                  ×
                </span>
              )}
            </span>
          );
        }}
      />
    </div>
  );
}