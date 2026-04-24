'use client';

import { useMemo, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';

export default function LabRequestSelector({
  catalogs,
}: any) {
  const [selectedCatalogId, setSelectedCatalogId] = useState('');

  const noCatalogs = !catalogs || catalogs.length === 0;

  const selectedCatalog = useMemo(
    () => catalogs?.find((c: any) => c.id === selectedCatalogId),
    [catalogs, selectedCatalogId]
  );

  const canProceed = !!selectedCatalogId && !noCatalogs;

  const formatPrice = (amount: number, currency: string) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`;
    }

    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="mt-8 border-t border-gray-100 pt-8 space-y-6 animate-fade-in">
      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
        Charges shown here come from billing catalogs mapped to the{' '}
        <span className="font-medium text-gray-700">Lab</span> domain.
        If no options appear, an administrator may need to configure or map
        lab-related catalogs in billing settings.
      </p>

      {noCatalogs && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
          No lab charge catalogs are currently available. Please contact an
          administrator to configure billing catalogs for Lab requests.
        </div>
      )}

      {!noCatalogs && (
        <div className="space-y-4">
          <div className="relative">
            <select
              value={selectedCatalogId}
              onChange={e => setSelectedCatalogId(e.target.value)}
              className="
                appearance-none w-full px-5 py-4 rounded-2xl border border-gray-200
                bg-white shadow-sm focus:ring-2 focus:ring-green-600
                focus:border-green-600 outline-none cursor-pointer text-sm
              "
            >
              <option value="">Select Lab Request Type</option>

              {catalogs?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} — {formatPrice(cat.unitPrice, cat.currency)}
                </option>
              ))}
            </select>

            <DownOutlined className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {selectedCatalog && (
            <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
              <p className="text-sm font-medium text-gray-800">
                {selectedCatalog.name}
              </p>
              <p className="text-sm text-green-700 mt-1">
                {formatPrice(
                  selectedCatalog.unitPrice,
                  selectedCatalog.currency
                )}
              </p>
            </div>
          )}

          <button
            disabled={!canProceed}
            className="
              w-full sm:w-auto px-8 py-4 rounded-2xl bg-green-600
              text-white! font-medium hover:bg-green-700
              disabled:bg-gray-300 disabled:cursor-not-allowed
              shadow-md transition
            "
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}