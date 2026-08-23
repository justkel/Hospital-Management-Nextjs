'use client';

import {
  Clock,
  CheckCircle2,
  XCircle,
  Ban,
  TimerOff,
  ShieldAlert,
  Mail,
  Phone,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Loader2,
} from 'lucide-react';

import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';
import { GuestRequestStatus, type GetGuestRequestsQuery } from '@/shared/graphql/generated/graphql';
import CountdownBadge from './CountdownBadge';
import { getInitials, getAvatarGradient, formatDateTime } from './guestUi.helpers';

export type GuestRequestRow = GetGuestRequestsQuery['guestRequests'][number];

const STATUS_META: Record<
  string,
  { label: string; icon: typeof Clock; badgeClass: string }
> = {
  PENDING: { label: 'Pending review', icon: Clock, badgeClass: '!bg-amber-100 !text-amber-700' },
  APPROVED: { label: 'Approved', icon: CheckCircle2, badgeClass: '!bg-emerald-100 !text-emerald-700' },
  REJECTED: { label: 'Rejected', icon: XCircle, badgeClass: '!bg-red-100 !text-red-700' },
  REVOKED: { label: 'Revoked', icon: Ban, badgeClass: '!bg-slate-200 !text-slate-600' },
  EXPIRED: { label: 'Expired', icon: TimerOff, badgeClass: '!bg-slate-100 !text-slate-500' },
  BLOCKED: { label: 'Blocked (org disabled)', icon: ShieldAlert, badgeClass: '!bg-orange-100 !text-orange-700' },
};

// 'BLOCKED' isn't a real GuestRequestStatus value — it's derived purely
// from the org's feature flag. The GuestRequest row is never mutated
// when the flag is off (see GuestAccessService.markRequestExpired's
// ORG_DISABLED no-op), so this has to be computed here rather than read
// off request.status.
function getEffectiveStatus(request: GuestRequestRow, guestAccessEnabled: boolean): string {
  if (request.status === GuestRequestStatus.Approved) {
    const isExpired =
      !!request.expiresAt && new Date(request.expiresAt).getTime() < Date.now();

    if (isExpired) return GuestRequestStatus.Expired;
    if (!guestAccessEnabled) return 'BLOCKED';
  }
  return request.status;
}

export default function RequestCard({
  request,
  actionLoading,
  guestAccessEnabled,
  onApprove,
  onReject,
  onRevoke,
  onRestore,
  onViewDetail,
}: {
  request: GuestRequestRow;
  actionLoading: boolean;
  guestAccessEnabled: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRevoke: (id: string) => void;
  onRestore: (id: string) => void;
  onViewDetail: (id: string) => void;
}) {
  const guest = request.guest;
  const effectiveStatus = getEffectiveStatus(request, guestAccessEnabled);
  const meta = STATUS_META[effectiveStatus] ?? STATUS_META.PENDING;
  const Icon = meta.icon;
  const fullName = `${guest?.firstName ?? ''} ${guest?.lastName ?? ''}`.trim() || 'Unknown guest';
  const gradient = getAvatarGradient(guest?.email ?? fullName);

  const isActiveApproved = effectiveStatus === 'APPROVED';
  const isBlockedByOrg = effectiveStatus === 'BLOCKED';
  const showCountdown = isActiveApproved || isBlockedByOrg;
  // The request row is still APPROVED underneath a BLOCKED display state,
  // so revoking it still makes sense (and still works, since revoke() is
  // never flag-gated on the backend).
  const canRevoke = isActiveApproved || isBlockedByOrg;
  const isRestorable = effectiveStatus === 'REVOKED' || effectiveStatus === 'EXPIRED';

  return (
    <div className="group relative overflow-hidden rounded-2xl border !border-slate-200/70 !bg-white/90 p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <button
          type="button"
          onClick={() => onViewDetail(request.id)}
          className="flex min-w-0 flex-1 items-start gap-3.5 text-left"
        >
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-bold !text-white shadow-sm`}
          >
            {getInitials(guest?.firstName, guest?.lastName)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-bold !text-slate-900">{fullName}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.badgeClass}`}
              >
                <Icon size={11} />
                {meta.label}
              </span>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs !text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Mail size={11} />
                {guest?.email ?? '—'}
              </span>
              {guest?.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone size={11} />
                  {guest.phone}
                </span>
              )}
            </div>

            <p className="mt-1.5 line-clamp-1 text-xs !text-slate-400">{request.reasonForVisit}</p>

            <p className="mt-1 text-[11px] !text-slate-400">
              Requested {formatDateTime(request.requestedAt)}
            </p>

            {effectiveStatus === 'REJECTED' && request.rejectionReason && (
              <p className="mt-1.5 rounded-lg !bg-red-50 px-2.5 py-1.5 text-[11px] !text-red-600">
                {request.rejectionReason}
              </p>
            )}
          </div>
        </button>

        <div className="flex shrink-0 flex-col items-start gap-2.5 sm:items-end">
          {showCountdown && (
            <CountdownBadge
              expiresAt={request.expiresAt}
              approvedAt={request.approvedAt}
              disabled={isBlockedByOrg}
            />
          )}

          <HasRoles roles={[Roles.ADMIN]}>
            <div className="flex flex-wrap gap-2">
              {effectiveStatus === 'PENDING' && (
                <>
                  <button
                    type="button"
                    disabled={actionLoading || !guestAccessEnabled}
                    title={!guestAccessEnabled ? 'Guest access is disabled for this organization' : undefined}
                    onClick={() => onApprove(request.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg !bg-emerald-600 px-3 py-1.5 text-xs font-bold !text-white transition hover:!bg-emerald-700 disabled:opacity-60"
                  >
                    {actionLoading ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <ThumbsUp size={12} />
                    )}
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => onReject(request.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-1.5 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
                  >
                    <ThumbsDown size={12} />
                    Reject
                  </button>
                </>
              )}

              {canRevoke && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onRevoke(request.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-1.5 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Ban size={12} />
                  )}
                  Revoke
                </button>
              )}

              {isRestorable && (
                <button
                  type="button"
                  disabled={actionLoading || !guestAccessEnabled}
                  title={!guestAccessEnabled ? 'Guest access is disabled for this organization' : undefined}
                  onClick={() => onRestore(request.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border !border-emerald-300 !bg-emerald-50 px-3 py-1.5 text-xs font-bold !text-emerald-700 transition hover:!bg-emerald-100 disabled:opacity-60"
                >
                  {actionLoading ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RotateCcw size={12} />
                  )}
                  Restore
                </button>
              )}
            </div>
          </HasRoles>

          <button
            type="button"
            onClick={() => onViewDetail(request.id)}
            className="inline-flex items-center gap-0.5 text-[11px] font-medium !text-slate-400 transition hover:!text-slate-600"
          >
            Details
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}