'use client';

import { ChargeDomainMappingsQuery } from '@/shared/graphql/generated/graphql';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

interface Props {
  grouped: Record<string, Mapping[]>;
}

export default function DomainMappingGrid({ grouped }: Props) {
  const visibleDomains = Object.entries(grouped).filter(
    (entry) => entry[1].length > 0
  );

  if (visibleDomains.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border !border-[#E8E6E0] !bg-white py-16 text-center">
        <p className="mt-4 text-sm font-medium !text-[#B4B2A9]">
          No charge domains configured yet.
        </p>
        <p className="mt-1 text-xs !text-[#B4B2A9]">
          Create mappings to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visibleDomains.map(([domain, mappings]) => (
        <div
          key={domain}
          className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition hover:!border-[#D3D1C7]"
        >
          <div className="border-b !border-[#E8E6E0] px-4 py-3.5 sm:px-5 sm:py-4">
            <h3 className="text-sm font-semibold !text-[#16211B]">
              {domain.replace(/_/g, ' ')}
            </h3>
            <p className="text-[10px] !text-[#767570]">
              {mappings.length} catalog{mappings.length !== 1 && 's'}
            </p>
          </div>

          <div className="divide-y !divide-[#F0EFE9]">
            {mappings.map(m => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5"
              >
                <span className="truncate text-sm font-medium !text-[#16211B]">
                  {m.chargeCatalog.name}
                </span>
                <span className="shrink-0 rounded-full !bg-[#F7F7F5] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
                  {m.chargeCatalog.code}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}