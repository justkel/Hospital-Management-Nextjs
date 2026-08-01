'use client';

import { useEffect, useReducer, useState } from 'react';
import { Modal } from 'antd';
import {
  BedDouble,
  ArrowRightLeft,
  DoorOpen,
  CheckCircle2,
  User,
  Timer,
} from 'lucide-react';
import { VisitBedAllocationStatus } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
import { BedAllocationItem } from './VisitBedAllocationsSection';
import { STATUS_STYLES, formatStatusLabel } from './bedAllocationStatus';

const MISTAKE_WINDOW_SECONDS = 5 * 60;

function useMistakeWindowCountdown(allocatedAt: string) {
  const [, tick] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return computeRemaining(allocatedAt);
}

function computeRemaining(allocatedAt: string) {
  const elapsedSeconds = (Date.now() - new Date(allocatedAt).getTime()) / 1000;
  return Math.max(0, Math.round(MISTAKE_WINDOW_SECONDS - elapsedSeconds));
}

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface Props {
  allocation: BedAllocationItem;
  actionLoading: boolean;
  onOccupy: () => void;
  onRelease: (reason?: string) => void;
  onTransferClick: () => void;
}

export default function ActiveBedAllocationCard({
  allocation,
  actionLoading,
  onOccupy,
  onRelease,
  onTransferClick,
}: Props) {
  const remaining = useMistakeWindowCountdown(allocation.allocatedAt);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [releaseReason, setReleaseReason] = useState('');

  const style = STATUS_STYLES[allocation.status];
  const isReserved = allocation.status === VisitBedAllocationStatus.Reserved;
  const withinMistakeWindow = remaining > 0;

  const handleOccupyClick = () => {
    Modal.confirm({
      title: 'Mark bed as occupied?',
      content:
        'Confirms the patient has physically moved into this bed.',
      okText: 'Mark occupied',
      onOk: onOccupy,
    });
  };

  const handleReleaseConfirm = () => {
    onRelease(releaseReason.trim() || undefined);
    setReleaseOpen(false);
    setReleaseReason('');
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-teal-100 bg-white shadow-sm">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-50 blur-3xl" />

      <div className="relative flex flex-col gap-5 p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 shadow-sm">
              <BedDouble size={24} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-lg font-bold text-slate-900">
                  {allocation.bed?.name}
                </h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                  {allocation.bed?.bedCode}
                </span>
              </div>

              <p className="mt-0.5 text-sm text-slate-500">
                {allocation.bed?.class} accommodation
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${style.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            {formatStatusLabel(allocation.status)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Timer size={15} className="shrink-0 text-slate-400" />
            Allocated {formatDateTime(allocation.allocatedAt)}
          </div>

          {allocation.allocatedBy && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <User size={15} className="shrink-0 text-slate-400" />
              By {allocation.allocatedBy.fullName}
            </div>
          )}
        </div>

        {allocation.reason && (
          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <span className="font-medium text-slate-700">Reason: </span>
            {allocation.reason}
          </p>
        )}

        {withinMistakeWindow && (
          <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-700">
            <Timer size={14} className="shrink-0" />
            Releasing now voids the charge — voidable for{' '}
            {formatCountdown(remaining)} more
          </div>
        )}

        <div className="flex flex-col gap-2.5 pt-1 sm:flex-row sm:flex-wrap">
          {isReserved && (
            <button
              disabled={actionLoading}
              onClick={handleOccupyClick}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white! shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 size={16} />
              Mark occupied
            </button>
          )}

          <button
            disabled={actionLoading}
            onClick={onTransferClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <ArrowRightLeft size={16} />
            Transfer
          </button>

          <button
            disabled={actionLoading}
            onClick={() => setReleaseOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <DoorOpen size={16} />
            Release
          </button>
        </div>
      </div>

      <Modal
        open={releaseOpen}
        onCancel={() => setReleaseOpen(false)}
        onOk={handleReleaseConfirm}
        okText="Release bed"
        okButtonProps={{
          danger: true,
          loading: actionLoading,
        }}
        title="Release this bed"
      >
        <div className="space-y-3 pt-1">
          {withinMistakeWindow ? (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
              This allocation was created less than 5 minutes ago — its
              charge will be voided automatically.
            </p>
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              This bed has been allocated for a while — its charge will
              remain on the visit.
            </p>
          )}

          <textarea
            placeholder="Reason (optional)"
            className="min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100"
            value={releaseReason}
            onChange={e => setReleaseReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}