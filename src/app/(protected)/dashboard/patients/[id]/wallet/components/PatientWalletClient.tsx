'use client';

import { useEffect, useState } from 'react';
import { Modal, Input, message } from 'antd';
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  CircleDollarSign,
  Gift,
  Loader2,
  ThumbsDown,
  ThumbsUp,
  Wallet,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from '@/app/(protected)/dashboard/visits/[id]/billing/components/StatusBadge';
import type { GetPatientWalletTransactionsQuery } from '@/shared/graphql/generated/graphql';

export type WalletTransactionRow =
  GetPatientWalletTransactionsQuery['patientWalletTransactions'][number];

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const TYPE_META: Record<
  string,
  { label: string; sign: '+' | '−'; icon: typeof Gift; badgeClass: string }
> = {
  GRANT: {
    label: 'Grant',
    sign: '+',
    icon: Gift,
    badgeClass: '!bg-blue-100 !text-blue-700',
  },
  TRANSFER_IN: {
    label: 'Transfer from visit credit',
    sign: '+',
    icon: ArrowDownCircle,
    badgeClass: '!bg-emerald-100 !text-emerald-700',
  },
  SPEND: {
    label: 'Spent on visit',
    sign: '−',
    icon: ArrowUpCircle,
    badgeClass: '!bg-slate-100 !text-slate-600',
  },
};

interface GrantForm {
  amount: string;
  reason: string;
  notes?: string;
}

const EMPTY_GRANT_FORM: GrantForm = { amount: '', reason: '' };

