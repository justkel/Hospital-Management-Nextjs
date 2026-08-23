'use client';

import { useEffect, useState } from 'react';
import { Clock, TimerOff, Ban, Infinity as InfinityIcon } from 'lucide-react';
import { formatDuration } from './guestUi.helpers';

export default function CountdownBadge({
  expiresAt,
  approvedAt,
  disabled = false,
}: {
  expiresAt?: string | null;
  approvedAt?: string | null;
  disabled?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  // Org has guest access switched off — this overrides whatever the
  // request's own expiry says, since access is denied regardless of how
  // much time is technically left on the row (see
  // GuestAccessService.markRequestExpired's ORG_DISABLED no-op: the row
  // itself is never touched, so expiresAt/approvedAt stay accurate but
  // meaningless for access purposes while the flag is off).
  if (disabled) {
    return (
      <div className="flex min-w-[120px] flex-col gap-1">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold !bg-orange-100 !text-orange-700">
          <Ban size={11} />
          Access blocked
        </div>
      </div>
    );
  }

  if (!expiresAt) {
    return (
      <div className="flex min-w-[120px] flex-col gap-1">
        <div className="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold !bg-emerald-100 !text-emerald-700">
          <InfinityIcon size={11} />
          No expiry
        </div>
      </div>
    );
  }

  const expiresMs = new Date(expiresAt).getTime();
  const remaining = expiresMs - now;
  const isExpired = remaining <= 0;

  let percentLeft = 100;
  if (approvedAt) {
    const approvedMs = new Date(approvedAt).getTime();
    const total = expiresMs - approvedMs;
    if (total > 0) {
      percentLeft = Math.max(0, Math.min(100, (remaining / total) * 100));
    }
  }

  const isUrgent = !isExpired && percentLeft <= 25;

  return (
    <div className="flex min-w-[120px] flex-col gap-1">
      <div
        className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
          isExpired
            ? '!bg-slate-100 !text-slate-500'
            : isUrgent
            ? '!bg-amber-100 !text-amber-700'
            : '!bg-emerald-100 !text-emerald-700'
        }`}
      >
        {isExpired ? <TimerOff size={11} /> : <Clock size={11} />}
        {isExpired ? 'Expired' : formatDuration(remaining)}
      </div>
      {!isExpired && approvedAt && (
        <div className="h-1 w-full max-w-[120px] overflow-hidden rounded-full !bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isUrgent ? '!bg-amber-500' : '!bg-emerald-500'
            }`}
            style={{ width: `${percentLeft}%` }}
          />
        </div>
      )}
    </div>
  );
}