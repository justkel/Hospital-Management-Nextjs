'use client';

import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Checkbox, Input, message } from 'antd';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Loader2,
  Wallet,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from './StatusBadge';
import type { ChargeRow, InvoiceRow, PaymentRow } from '../billing-client';

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

const PAYMENT_METHODS = ['CASH', 'POS', 'CARD', 'TRANSFER', 'INSURANCE', 'WALLET'];

interface ChargeBalance {
  visitChargeId: string;
  totalAmount: number;
  effectiveTotal: number;
  amountPaid: number;
  remaining: number;
}

interface CurrentTotals {
  outstandingBalance: number;
}

export default function PaymentsTab({
  visitId,
  payments,
  charges,
  latestInvoice,
  onPaymentsChange,
  onLatestInvoiceChange,
}: {
  visitId: string;
  payments: PaymentRow[];
  charges: ChargeRow[];
  latestInvoice: InvoiceRow | null;
  onPaymentsChange: (payments: PaymentRow[]) => void;
  onLatestInvoiceChange: (invoice: InvoiceRow | null) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [attachInvoice, setAttachInvoice] = useState(false);
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [failTarget, setFailTarget] = useState<string | null>(null);
  const [failReason, setFailReason] = useState('');

  const [confirmSettleTarget, setConfirmSettleTarget] = useState<string | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [balances, setBalances] = useState<Record<string, ChargeBalance>>({});
  const [currentTotals, setCurrentTotals] = useState<CurrentTotals | null>(null);

  const canAttachInvoice = !!latestInvoice && latestInvoice.status !== 'DRAFT';

  const refreshBalances = async () => {
    const res = await clientFetch(
      `/api/visit-charge/balances?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();

    if (res.ok && json.balances) {
      const map: Record<string, ChargeBalance> = {};
      for (const b of json.balances as ChargeBalance[]) {
        map[b.visitChargeId] = b;
      }
      setBalances(map);
    }
  };

  const refreshCurrentTotals = async () => {
    const res = await clientFetch(
      `/api/visit-invoice/current-totals?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.totals) {
      setCurrentTotals(json.totals);
    }
  };

  const refreshPayments = async () => {
    const res = await clientFetch(`/api/visit-payment/list?visitId=${visitId}`, {
      cache: 'no-store',
    });
    const json = await res.json();
    if (res.ok && json.payments) {
      onPaymentsChange(json.payments);
    }
  };

  const refreshInvoice = async () => {
    const res = await clientFetch(
      `/api/visit-invoice/latest?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok) {
      onLatestInvoiceChange(json.invoice ?? null);
    }
  };

  useEffect(() => {
    refreshPayments();
    refreshBalances();
    refreshCurrentTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const getRemaining = (chargeId: string, totalAmount: number): number => {
    const b = balances[chargeId];
    return b ? b.remaining : totalAmount;
  };

  const getAmountPaid = (chargeId: string): number => {
    return balances[chargeId]?.amountPaid ?? 0;
  };

  const payableCharges = useMemo(
    () =>
      charges.filter(
        (c) => getRemaining(c.id, Number(c.totalAmount ?? 0)) > 0.01
      ),
    [charges, balances]
  );

  const totalEntered = useMemo(
    () =>
      selectedChargeIds.reduce(
        (sum, id) => sum + (Number(amounts[id]) || 0),
        0
      ),
    [selectedChargeIds, amounts]
  );

  const wouldFullySettleOnConfirm = (payment: PaymentRow): boolean => {
    if (!currentTotals) return false;
    return Number(payment.amountPaid) >= currentTotals.outstandingBalance - 0.01;
  };

  const openForm = () => {
    setSelectedChargeIds([]);
    setAmounts({});
    setPaymentMethod('CASH');
    setAttachInvoice(false);
    setReference('');
    setNotes('');
    setFormOpen(true);
  };

  const toggleCharge = (chargeId: string, checked: boolean) => {
    if (checked) {
      const charge = charges.find((c) => c.id === chargeId);
      const remaining = charge
        ? getRemaining(chargeId, Number(charge.totalAmount ?? 0))
        : 0;

      setSelectedChargeIds((prev) => [...prev, chargeId]);
      setAmounts((prev) => ({
        ...prev,
        [chargeId]: String(remaining),
      }));
    } else {
      setSelectedChargeIds((prev) => prev.filter((id) => id !== chargeId));
      setAmounts((prev) => {
        const next = { ...prev };
        delete next[chargeId];
        return next;
      });
    }
  };

  const submitPayment = async () => {
    if (selectedChargeIds.length === 0) {
      message.error('Select at least one charge to pay for');
      return;
    }

    if (totalEntered <= 0) {
      message.error('Enter at least one non-zero allocation amount');
      return;
    }

    for (const id of selectedChargeIds) {
      const charge = charges.find((c) => c.id === id);
      const remaining = charge
        ? getRemaining(id, Number(charge.totalAmount ?? 0))
        : 0;
      const entered = Number(amounts[id]) || 0;

      if (entered > remaining + 0.01) {
        message.error(
          `${charge?.chargeName ?? 'That charge'} only has ${formatCurrency(
            remaining
          )} remaining, not ${formatCurrency(entered)}`
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await clientFetch('/api/visit-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId,
          invoiceId:
            attachInvoice && latestInvoice ? latestInvoice.id : undefined,
          amountPaid: totalEntered,
          paymentMethod,
          reference: reference.trim() || undefined,
          notes: notes.trim() || undefined,
          allocations: selectedChargeIds.map((id) => ({
            visitChargeId: id,
            amountAllocated: Number(amounts[id]) || 0,
          })),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to record payment');
        return;
      }

      message.success('Payment recorded');
      setFormOpen(false);
      await Promise.all([refreshPayments(), refreshBalances()]);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmPayment = async (paymentId: string) => {
    setActionLoadingId(paymentId);

    try {
      const res = await clientFetch('/api/visit-payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to confirm payment');
        return;
      }

      message.success('Payment confirmed');
      await Promise.all([
        refreshPayments(),
        refreshInvoice(),
        refreshBalances(),
        refreshCurrentTotals(),
      ]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmClick = (payment: PaymentRow) => {
    if (wouldFullySettleOnConfirm(payment)) {
      setConfirmSettleTarget(payment.id);
    } else {
      confirmPayment(payment.id);
    }
  };

  const confirmSettle = async () => {
    if (!confirmSettleTarget) return;
    const id = confirmSettleTarget;
    setConfirmSettleTarget(null);
    await confirmPayment(id);
  };

  const submitFailReason = async () => {
    if (!failTarget) return;

    if (!failReason.trim()) {
      message.error('A reason is required');
      return;
    }

    setActionLoadingId(failTarget);

    try {
      const res = await clientFetch('/api/visit-payment/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: failTarget,
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
      await Promise.all([
        refreshPayments(),
        refreshInvoice(),
        refreshBalances(),
        refreshCurrentTotals(),
      ]);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-5 py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">
          {payments.length} payment{payments.length === 1 ? '' : 's'}
        </h3>

        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Banknote size={15} />
          Record payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60 px-6 py-16 text-center">
          <Wallet size={32} className="text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-700">
            No payments recorded yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Payments made toward this visit's charges will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="divide-y divide-slate-100">
            {payments.map((p) => (
              <div key={p.id} className="px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-slate-900">
                        {formatCurrency(p.amountPaid)}
                      </span>
                      <StatusBadge status={p.status} />
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-slate-500">
                        {p.paymentMethod}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Paid: {formatDateTime(p.paidAt)}
                      {p.confirmedAt &&
                        ` · Confirmed: ${formatDateTime(p.confirmedAt)}`}
                      {p.reference && ` · Ref: ${p.reference}`}
                    </p>

                    {p.allocations?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.allocations.map((alloc) => (
                          <span
                            key={alloc.id}
                            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
                          >
                            {alloc.visitCharge?.chargeName} ·{' '}
                            {formatCurrency(alloc.amountAllocated)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {p.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          disabled={actionLoadingId === p.id}
                          onClick={() => handleConfirmClick(p)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          {actionLoadingId === p.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Confirm
                        </button>
                        <button
                          type="button"
                          disabled={actionLoadingId === p.id}
                          onClick={() => setFailTarget(p.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
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
        title="Record payment"
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={submitPayment}
        okText="Record payment"
        confirmLoading={submitting}
        width={560}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Charges to pay for
            </label>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3">
              {payableCharges.length === 0 ? (
                <p className="text-sm text-slate-400">
                  {charges.length === 0
                    ? 'No charges available on this visit.'
                    : 'All charges on this visit are fully paid.'}
                </p>
              ) : (
                payableCharges.map((c) => {
                  const checked = selectedChargeIds.includes(c.id);
                  const balance = balances[c.id];
                  const remaining = getRemaining(
                    c.id,
                    Number(c.totalAmount ?? 0)
                  );
                  const amountPaid = getAmountPaid(c.id);
                  const adjusted =
                    balance &&
                    Math.abs(balance.effectiveTotal - balance.totalAmount) >
                      0.01;

                  return (
                    <div
                      key={c.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <Checkbox
                        checked={checked}
                        onChange={(e) =>
                          toggleCharge(c.id, e.target.checked)
                        }
                      >
                        <span className="text-sm text-slate-700">
                          {c.chargeName} — {formatCurrency(remaining)}{' '}
                          remaining
                          {adjusted && (
                            <span className="ml-1.5 text-xs text-blue-600">
                              (adjusted from{' '}
                              {formatCurrency(balance!.totalAmount)})
                            </span>
                          )}
                          {amountPaid > 0 && (
                            <span className="ml-1.5 text-xs text-emerald-600">
                              ({formatCurrency(amountPaid)} already paid)
                            </span>
                          )}
                        </span>
                      </Checkbox>

                      {checked && (
                        <input
                          type="number"
                          max={remaining}
                          value={amounts[c.id] ?? ''}
                          onChange={(e) =>
                            setAmounts((prev) => ({
                              ...prev,
                              [c.id]: e.target.value,
                            }))
                          }
                          className="w-28 rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">
              Total amount
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(totalEntered)}
            </span>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Payment method
            </label>
            <Select
              className="w-full"
              value={paymentMethod}
              onChange={setPaymentMethod}
              options={PAYMENT_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </div>

          {canAttachInvoice && (
            <Checkbox
              checked={attachInvoice}
              onChange={(e) => setAttachInvoice(e.target.checked)}
            >
              <span className="text-sm text-slate-700">
                Attach to invoice {latestInvoice?.invoiceNumber}
              </span>
            </Checkbox>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Reference (optional)
            </label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Mark payment as failed"
        open={!!failTarget}
        onCancel={() => setFailTarget(null)}
        onOk={submitFailReason}
        okText="Mark failed"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={failReason}
          onChange={(e) => setFailReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="This will fully settle the visit"
        open={!!confirmSettleTarget}
        onCancel={() => setConfirmSettleTarget(null)}
        onOk={confirmSettle}
        okText="Yes, confirm it"
        okButtonProps={{ danger: true }}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
          <p className="text-sm text-slate-700">
            Confirming this payment will bring this visit's outstanding
            balance to ₦0.00. There is no refund option in this system — the
            only way to correct a mistaken confirmation is through a
            separate, tracked billing adjustment. Please confirm you want
            to proceed.
          </p>
        </div>
      </Modal>
    </div>
  );
}