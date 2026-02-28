'use client';

import { ChargeDomainMappingsQuery } from '@/shared/graphql/generated/graphql';

type Mapping =
  ChargeDomainMappingsQuery['chargeDomainMappings'][number];

interface Props {
  grouped: Record<string, Mapping[]>;
}

export default function DomainMappingGrid({ grouped }: Props) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {Object.entries(grouped).map(([domain, mappings]) => (
        <div
          key={domain}
          className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {domain.replace(/_/g, ' ')}
          </h3>

          {mappings.length === 0 ? (
            <p className="text-sm text-gray-400">
              No charge catalogs assigned.
            </p>
          ) : (
            <ul className="space-y-3">
              {mappings.map(m => (
                <li
                  key={m.id}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="font-medium text-gray-800">
                    {m.chargeCatalog.name}
                  </span>
                  <span className="text-gray-400">
                    {m.chargeCatalog.code}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}