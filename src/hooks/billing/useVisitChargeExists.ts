'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

interface Params {
  visitId?: string;
  chargeDomain: ChargeDomain;
  enabled?: boolean;
}

export function useVisitChargeExists({
  visitId,
  chargeDomain,
  enabled = true,
}: Params) {
  const [chargeExists, setChargeExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkCharge = useCallback(async () => {
    if (!visitId || !enabled) {
      setLoading(false);
      return;
    }

    try {
      const res = await clientFetch(
        `/api/visit-charge/charge-exists?visitId=${visitId}&chargeDomain=${chargeDomain}`
      );

      const json = await res.json();

      setChargeExists(Boolean(json?.exists));
    } catch (err) {
      console.error('Charge check failed:', err);
    } finally {
      setLoading(false);
    }
  }, [visitId, chargeDomain, enabled]);

  useEffect(() => {
    checkCharge();
  }, [checkCharge]);

  const markChargeCreated = () => {
    setChargeExists(true);
  };

  return {
    chargeExists,
    loading,
    markChargeCreated,
    refetch: checkCharge,
  };
}