export default function PatientWalletClient({
  patientId,
  initialBalance,
  initialTransactions,
}: {
  patientId: string;
  initialBalance: number;
  initialTransactions: WalletTransactionRow[];
}) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [transactions, setTransactions] =
    useState<WalletTransactionRow[]>(initialTransactions);

  const [grantFormOpen, setGrantFormOpen] = useState(false);
  const [grantForm, setGrantForm] = useState<GrantForm>(EMPTY_GRANT_FORM);
  const [submittingGrant, setSubmittingGrant] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const refreshBalance = async () => {
    const res = await clientFetch(
      `/api/patient-wallet/balance?patientId=${patientId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.balance !== undefined) {
      setBalance(json.balance);
    }
  };

  const refreshTransactions = async () => {
    const res = await clientFetch(
      `/api/patient-wallet/list?patientId=${patientId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.transactions) {
      setTransactions(json.transactions);
    }
  };

  useEffect(() => {
    refreshBalance();
    refreshTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const openGrantForm = () => {
    setGrantForm(EMPTY_GRANT_FORM);
    setGrantFormOpen(true);
  };

  const submitGrant = async () => {
    if (!grantForm.amount || Number(grantForm.amount) <= 0) {
      message.error('Enter a valid amount');
      return;
    }

    if (!grantForm.reason.trim()) {
      message.error('A reason is required');
      return;
    }

    setSubmittingGrant(true);

    try {
      const res = await clientFetch('/api/patient-wallet/request-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          amount: Number(grantForm.amount),
          reason: grantForm.reason.trim(),
          notes: grantForm.notes?.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to request grant');
        return;
      }

      message.success('Grant requested');
      setGrantFormOpen(false);
      await refreshTransactions();
    } finally {
      setSubmittingGrant(false);
    }
  };

  const approveGrant = async (transactionId: string) => {
    setActionLoadingId(transactionId);

    try {
      const res = await clientFetch('/api/patient-wallet/approve-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to approve grant');
        return;
      }

      message.success('Grant approved');
      await Promise.all([refreshTransactions(), refreshBalance()]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitReject = async () => {
    if (!rejectTarget) return;

    if (!rejectReason.trim()) {
      message.error('A reason is required to reject');
      return;
    }

    setActionLoadingId(rejectTarget);

    try {
      const res = await clientFetch('/api/patient-wallet/reject-grant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: rejectTarget,
          reason: rejectReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to reject grant');
        return;
      }

      message.success('Grant rejected');
      setRejectTarget(null);
      setRejectReason('');
      await refreshTransactions();
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen !bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
            <Wallet size={13} />
            Patient wallet
          </div>
          <h1 className="text-2xl font-semibold tracking-tight !text-slate-900 sm:text-3xl">
            Wallet balance
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-slate-500">
            Goodwill grants, credit transferred in from visits, and spending
            toward future charges — all recorded here.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border !border-slate-200/70 !bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl !bg-blue-100 !text-blue-600">
                <CircleDollarSign size={22} />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                  Current balance
                </p>
                <p className="text-2xl font-bold !text-slate-900">
                  {formatCurrency(balance)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openGrantForm}
              className="inline-flex items-center gap-2 rounded-2xl !bg-blue-600 px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:!bg-blue-700"
            >
              <Gift size={15} />
              Request grant
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold !text-slate-800">
            {transactions.length} transaction
            {transactions.length === 1 ? '' : 's'}
          </h2>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
              <Wallet size={32} className="!text-slate-300" />
              <h3 className="mt-4 text-base font-bold !text-slate-700">
                No wallet activity yet
              </h3>
              <p className="mt-1 max-w-sm text-sm !text-slate-500">
                Grants, transfers, and spends for this patient will appear
                here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border !border-slate-200">
              <div className="divide-y !divide-slate-100">
                {transactions.map((t) => {
                  const meta = TYPE_META[t.type] ?? {
                    label: t.type,
                    sign: '+' as const,
                    icon: CircleDollarSign,
                    badgeClass: '!bg-slate-100 !text-slate-600',
                  };
                  const Icon = meta.icon;

                  return (
                    <div key={t.id} className="px-4 py-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.badgeClass}`}
                          >
                            <Icon size={15} />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-lg font-bold ${
                                  meta.sign === '+'
                                    ? '!text-emerald-600'
                                    : '!text-slate-900'
                                }`}
                              >
                                {meta.sign}
                                {formatCurrency(t.amount)}
                              </span>
                              <StatusBadge status={t.status} />
                            </div>

                            <p className="mt-1 text-sm !text-slate-600">
                              {meta.label}
                            </p>

                            <p className="mt-1 text-xs !text-slate-500">
                              {formatDateTime(t.createdAt)}
                              {t.confirmedAt &&
                                ` · Confirmed: ${formatDateTime(t.confirmedAt)}`}
                            </p>

                            <p className="mt-1 text-xs !text-slate-400">
                              {t.reason}
                            </p>
                          </div>
                        </div>

                        {t.type === 'GRANT' && t.status === 'REQUESTED' && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId === t.id}
                              onClick={() => approveGrant(t.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border !border-emerald-300 !bg-emerald-50 px-3 py-2 text-xs font-bold !text-emerald-700 transition hover:!bg-emerald-100 disabled:opacity-60"
                            >
                              {actionLoadingId === t.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <ThumbsUp size={13} />
                              )}
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === t.id}
                              onClick={() => setRejectTarget(t.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-2 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
                            >
                              <ThumbsDown size={13} />
                              Reject
                            </button>
                          </div>
                        )}

                        {t.type === 'GRANT' && t.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 text-xs !text-slate-400">
                            <XCircle size={13} />
                            Rejected
                          </span>
                        )}

                        {t.status === 'CONFIRMED' && (
                          <span className="inline-flex items-center gap-1.5 text-xs !text-emerald-600">
                            <CheckCircle2 size={13} />
                            Confirmed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        title="Request wallet grant"
        open={grantFormOpen}
        onCancel={() => setGrantFormOpen(false)}
        onOk={submitGrant}
        okText="Request grant"
        confirmLoading={submittingGrant}
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-2.5 rounded-lg border !border-blue-200 !bg-blue-50 px-3.5 py-3">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 !text-blue-600" />
            <p className="text-xs !text-blue-800">
              This creates a request only — an admin still needs to approve
              it before the amount is spendable.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Amount
            </label>
            <Input
              type="number"
              value={grantForm.amount}
              onChange={(e) =>
                setGrantForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={grantForm.reason}
              onChange={(e) =>
                setGrantForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={grantForm.notes}
              onChange={(e) =>
                setGrantForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Reject grant"
        open={!!rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onOk={submitReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}