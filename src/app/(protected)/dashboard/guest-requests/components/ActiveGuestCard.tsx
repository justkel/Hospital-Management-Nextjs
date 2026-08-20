'use client';

import { Mail, Phone, Ban, Loader2, ShieldCheck } from 'lucide-react';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';
import type { GetActiveGuestsQuery } from '@/shared/graphql/generated/graphql';
import CountdownBadge from './CountdownBadge';
import { getInitials, getAvatarGradient } from './guestUi.helpers';

export type ActiveGuestRow = GetActiveGuestsQuery['activeGuests'][number];

export default function ActiveGuestCard({
  entry,
  actionLoading,
  onRevoke,
}: {
  entry: ActiveGuestRow;
  actionLoading: boolean;
  onRevoke: (requestId: string) => void;
}) {
  const guest = entry.guest;
  const fullName = `${guest?.firstName ?? ''} ${guest?.lastName ?? ''}`.trim() || 'Unknown guest';
  const gradient = getAvatarGradient(guest?.email ?? fullName);

  return (
    <div className="relative overflow-hidden rounded-2xl border !border-emerald-200/70 bg-gradient-to-br from-white to-emerald-50/40 p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3.5">
          <div className="relative shrink-0">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-sm font-bold !text-white shadow-sm`}
            >
              {getInitials(guest?.firstName, guest?.lastName)}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full !bg-white">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full !bg-emerald-500" />
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-bold !text-slate-900">{fullName}</span>
              <ShieldCheck size={13} className="shrink-0 !text-emerald-600" />
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
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2.5 sm:items-end">
          <CountdownBadge expiresAt={entry.expiresAt} approvedAt={entry.approvedAt} />

          <HasRoles roles={[Roles.ADMIN]}>
            <button
              type="button"
              disabled={actionLoading}
              onClick={() => onRevoke(entry.requestId)}
              className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-1.5 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
            >
              {actionLoading ? <Loader2 size={12} className="animate-spin" /> : <Ban size={12} />}
              Revoke access
            </button>
          </HasRoles>
        </div>
      </div>
    </div>
  );
}