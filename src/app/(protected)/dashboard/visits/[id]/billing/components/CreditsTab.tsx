'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Modal, Select, Input, message } from 'antd';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import { NairaIcon } from '@/components/icon/NairaIcon';

import { clientFetch } from '@/lib/clientFetch';
import { notifyBillingChanged } from '../billing-refresh';
import StatusBadge from './StatusBadge';
import type { ChargeRow, CreditRow } from '../billing-client';
import { Lock } from 'lucide-react';

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

function formatWalletBalance(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

const BASE_RESOLUTION_METHODS = [
  'CASH',
  'POS',
  'CARD',
  'TRANSFER',
  'INSURANCE',
];

interface FormState {
  amount: string;
  method: string;
  visitChargeId?: string;
  reason: string;
  notes?: string;
}

const EMPTY_FORM: FormState = {
  amount: '',
  method: 'CASH',
  reason: '',
};

export default function CreditsTab({
  visitId,
  patientId,
  charges,
  credits,
  creditBalance,
  isReconciled = false,
  onCreditsChange,
  onCreditBalanceChange,
}: {
  visitId: string;
  patientId: string;
  charges: ChargeRow[];
  credits: CreditRow[];
  creditBalance: number;
  isReconciled?: boolean;
  onCreditsChange: (credits: CreditRow[]) => void;
  onCreditBalanceChange: (balance: number) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [failTarget, setFailTarget] = useState<string | null>(null);
  const [failReason, setFailReason] = useState('');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [walletEnabled, setWalletEnabled] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const resolutionMethods = walletEnabled
    ? [...BASE_RESOLUTION_METHODS, 'PATIENT_WALLET']
    : BASE_RESOLUTION_METHODS;

  const refreshBalance = async () => {
    const res = await clientFetch(
      `/api/visit-credit/balance?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.balance !== undefined) {
      onCreditBalanceChange(json.balance);
    }
  };

  const refreshCredits = async () => {
    const res = await clientFetch(
      `/api/visit-credit/list?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.credits) {
      onCreditsChange(json.credits);
    }
  };

  const refreshFeatureFlags = async () => {
    const res = await clientFetch('/api/feature-flag/list', {
      cache: 'no-store',
    });
    const json = await res.json();
    if (res.ok && json.flags) {
      const walletFlag = json.flags.find(
        (f: { flagKey: string; enabled: boolean }) =>
          f.flagKey === 'PATIENT_WALLET'
      );
      setWalletEnabled(!!walletFlag?.enabled);
    }
  };

  const refreshWalletBalance = async () => {
    const res = await clientFetch(
      `/api/patient-wallet/balance?patientId=${patientId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.balance !== undefined) {
      setWalletBalance(json.balance);
    }
  };

  const refreshCreditState = async () => {
    await Promise.all([
      refreshCredits(),
      refreshBalance(),
      walletEnabled ? refreshWalletBalance() : Promise.resolve(),
    ]);
  };

  useEffect(() => {
    refreshFeatureFlags();
  }, [visitId]);

  useEffect(() => {
    if (walletEnabled) {
      refreshWalletBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletEnabled, patientId]);

  const exceedsCreditBalance =
    Number(form.amount || 0) > creditBalance + 0.01;

  const openForm = () => {
    if (isReconciled) {
      message.warning('Cannot record refunds on a reconciled visit');
      return;
    }
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const submitRefund = async () => {
    if (!form.amount || Number(form.amount) <= 0) {
      message.error('Enter a valid amount');
      return;
    }

    if (!form.reason.trim()) {
      message.error('A reason is required');
      return;
    }

    if (exceedsCreditBalance) {
      message.error(
        `This exceeds the current credit balance of ${formatCurrency(
          creditBalance
        )}`
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await clientFetch('/api/visit-credit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId,
          visitChargeId: form.visitChargeId || undefined,
          amount: Number(form.amount),
          method: form.method,
          reason: form.reason.trim(),
          notes: form.notes?.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to record refund');
        return;
      }

      message.success('Refund recorded');
      setFormOpen(false);
      await refreshCreditState();
      notifyBillingChanged('credits');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmRefund = async (creditId: string) => {
    if (isReconciled) {
      message.warning('Cannot confirm refunds on a reconciled visit');
      return;
    }

    setActionLoadingId(creditId);

    try {
      const res = await clientFetch('/api/visit-credit/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creditId }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to confirm refund');
        return;
      }

      message.success('Refund confirmed');
      await refreshCreditState();
      notifyBillingChanged('credits');
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitFailReason = async () => {
    if (!failTarget) return;

    if (!failReason.trim()) {
      message.error('A reason is required');
      return;
    }

    setActionLoadingId(failTarget);

    try {
      const res = await clientFetch('/api/visit-credit/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditId: failTarget,
          reason: failReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Action failed');
        return;
      }

      message.success('Done');
      setFailTarget(null);
      setFailReason('');
      await refreshCreditState();
      notifyBillingChanged('credits');
    } finally {
      setActionLoadingId(null);
    }
  };

  const chargeName = (visitChargeId?: string | null): string | null => {
    if (!visitChargeId) return null;
    return (
      charges.find((c) => c.id === visitChargeId)?.chargeName ??
      'Charge no longer available'
    );
  };

  return (
    <div className="space-y-5 py-5">
      {isReconciled && (
        <div className="flex items-start gap-2.5 rounded-2xl border !border-emerald-200 !bg-emerald-50/60 px-5 py-4">
          <ShieldCheck size={18} className="mt-0.5 shrink-0 !text-emerald-600" />
          <p className="text-sm !text-emerald-700">
            Visit is reconciled and locked for billing. Existing credits
            remain visible, but credit actions are disabled.
          </p>
        </div>
      )}
      {walletEnabled && (
        <div className="flex items-center justify-end">
          <Link
            href={`/dashboard/patients/${patientId}/wallet`}
            className="inline-flex items-center gap-2 rounded-2xl border !border-slate-200 !bg-white px-4 py-2.5 text-sm font-medium !text-slate-600 shadow-sm transition-all hover:!border-blue-200 hover:!bg-blue-50 hover:!text-blue-700"
          >
            <Wallet size={15} />
            Patient wallet
            {walletBalance !== null && walletBalance > 0.01 && (
              <span className="rounded-full border !border-emerald-200 !bg-emerald-50 px-2 py-0.5 text-[11px] font-bold !text-emerald-700">
                {formatWalletBalance(walletBalance)}
              </span>
            )}
          </Link>
        </div>
      )}
      <div
        className={`overflow-hidden rounded-2xl border ${creditBalance > 0.01
          ? '!border-amber-200 !bg-amber-50/50'
          : '!border-slate-200 !bg-slate-50/60'
          }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${creditBalance > 0.01
                ? '!bg-amber-100 !text-amber-700'
                : '!bg-slate-100 !text-slate-500'
                }`}
            >
              <NairaIcon size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Current credit balance
              </p>
              <p
                className={`text-lg font-bold ${creditBalance > 0.01 ? '!text-amber-700' : '!text-slate-700'
                  }`}
              >
                {formatCurrency(creditBalance)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openForm}
            disabled={creditBalance <= 0.01 || isReconciled}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition disabled:cursor-not-allowed ${
              creditBalance <= 0.01 || isReconciled
                ? '!bg-slate-300'
                : '!bg-blue-600 hover:!bg-blue-700'
            }`}
          >
            <Banknote size={15} />
            Record refund
          </button>
        </div>

        {creditBalance <= 0.01 && (
          <p className="border-t !border-slate-200 !bg-white/60 px-5 py-2.5 text-xs !text-slate-500">
            This visit has no outstanding credit right now — there&apos;s nothing
            to refund.
          </p>
        )}
      </div>

      {credits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
          <NairaIcon size={32} className="!text-slate-300" />
          <h3 className="mt-4 text-base font-bold !text-slate-700">
            No refunds recorded yet
          </h3>
          <p className="mt-1 max-w-sm text-sm !text-slate-500">
            Credit refunds processed for this visit will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border !border-slate-200">
          <div className="divide-y !divide-slate-100">
            {credits.map((c) => (
              <div key={c.id} className="px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold !text-slate-900">
                        {formatCurrency(c.amount)}
                      </span>
                      <StatusBadge status={c.status} />
                      <span className="rounded-full border !border-slate-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-slate-500">
                        {c.method.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="mt-1 text-xs !text-slate-500">
                      Recorded: {formatDateTime(c.createdAt)}
                      {c.confirmedAt &&
                        ` · Confirmed: ${formatDateTime(c.confirmedAt)}`}
                    </p>

                    {c.visitChargeId && (
                      <p className="mt-1 text-xs !text-slate-400">
                        Related charge: {chargeName(c.visitChargeId)}
                      </p>
                    )}

                    <p className="mt-1 text-sm !text-slate-600">{c.reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {c.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          disabled={actionLoadingId === c.id || isReconciled}
                          onClick={() => confirmRefund(c.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold !text-white transition disabled:opacity-60 ${
                            isReconciled
                              ? '!bg-slate-300 cursor-not-allowed'
                              : '!bg-emerald-600 hover:!bg-emerald-700'
                          }`}
                        >
                          {actionLoadingId === c.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Confirm
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === c.id || isReconciled}
                          onClick={() => setFailTarget(c.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:opacity-60 ${
                            isReconciled
                              ? '!border-slate-200 !bg-slate-100 !text-slate-400 cursor-not-allowed'
                              : '!border-red-300 !bg-red-50 !text-red-700 hover:!bg-red-100'
                          }`}
                        >
                          <XCircle size={13} />
                          Fail
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        title="Record credit refund"
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={submitRefund}
        okText="Record refund"
        confirmLoading={submitting}
        okButtonProps={{ disabled: exceedsCreditBalance || isReconciled }}
      >
        <div className="space-y-4 py-2">
          <div className="rounded-lg !bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium !text-slate-600">
                Current credit balance
              </span>
              <span className="font-bold !text-slate-900">
                {formatCurrency(creditBalance)}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Amount
            </label>
            <Input
              type="number"
              max={creditBalance}
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>

          {exceedsCreditBalance && (
            <div className="flex items-start gap-2.5 rounded-lg border !border-red-200 !bg-red-50 px-3.5 py-3">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 !text-red-600"
              />
              <p className="text-xs !text-red-700">
                This exceeds the current credit balance of{' '}
                {formatCurrency(creditBalance)}.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              {form.method === 'PATIENT_WALLET'
                ? "Resolution — sends this amount to the patient's wallet"
                : 'Method'}
            </label>
            <Select
              className="w-full"
              value={form.method}
              onChange={(v) => setForm((f) => ({ ...f, method: v }))}
              options={resolutionMethods.map((m) => ({
                value: m,
                label: m === 'PATIENT_WALLET' ? 'Patient Wallet' : m,
              }))}
            />
          </div>

          {form.method === 'PATIENT_WALLET' && (
            <div className="flex items-start gap-2.5 rounded-lg border !border-blue-200 !bg-blue-50 px-3.5 py-3">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 !text-blue-600"
              />
              <p className="text-xs !text-blue-800">
                This moves the amount into the patient&apos;s wallet instead of
                refunding it directly. Once confirmed, it cannot be paid out
                as cash — it can only be spent on a future visit charge.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Related charge (optional)
            </label>
            <Select
              className="w-full"
              placeholder="No specific charge"
              allowClear
              value={form.visitChargeId}
              onChange={(v) => setForm((f) => ({ ...f, visitChargeId: v }))}
              options={charges.map((c) => ({
                value: c.id,
                label: c.chargeName,
              }))}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Mark refund as failed"
        open={!!failTarget}
        onCancel={() => setFailTarget(null)}
        onOk={submitFailReason}
        okText="Mark failed"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={failReason}
          onChange={(e) => setFailReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}