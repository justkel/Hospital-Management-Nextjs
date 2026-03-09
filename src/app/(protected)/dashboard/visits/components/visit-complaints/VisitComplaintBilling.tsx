'use client';

import { useEffect } from 'react';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';
import { useBilling } from '@/hooks/billing/useBilling';
import { useVisitChargeExists } from '@/hooks/billing/useVisitChargeExists';

interface Props {
  visitId: string;
  chargeEnabled: boolean;
  chargeCatalogId: string;
  setChargeEnabled: (value: boolean) => void;
  setChargeCatalogId: (value: string) => void;
}

export default function VisitComplaintBilling({
  visitId,
  chargeEnabled,
  chargeCatalogId,
  setChargeEnabled,
  setChargeCatalogId,
}: Props) {
  const { catalogs } = useBilling(ChargeDomain.Consultation);

  const { chargeExists, loading } = useVisitChargeExists({
    visitId,
    chargeDomain: ChargeDomain.Consultation,
    enabled: !!visitId,
  });

  useEffect(() => {
    if (chargeExists) {
      setChargeEnabled(false);
      setChargeCatalogId('');
    }
  }, [chargeExists, setChargeEnabled, setChargeCatalogId]);

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Checking consultation billing status...
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {chargeExists && (
        <div className="p-4 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
          Consultation billing has already been applied for this visit.
        </div>
      )}

      {!chargeExists && (
        <>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={chargeEnabled}
              onChange={e => {
                setChargeEnabled(e.target.checked);
                setChargeCatalogId('');
              }}
              className="w-4 h-4 accent-indigo-600"
            />

            <span className="text-sm text-gray-700">
              Apply consultation billing for this visit
            </span>
          </label>

          {chargeEnabled && (
            <select
              value={chargeCatalogId}
              onChange={e => setChargeCatalogId(e.target.value)}
              className="
              w-full md:w-80
              px-4 py-3
              rounded-xl
              border border-gray-200
              bg-white
              shadow-sm
              text-sm
              focus:ring-2 focus:ring-indigo-500
              focus:border-indigo-500
              outline-none
              transition
            "
            >
              <option value="">Select consultation charge type</option>

              {catalogs?.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </div>
  );
}