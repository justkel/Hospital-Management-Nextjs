'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import { clientFetch } from '@/lib/clientFetch';
import { useBilling } from '@/hooks/billing/useBilling';
import {
  ChargeDomain,
  GetBedAllocationsByVisitQuery,
  VisitBedAllocationStatus,
} from '@/shared/graphql/generated/graphql';
import BedAllocationForm from './BedAllocationForm';
import ActiveBedAllocationCard from './ActiveBedAllocationCard';
import TransferBedAllocationDrawer from './TransferBedAllocationDrawer';
import BedJourneyTimeline from './BedJourneyTimeline';
import { ACTIVE_STATUSES } from './bedAllocationStatus';
import { Skeleton } from 'antd';
import { scheduledFetch } from '@/lib/requestScheduler';
import { useInView } from '@/lib/useInView';

export type BedAllocationItem =
  GetBedAllocationsByVisitQuery['bedAllocationsByVisit'][number];

interface Props {
  visitId: string;
}

const FETCH_PRIORITY = 5;

export default function VisitBedAllocationsSection({ visitId }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>();

  const [allocations, setAllocations] = useState<BedAllocationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const { catalogs } = useBilling(ChargeDomain.Bed);

  const fetchAllocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await scheduledFetch(
        () => clientFetch(
          `/api/bed-allocation/list?visitId=${visitId}`,
          {},
          { skipRateLimitRetry: true }
        ),
        FETCH_PRIORITY
      );

      if (!res.ok) throw new Error('Failed to fetch bed allocations');

      const json: { bedAllocations: BedAllocationItem[] } = await res.json();
      setAllocations(json.bedAllocations ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    if (!inView) return;
    fetchAllocations();
  }, [inView, visitId]);

  const activeAllocation = useMemo(
    () => allocations.find(a => ACTIVE_STATUSES.includes(a.status)),
    [allocations]
  );

  const handleCreate = async (payload: {
    bedId: string;
    chargeCatalogId: string;
    reason?: string;
  }) => {
    setCreating(true);
    try {
      const res = await clientFetch('/api/bed-allocation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId,
          bedId: payload.bedId,
          chargeCatalogId: payload.chargeCatalogId,
          reason: payload.reason,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        message.error(json?.error || 'Failed to allocate bed');
        return;
      }

      message.success('Bed allocated');
      await fetchAllocations();
    } catch (err) {
      console.error(err);
      message.error('Failed to allocate bed');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (
    allocationId: string,
    status: VisitBedAllocationStatus,
    reason?: string
  ) => {
    setActionLoading(true);
    try {
      const res = await clientFetch('/api/bed-allocation/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ allocationId, status, reason }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        message.error(json?.error || 'Failed to update allocation');
        return;
      }

      message.success(
        status === VisitBedAllocationStatus.Occupied
          ? 'Bed marked occupied'
          : 'Bed released'
      );
      await fetchAllocations();
    } catch (err) {
      console.error(err);
      message.error('Failed to update allocation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOccupy = () => {
    if (!activeAllocation) return;
    updateStatus(activeAllocation.id, VisitBedAllocationStatus.Occupied);
  };

  const handleRelease = (reason?: string) => {
    if (!activeAllocation) return;
    updateStatus(activeAllocation.id, VisitBedAllocationStatus.Released, reason);
  };

  const handleTransfer = async (payload: {
    newBedId: string;
    chargeCatalogId: string;
    newStatus?: VisitBedAllocationStatus;
    reason?: string;
  }) => {
    if (!activeAllocation) return;

    setTransferring(true);
    try {
      const res = await clientFetch('/api/bed-allocation/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allocationId: activeAllocation.id,
          newBedId: payload.newBedId,
          chargeCatalogId: payload.chargeCatalogId,
          newStatus: payload.newStatus,
          reason: payload.reason,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        message.error(json?.error || 'Failed to transfer bed allocation');
        return;
      }

      message.success('Bed allocation transferred');
      setTransferOpen(false);
      await fetchAllocations();
    } catch (err) {
      console.error(err);
      message.error('Failed to transfer bed allocation');
    } finally {
      setTransferring(false);
    }
  };

  const showLoading = !inView || loading;

  return (
    <div ref={ref} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900">
          Bed allocation
        </h2>
      </div>

      {showLoading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : activeAllocation ? (
        <ActiveBedAllocationCard
          allocation={activeAllocation}
          actionLoading={actionLoading}
          onOccupy={handleOccupy}
          onRelease={handleRelease}
          onTransferClick={() => setTransferOpen(true)}
        />
      ) : (
        <BedAllocationForm
          catalogs={catalogs}
          submitting={creating}
          onCreate={handleCreate}
        />
      )}

      <BedJourneyTimeline allocations={allocations} loading={showLoading} />

      {activeAllocation && (
        <TransferBedAllocationDrawer
          open={transferOpen}
          onClose={() => setTransferOpen(false)}
          allocation={activeAllocation}
          catalogs={catalogs}
          submitting={transferring}
          onTransfer={handleTransfer}
        />
      )}
    </div>
  );
}