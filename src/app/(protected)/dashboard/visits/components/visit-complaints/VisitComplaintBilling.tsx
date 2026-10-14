'use client';

import { useEffect, useState } from 'react';
import {
  BillingType,
  ChargeDomain,
  VisitChargeType,
} from '@/shared/graphql/generated/graphql';
import { useBilling } from '@/hooks/billing/useBilling';
import { useVisitChargeExists } from '@/hooks/billing/useVisitChargeExists';
import { clientFetch } from '@/lib/clientFetch';

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

  const { chargeExists, loading, refetch } = useVisitChargeExists({
    visitId,
    chargeDomain: ChargeDomain.Consultation,
    enabled: !!visitId,
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chargeExists) {
      setChargeEnabled(false);
      setChargeCatalogId('');
    }
  }, [chargeExists, setChargeEnabled, setChargeCatalogId]);

  const createVisitCharge = async () => {
    if (!chargeCatalogId) {
      setError('Please select a consultation charge type');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const res = await clientFetch('/api/visit-charge/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId,
          chargeCatalogId,
          chargeType: VisitChargeType.Fixed,
          billingType: BillingType.Fixed,
          chargeDomain: ChargeDomain.Consultation,
          quantity: 1,
          notes: 'Charge for consultation related to complaint',
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create consultation charge');
      }

      await refetch();
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to apply consultation charge');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-500">
        Checking consultation billing status...
      </p>
    );
  }

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm text-center sm:text-left">
          {error}
        </div>
      )}

      {chargeExists && (
        <div className="p-4 rounded-xl bg-yellow-50 text-yellow-700 text-sm text-center sm:text-left">
          Consultation billing has already been applied for this visit.
        </div>
      )}

      {!chargeExists && (
        <>
          <label className="flex items-center gap-3 cursor-pointer text-sm sm:text-base">
            <input
              type="checkbox"
              checked={chargeEnabled}
              onChange={(e) => {
                setChargeEnabled(e.target.checked);
                setChargeCatalogId('');
                setError(null);
              }}
              className="h-4 w-4 accent-[#1D9E75]"
            />
            <span className="text-gray-700">
              Apply consultation billing for this visit
            </span>
          </label>

          {chargeEnabled && (
            <>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Charges shown here come from billing catalogs mapped to the{' '}
                <span className="font-medium text-gray-700">
                  Consultation
                </span>{' '}
                domain. If no options appear, an administrator may need to
                configure or map consultation-related catalogs in the billing
                settings.
              </p>

              {catalogs?.length === 0 && (
                <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm">
                  No consultation charge catalogs are currently available.
                  Please contact an administrator to configure billing catalogs
                  for the Consultation domain.
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
                <select
                  value={chargeCatalogId}
                  disabled={creating || catalogs?.length === 0}
                  onChange={(e) => {
                    setChargeCatalogId(e.target.value);
                    setError(null);
                  }}
                  className="
                    w-full sm:w-80
                    px-4 py-3
                    rounded-xl
                    border border-[#E5EAE5]
                    bg-white
                    shadow-sm
                    text-[12px] text-[#353B34]
                    focus:ring-2 focus:ring-[#1D9E75]/15
                    focus:border-[#1D9E75]
                    outline-none
                    transition
                  "
                >
                  <option value="">Select consultation charge type</option>
                  {catalogs?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {`${cat.name} — ₦${cat.unitPrice.toLocaleString()}`}
                    </option>
                  ))}
                </select>

                <button
                  onClick={createVisitCharge}
                  disabled={!chargeCatalogId || creating}
                  className="
                    w-full sm:w-auto
                    px-5 py-3
                    rounded-xl
                    bg-[#1D9E75]
                    text-white!
                    text-sm sm:text-base
                    font-medium
                    shadow-md
                    hover:bg-[#178664]
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition
                    cursor-pointer
                    text-center
                  "
                >
                  {creating ? 'Applying...' : 'Apply Charge'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}