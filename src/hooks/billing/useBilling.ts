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

const catalogRequests = new Map<ChargeDomain, Promise<ChargeCatalogOption[]>>();

export function useBilling(domain: ChargeDomain, enabled = true) {
  const [catalogs, setCatalogs] = useState<ChargeCatalogOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCatalogs = useCallback(async () => {
    if (!domain || !enabled) return;

    setLoading(true);

    try {
      let request = catalogRequests.get(domain);
      if (!request) {
        request = clientFetch(`/api/charge-catalog/by-domain?domain=${domain}`)
          .then(async res => {
            if (!res.ok) throw new Error('Failed to fetch catalogs');
            const json: { catalogs: ChargeCatalog[] } = await res.json();
            const result = (json.catalogs ?? []).map(c => ({
              id: c.chargeCatalog.id,
              name: c.chargeCatalog.name,
              unitPrice: Number(c.chargeCatalog.unitPrice),
              currency: c.chargeCatalog.currency,
            }));
            return result;
          })
          .finally(() => catalogRequests.delete(domain));
        catalogRequests.set(domain, request);
      }

      setCatalogs(await request);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [domain, enabled]);

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  return {
    catalogs,
    loading,
  };
}