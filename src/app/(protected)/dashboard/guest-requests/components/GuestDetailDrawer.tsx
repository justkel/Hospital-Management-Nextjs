'use client';

import { useEffect, useState } from 'react';
import { Drawer } from 'antd';
import { Mail, Phone, Calendar, UserCheck, UserX, Ban, Loader2, FileText, ShieldAlert } from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import type { GetGuestRequestQuery } from '@/shared/graphql/generated/graphql';
import { getInitials, getAvatarGradient, formatDateTime } from './guestUi.helpers';

type GuestRequestDetail = GetGuestRequestQuery['guestRequest'];

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon size={15} className="mt-0.5 shrink-0 !text-slate-400" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide !text-slate-400">
          {label}
        </p>
        <p className="text-sm !text-slate-700">{value}</p>
      </div>
    </div>
  );
}

export default function GuestDetailDrawer({
  requestId,
  guestAccessEnabled,
  onClose,
}: {
  requestId: string | null;
  guestAccessEnabled: boolean;
  onClose: () => void;
}) {
  const [detail, setDetail] = useState<GuestRequestDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!requestId) {
      setDetail(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    clientFetch(`/api/guest-requests/detail?id=${requestId}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.guestRequest) {
          setDetail(json.guestRequest);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const guest = detail?.guest;
  const fullName = guest ? `${guest.firstName} ${guest.lastName}` : '';
  const gradient = getAvatarGradient(guest?.email ?? fullName);

  const isExpired =
    !!detail?.expiresAt && new Date(detail.expiresAt).getTime() < Date.now();
  const isBlockedByOrg =
    !!detail && detail.status === 'APPROVED' && !isExpired && !guestAccessEnabled;

  return (
    <Drawer open={!!requestId} onClose={onClose} title="Guest request details" width={420}>
      {loading || !detail ? (
        <div className="flex h-40 items-center justify-center">
          <Loader2 size={22} className="animate-spin !text-slate-300" />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center gap-3.5 rounded-2xl border !border-slate-100 !bg-slate-50/60 p-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-base font-bold !text-white shadow-sm`}
            >
              {getInitials(guest?.firstName, guest?.lastName)}
            </div>
            <div>
              <p className="text-sm font-bold !text-slate-900">{fullName}</p>
              <p className="text-xs !text-slate-500">
                Guest status: <span className="font-semibold">{guest?.status ?? '—'}</span>
              </p>
            </div>
          </div>

          {isBlockedByOrg && (
            <div className="flex items-start gap-2.5 rounded-xl border !border-orange-200 !bg-orange-50 px-3.5 py-3">
              <ShieldAlert size={15} className="mt-0.5 shrink-0 !text-orange-600" />
              <p className="text-xs !text-orange-800">
                This request is still marked approved and unexpired, but guest access is
                currently disabled for your organization, so this guest cannot log in.
              </p>
            </div>
          )}

          <div className="divide-y !divide-slate-100 rounded-2xl border !border-slate-100 px-4">
            <Row icon={Mail} label="Email" value={guest?.email} />
            <Row icon={Phone} label="Phone" value={guest?.phone} />
            <Row icon={FileText} label="Reason for visit" value={detail.reasonForVisit} />
            <Row icon={Calendar} label="Requested" value={formatDateTime(detail.requestedAt)} />
            <Row icon={UserCheck} label="Reviewed" value={formatDateTime(detail.reviewedAt)} />
            <Row icon={UserCheck} label="Approved" value={formatDateTime(detail.approvedAt)} />
            <Row
              icon={Calendar}
              label="Expires"
              value={detail.expiresAt ? formatDateTime(detail.expiresAt) : 'No expiry (permanent)'}
            />
            <Row icon={UserX} label="Rejection reason" value={detail.rejectionReason} />
            <Row icon={Ban} label="Revoked" value={formatDateTime(detail.revokedAt)} />
          </div>

          <div
            className={`rounded-xl px-3.5 py-3 text-center text-xs font-bold uppercase tracking-wide ${
              isBlockedByOrg ? '!bg-orange-50 !text-orange-700' : '!bg-blue-50 !text-blue-700'
            }`}
          >
            Status: {isBlockedByOrg ? 'BLOCKED (org disabled)' : detail.status}
          </div>
        </div>
      )}
    </Drawer>
  );
}