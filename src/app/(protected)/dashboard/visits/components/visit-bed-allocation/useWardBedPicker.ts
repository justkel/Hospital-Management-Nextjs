'use client';

import { useEffect, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import {
  BedStatus,
  GetBedsQuery,
  GetWardsQuery,
  WardClass,
  WardDepartment,
} from '@/shared/graphql/generated/graphql';

export type WardOption = GetWardsQuery['wards']['items'][number];
export type BedOption = GetBedsQuery['beds']['items'][number];

interface Options {
  excludeBedId?: string;
}

export function useWardBedPicker({ excludeBedId }: Options = {}) {
  const [department, setDepartment] = useState<WardDepartment | ''>('');
  const [wardClass, setWardClass] = useState<WardClass | ''>('');

  const [wards, setWards] = useState<WardOption[]>([]);
  const [loadingWards, setLoadingWards] = useState(true);
  const [selectedWardId, setSelectedWardId] = useState('');

  const [beds, setBeds] = useState<BedOption[]>([]);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [selectedBedId, setSelectedBedId] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchWards = async () => {
      setLoadingWards(true);
      try {
        const params = new URLSearchParams({
          page: '1',
          limit: '100',
          isActive: 'true',
        });

        if (department) params.append('department', department);
        if (wardClass) params.append('wardClass', wardClass);

        const res = await clientFetch(`/api/ward/list?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || cancelled) return;

        setWards(json.wards.items ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingWards(false);
      }
    };

    fetchWards();
    return () => {
      cancelled = true;
    };
  }, [department, wardClass]);

  useEffect(() => {
    if (!selectedWardId) {
      setBeds([]);
      setSelectedBedId('');
      return;
    }

    let cancelled = false;

    const fetchBeds = async () => {
      setLoadingBeds(true);
      try {
        const params = new URLSearchParams({
          wardId: selectedWardId,
          page: '1',
          limit: '100',
          status: BedStatus.Available,
          isActive: 'true',
        });

        const res = await clientFetch(`/api/bed/list?${params.toString()}`);
        const json = await res.json();
        if (!res.ok || cancelled) return;

        const items: BedOption[] = json.beds.items ?? [];

        setBeds(
          excludeBedId ? items.filter(b => b.id !== excludeBedId) : items
        );
        setSelectedBedId('');
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoadingBeds(false);
      }
    };

    fetchBeds();
    return () => {
      cancelled = true;
    };
  }, [selectedWardId, excludeBedId]);

  const reset = () => {
    setDepartment('');
    setWardClass('');
    setSelectedWardId('');
    setSelectedBedId('');
  };

  return {
    department,
    setDepartment,
    wardClass,
    setWardClass,
    wards,
    loadingWards,
    selectedWardId,
    setSelectedWardId,
    beds,
    loadingBeds,
    selectedBedId,
    setSelectedBedId,
    reset,
  };
}