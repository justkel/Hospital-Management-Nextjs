'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';

export interface ChargeCatalogOption {
  id: string;
  name: string;
  unitPrice: number;
  currency: string;
}

interface ChargeCatalog {
  id: string;
  chargeCatalog: {
    id: string;
    name: string;
    unitPrice: number;
    currency: string;
  };
}

export function useBilling(domain: ChargeDomain) {
  const [catalogs, setCatalogs] = useState<ChargeCatalogOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalogs = useCallback(async () => {
    if (!domain) return;

    setLoading(true);

    try {
      const res = await clientFetch(
        `/api/charge-catalog/by-domain?domain=${domain}`
      );

      if (!res.ok) throw new Error('Failed to fetch catalogs');

      const json: { catalogs: ChargeCatalog[] } = await res.json();

      setCatalogs(
        (json.catalogs ?? []).map(c => ({
          id: c.chargeCatalog.id,
          name: c.chargeCatalog.name,
          unitPrice: Number(c.chargeCatalog.unitPrice),
          currency: c.chargeCatalog.currency,
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  return {
    catalogs,
    loading,
  };
}