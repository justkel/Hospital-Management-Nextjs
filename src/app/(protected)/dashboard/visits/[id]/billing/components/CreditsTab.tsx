'use client';

import { useEffect, useState } from 'react';
import { Modal, Select, Input, message } from 'antd';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from './StatusBadge';
import type { ChargeRow, CreditRow } from '../billing-client';

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

const REFUND_METHODS = ['CASH', 'POS', 'CARD', 'TRANSFER', 'INSURANCE', 'WALLET'];

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
  charges,
  credits,
  creditBalance,
  onCreditsChange,
  onCreditBalanceChange,
}: {
  visitId: string;
  charges: ChargeRow[];
  credits: CreditRow[];
  creditBalance: number;
  onCreditsChange: (credits: CreditRow[]) => void;
  onCreditBalanceChange: (balance: number) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [failTarget, setFailTarget] = useState<string | null>(null);
  const [failReason, setFailReason] = useState('');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  useEffect(() => {
    refreshBalance();
    refreshCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const exceedsCreditBalance =
    Number(form.amount || 0) > creditBalance + 0.01;

  const openForm = () => {
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
      await Promise.all([refreshCredits(), refreshBalance()]);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmRefund = async (creditId: string) => {
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
      await Promise.all([refreshCredits(), refreshBalance()]);
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
      await Promise.all([refreshCredits(), refreshBalance()]);
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
      <div
        className={`overflow-hidden rounded-2xl border ${
          creditBalance > 0.01
            ? '!border-amber-200 !bg-amber-50/50'
            : '!border-slate-200 !bg-slate-50/60'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                creditBalance > 0.01
                  ? '!bg-amber-100 !text-amber-700'
                  : '!bg-slate-100 !text-slate-500'
              }`}
            >
              <CircleDollarSign size={18} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Current credit balance
              </p>
              <p
                className={`text-lg font-bold ${
                  creditBalance > 0.01 ? '!text-amber-700' : '!text-slate-700'
                }`}
              >
                {formatCurrency(creditBalance)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openForm}
            disabled={creditBalance <= 0.01}
            className="inline-flex items-center gap-2 rounded-2xl !bg-blue-600 px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:!bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Banknote size={15} />
            Record refund
          </button>
        </div>

        {creditBalance <= 0.01 && (
          <p className="border-t !border-slate-200 !bg-white/60 px-5 py-2.5 text-xs !text-slate-500">
            This visit has no outstanding credit right now — there's nothing
            to refund.
          </p>
        )}
      </div>

      {credits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
          <CircleDollarSign size={32} className="!text-slate-300" />
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
                        {c.method}
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
                          disabled={actionLoadingId === c.id}
                          onClick={() => confirmRefund(c.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg !bg-emerald-600 px-3 py-2 text-xs font-bold !text-white transition hover:!bg-emerald-700 disabled:opacity-60"
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
                          disabled={actionLoadingId === c.id}
                          onClick={() => setFailTarget(c.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-2 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
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
        okButtonProps={{ disabled: exceedsCreditBalance }}
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
              Method
            </label>
            <Select
              className="w-full"
              value={form.method}
              onChange={(v) => setForm((f) => ({ ...f, method: v }))}
              options={REFUND_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </div>

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