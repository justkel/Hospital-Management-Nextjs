'use client';

import { useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { SelectedCatalogSummaryProps } from './types';

export default function SelectedCatalogSummary({
  selectedCatalogs,
  selectedCatalogIds,
  removeCatalog,
  formatPrice,
}: SelectedCatalogSummaryProps) {
  const totalPrice = useMemo(() => {
    return selectedCatalogs.reduce(
      (sum, cat) => sum + Number(cat.unitPrice || 0),
      0
    );
  }, [selectedCatalogs]);

  if (!selectedCatalogs.length) return null;

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {selectedCatalogs.map(cat => (
          <div
            key={cat.id}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 max-w-full"
          >
            <span className="text-sm text-green-800 font-medium truncate">
              {cat.name}
            </span>

            <span className="text-xs text-green-700 whitespace-nowrap">
              ({formatPrice(cat.unitPrice, cat.currency)})
            </span>

            <button
              type="button"
              onClick={() => removeCatalog(cat.id)}
              className="text-green-700 hover:text-red-500 transition shrink-0"
            >
              <CloseOutlined className="text-xs" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-white px-5 py-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Total Charges
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-700">
            {formatPrice(totalPrice, selectedCatalogs[0]?.currency)}
          </p>
        </div>

        <div className="text-sm text-gray-500">
          {selectedCatalogIds.length} item
          {selectedCatalogIds.length > 1 ? 's' : ''} selected
        </div>
      </div>
    </>
  );
}