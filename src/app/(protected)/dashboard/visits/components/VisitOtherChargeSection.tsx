'use client';

import { useState } from 'react';
import {
  BillingType,
  ChargeDomain,
  VisitChargeType,
} from '@/shared/graphql/generated/graphql';
import { useBilling } from '@/hooks/billing/useBilling';
import { clientFetch } from '@/lib/clientFetch';

interface Props {
  visitId: string;
}

export default function VisitOtherChargeSection({ visitId }: Props) {
  const { catalogs } = useBilling(ChargeDomain.Other);

  const [chargeCatalogId, setChargeCatalogId] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createVisitCharge = async () => {
    if (!chargeCatalogId) {
      setError('Please select a charge type');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      setSuccess(false);

      const res = await clientFetch('/api/visit-charge/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId,
          chargeCatalogId,
          chargeType: VisitChargeType.Variable,
          billingType: BillingType.Manual,
          chargeDomain: ChargeDomain.Other,
          quantity: 1,
          notes: 'Other charge for visit',
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create charge');
      }

      setChargeCatalogId('');
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to apply charge');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-lg mx-auto px-2 sm:px-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm text-center sm:text-left">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 text-green-700 text-sm text-center sm:text-left">
          Charge applied successfully.
        </div>
      )}

      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
        Charges shown here come from billing catalogs mapped to the{' '}
        <span className="font-medium text-gray-700">Other</span> domain. If no
        options appear, an administrator may need to configure or map catalogs
        for the Other domain.
      </p>

      {catalogs?.length === 0 && (
        <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm">
          No charge catalogs are currently available. Please contact an
          administrator to configure billing catalogs for the Other domain.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
        <select
          value={chargeCatalogId}
          disabled={creating || catalogs?.length === 0}
          onChange={(e) => {
            setChargeCatalogId(e.target.value);
            setError(null);
            setSuccess(false);
          }}
          className="
            w-full sm:w-80
            px-4 py-3
            rounded-xl
            border border-gray-300
            bg-white
            shadow-sm
            text-sm sm:text-base
            focus:ring-2 focus:ring-indigo-500
            focus:border-indigo-500
            outline-none
            transition
          "
        >
          <option value="">Select charge type</option>
          {catalogs?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
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
            bg-indigo-600
            text-white!
            text-sm sm:text-base
            font-medium
            shadow-md
            hover:bg-indigo-700
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
    </div>
  );
}