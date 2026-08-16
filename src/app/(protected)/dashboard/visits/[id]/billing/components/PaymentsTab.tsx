'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Select, Checkbox, Input, message } from 'antd';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Landmark,
  Loader2,
  ShieldCheck,
  Wallet,
  XCircle,
  Lock
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

const BASE_PAYMENT_METHODS = ['CASH', 'POS', 'CARD', 'TRANSFER', 'INSURANCE'];

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

interface BalancePaymentRow {
  id: string;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  paidAt: string;
  confirmedAt?: string | null;
  reference?: string | null;
  reason: string;
  notes?: string | null;
  createdAt: string;
}

type TabKey = 'payments' | 'balance';
const TAB_ORDER: TabKey[] = ['payments', 'balance'];

export default function PaymentsTab({
  visitId,
  patientId,
  payments,
  charges,
  latestInvoice,
  isReconciled = false,
  onPaymentsChange,
  onLatestInvoiceChange,
}: {
  visitId: string;
  patientId: string;
  payments: PaymentRow[];
  charges: ChargeRow[];
  latestInvoice: InvoiceRow | null;
  isReconciled?: boolean;
  onPaymentsChange: (payments: PaymentRow[]) => void;
  onLatestInvoiceChange: (invoice: InvoiceRow | null) => void;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('payments');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

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
  const [confirmSettleType, setConfirmSettleType] = useState<'payment' | 'balance'>('payment');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [balances, setBalances] = useState<Record<string, ChargeBalance>>({});
  const [currentTotals, setCurrentTotals] = useState<CurrentTotals | null>(null);

  const [walletEnabled, setWalletEnabled] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Balance payments — for the shortfall-with-no-charge-capacity case.
  const [balancePayments, setBalancePayments] = useState<BalancePaymentRow[]>([]);
  const [balanceFormOpen, setBalanceFormOpen] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('');
  const [balanceMethod, setBalanceMethod] = useState('CASH');
  const [balanceReason, setBalanceReason] = useState('');
  const [balanceReference, setBalanceReference] = useState('');
  const [balanceNotes, setBalanceNotes] = useState('');
  const [submittingBalance, setSubmittingBalance] = useState(false);
  const [balanceFailTarget, setBalanceFailTarget] = useState<string | null>(null);
  const [balanceFailReason, setBalanceFailReason] = useState('');
  const [balanceActionLoadingId, setBalanceActionLoadingId] = useState<string | null>(null);

  const canAttachInvoice = !!latestInvoice && latestInvoice.status !== 'DRAFT';

  const paymentMethods = walletEnabled
    ? [...BASE_PAYMENT_METHODS, 'WALLET']
    : BASE_PAYMENT_METHODS;

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

  const refreshBalancePayments = async () => {
    const res = await clientFetch(
      `/api/visit-balance-payment/list?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.payments) {
      setBalancePayments(json.payments);
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

  useEffect(() => {
    refreshPayments();
    refreshBalancePayments();
    refreshBalances();
    refreshCurrentTotals();
    refreshFeatureFlags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  useEffect(() => {
    if (walletEnabled) {
      refreshWalletBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletEnabled, patientId]);

  useEffect(() => {
    const index = TAB_ORDER.indexOf(activeTab);

    const measure = () => {
      const el = tabRefs.current[index];
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeTab]);

  const handleTabKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let nextIndex: number | null = null;

    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % TAB_ORDER.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TAB_ORDER.length) % TAB_ORDER.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = TAB_ORDER.length - 1;
    }

    if (nextIndex === null) return;

    e.preventDefault();
    setActiveTab(TAB_ORDER[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  const getRemaining = useCallback(
    (chargeId: string, totalAmount: number): number => {
      const b = balances[chargeId];
      return b ? b.remaining : totalAmount;
    },
    [balances]
  );

  const getAmountPaid = (chargeId: string): number => {
    return balances[chargeId]?.amountPaid ?? 0;
  };

  const payableCharges = useMemo(
    () =>
      charges.filter(
        (c) => getRemaining(c.id, Number(c.totalAmount ?? 0)) > 0.01
      ),
    [charges, getRemaining]
  );

  const totalEntered = useMemo(
    () =>
      selectedChargeIds.reduce(
        (sum, id) => sum + (Number(amounts[id]) || 0),
        0
      ),
    [selectedChargeIds, amounts]
  );

  const outstandingMismatch = useMemo(() => {
    if (!currentTotals) return null;
    if (totalEntered <= currentTotals.outstandingBalance + 0.01) return null;

    const collectible = currentTotals.outstandingBalance;
    const creditCreated = totalEntered - collectible;

    return { collectible, creditCreated };
  }, [currentTotals, totalEntered]);

  const exceedsWalletBalance =
    paymentMethod === 'WALLET' &&
    walletBalance !== null &&
    totalEntered > walletBalance + 0.01;

  const showBalancePaymentPrompt =
    charges.length > 0 &&
    payableCharges.length === 0 &&
    (currentTotals?.outstandingBalance ?? 0) > 0.01;

  const wouldFullySettle = (amount: number): boolean => {
    if (!currentTotals) return false;
    return amount >= currentTotals.outstandingBalance - 0.01;
  };

  const openForm = () => {
    if (isReconciled) {
      message.warning('Cannot record payments on a reconciled visit');
      return;
    }
    setSelectedChargeIds([]);
    setAmounts({});
    setPaymentMethod('CASH');
    setAttachInvoice(false);
    setReference('');
    setNotes('');
    setFormOpen(true);
  };

  const toggleCharge = (chargeId: string, checked: boolean) => {
    if (isReconciled) return;

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
    if (isReconciled) {
      message.warning('Cannot record payments on a reconciled visit');
      return;
    }

    if (selectedChargeIds.length === 0) {
      message.error('Select at least one charge to pay for');
      return;
    }

    if (totalEntered <= 0) {
      message.error('Enter at least one non-zero allocation amount');
      return;
    }

    if (exceedsWalletBalance) {
      message.error(
        `This exceeds the patient's current wallet balance of ${formatCurrency(
          walletBalance
        )}`
      );
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
    if (isReconciled) {
      message.warning('Cannot confirm payments on a reconciled visit');
      return;
    }

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
        refreshWalletBalance(),
      ]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmClick = (payment: PaymentRow) => {
    if (wouldFullySettle(Number(payment.amountPaid))) {
      setConfirmSettleType('payment');
      setConfirmSettleTarget(payment.id);
    } else {
      confirmPayment(payment.id);
    }
  };

  const confirmSettle = async () => {
    if (!confirmSettleTarget) return;
    const id = confirmSettleTarget;
    const type = confirmSettleType;
    setConfirmSettleTarget(null);

    if (type === 'balance') {
      await confirmBalancePayment(id);
    } else {
      await confirmPayment(id);
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

  // --- Balance payments ---

  const balanceExceedsOutstanding =
    !!currentTotals &&
    Number(balanceAmount || 0) > currentTotals.outstandingBalance + 0.01;

  const balanceExceedsWallet =
    balanceMethod === 'WALLET' &&
    walletBalance !== null &&
    Number(balanceAmount || 0) > walletBalance + 0.01;

  const openBalanceForm = () => {
    if (isReconciled) {
      message.warning('Cannot record balance payments on a reconciled visit');
      return;
    }
    setBalanceAmount(
      currentTotals ? String(currentTotals.outstandingBalance) : ''
    );
    setBalanceMethod('CASH');
    setBalanceReason('');
    setBalanceReference('');
    setBalanceNotes('');
    setBalanceFormOpen(true);
  };

  const submitBalancePayment = async () => {
    if (isReconciled) {
      message.warning('Cannot record balance payments on a reconciled visit');
      return;
    }

    if (!balanceAmount || Number(balanceAmount) <= 0) {
      message.error('Enter a valid amount');
      return;
    }

    if (!balanceReason.trim()) {
      message.error(
        "A reason is required — this payment isn't tied to a specific charge"
      );
      return;
    }

    if (balanceExceedsOutstanding) {
      message.error(
        `This exceeds the visit's current outstanding balance of ${formatCurrency(
          currentTotals?.outstandingBalance
        )}`
      );
      return;
    }

    if (balanceExceedsWallet) {
      message.error(
        `This exceeds the patient's current wallet balance of ${formatCurrency(
          walletBalance
        )}`
      );
      return;
    }

    setSubmittingBalance(true);

    try {
      const res = await clientFetch('/api/visit-balance-payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitId,
          amountPaid: Number(balanceAmount),
          paymentMethod: balanceMethod,
          reason: balanceReason.trim(),
          reference: balanceReference.trim() || undefined,
          notes: balanceNotes.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to record balance payment');
        return;
      }

      message.success('Balance payment recorded');
      setBalanceFormOpen(false);
      await refreshBalancePayments();
    } finally {
      setSubmittingBalance(false);
    }
  };

  const confirmBalancePayment = async (id: string) => {
    if (isReconciled) {
      message.warning('Cannot confirm balance payments on a reconciled visit');
      return;
    }

    setBalanceActionLoadingId(id);

    try {
      const res = await clientFetch('/api/visit-balance-payment/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to confirm balance payment');
        return;
      }

      message.success('Balance payment confirmed');
      await Promise.all([
        refreshBalancePayments(),
        refreshInvoice(),
        refreshBalances(),
        refreshCurrentTotals(),
        refreshWalletBalance(),
      ]);
    } finally {
      setBalanceActionLoadingId(null);
    }
  };

  const handleBalanceConfirmClick = (payment: BalancePaymentRow) => {
    if (wouldFullySettle(Number(payment.amountPaid))) {
      setConfirmSettleType('balance');
      setConfirmSettleTarget(payment.id);
    } else {
      confirmBalancePayment(payment.id);
    }
  };

  const submitBalanceFailReason = async () => {
    if (!balanceFailTarget) return;

    if (!balanceFailReason.trim()) {
      message.error('A reason is required');
      return;
    }

    setBalanceActionLoadingId(balanceFailTarget);

    try {
      const res = await clientFetch('/api/visit-balance-payment/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: balanceFailTarget,
          reason: balanceFailReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Action failed');
        return;
      }

      message.success('Done');
      setBalanceFailTarget(null);
      setBalanceFailReason('');
      await Promise.all([
        refreshBalancePayments(),
        refreshInvoice(),
        refreshBalances(),
        refreshCurrentTotals(),
      ]);
    } finally {
      setBalanceActionLoadingId(null);
    }
  };

  if (isReconciled) {
    return (
      <div className="space-y-5 py-5">
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-emerald-200 !bg-emerald-50/60 px-6 py-16 text-center">
          <ShieldCheck size={32} className="!text-emerald-600" />
          <h3 className="mt-4 text-base font-bold !text-emerald-800">
            Visit is reconciled
          </h3>
          <p className="mt-1 max-w-sm text-sm !text-emerald-600">
            This visit has been reconciled and is locked for billing. Payments cannot be recorded.
          </p>
        </div>

        {payments.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-bold !text-slate-800">
              {payments.length} payment{payments.length === 1 ? '' : 's'}
            </h3>
            <div className="overflow-hidden rounded-xl border !border-slate-200">
              <div className="divide-y !divide-slate-100">
                {payments.map((p) => (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold !text-slate-900">
                            {formatCurrency(p.amountPaid)}
                          </span>
                          <StatusBadge status={p.status} />
                          <span className="rounded-full border !border-slate-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-slate-500">
                            {p.paymentMethod}
                          </span>
                        </div>

                        <p className="mt-1 text-xs !text-slate-500">
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
                                className="inline-flex items-center gap-1 rounded-full border !border-slate-200 !bg-white px-2.5 py-1 text-xs !text-slate-600"
                              >
                                {alloc.visitCharge?.chargeName} ·{' '}
                                {formatCurrency(alloc.amountAllocated)}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 px-3 py-2 text-xs font-medium !text-slate-400">
                          <Lock size={12} />
                          Locked
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {balancePayments.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-bold !text-slate-800">
              {balancePayments.length} balance payment
              {balancePayments.length === 1 ? '' : 's'}
            </h3>
            <div className="overflow-hidden rounded-xl border !border-amber-200">
              <div className="divide-y !divide-amber-100">
                {balancePayments.map((p) => (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold !text-slate-900">
                            {formatCurrency(p.amountPaid)}
                          </span>
                          <StatusBadge status={p.status} />
                          <span className="rounded-full border !border-amber-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-amber-700">
                            {p.paymentMethod}
                          </span>
                        </div>

                        <p className="mt-1 text-xs !text-slate-500">
                          Paid: {formatDateTime(p.paidAt)}
                          {p.confirmedAt &&
                            ` · Confirmed: ${formatDateTime(p.confirmedAt)}`}
                          {p.reference && ` · Ref: ${p.reference}`}
                        </p>

                        <p className="mt-1 text-sm !text-slate-600">
                          {p.reason}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 px-3 py-2 text-xs font-medium !text-slate-400">
                          <Lock size={12} />
                          Locked
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 py-5">
      <div
        role="tablist"
        aria-label="Payment records"
        className="relative grid grid-cols-2 gap-2 rounded-2xl border !border-slate-200 !bg-slate-50 p-1"
      >
        <span
          aria-hidden="true"
          style={{
            transform: `translateX(${indicator.left}px)`,
            width: indicator.width || undefined,
          }}
          className="absolute inset-y-1 left-0 rounded-xl !bg-white shadow-sm transition-[transform,width] duration-300 ease-out motion-reduce:transition-none"
        />

        <button
          ref={(el) => {
            tabRefs.current[0] = el;
          }}
          role="tab"
          id="payments-tab"
          type="button"
          aria-selected={activeTab === 'payments'}
          aria-controls="payments-panel"
          tabIndex={activeTab === 'payments' ? 0 : -1}
          onClick={() => setActiveTab('payments')}
          onKeyDown={(e) => handleTabKeyDown(e, 0)}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 sm:px-4 ${
            activeTab === 'payments'
              ? '!text-emerald-700'
              : '!text-slate-500 hover:!text-slate-700'
          }`}
        >
          <Banknote size={15} className="shrink-0" />
          <span className="truncate">Payments</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeTab === 'payments'
                ? '!bg-emerald-100 !text-emerald-700'
                : '!bg-slate-200 !text-slate-600'
            }`}
          >
            {payments.length}
          </span>
        </button>

        <button
          ref={(el) => {
            tabRefs.current[1] = el;
          }}
          role="tab"
          id="balance-tab"
          type="button"
          aria-selected={activeTab === 'balance'}
          aria-controls="balance-panel"
          tabIndex={activeTab === 'balance' ? 0 : -1}
          onClick={() => setActiveTab('balance')}
          onKeyDown={(e) => handleTabKeyDown(e, 1)}
          className={`relative z-10 flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 sm:px-4 ${
            activeTab === 'balance'
              ? '!text-amber-700'
              : '!text-slate-500 hover:!text-slate-700'
          }`}
        >
          <Landmark size={15} className="shrink-0" />
          <span className="truncate">Balance</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
              activeTab === 'balance'
                ? '!bg-amber-100 !text-amber-700'
                : '!bg-slate-200 !text-slate-600'
            }`}
          >
            {balancePayments.length}
          </span>
        </button>
      </div>

      {activeTab === 'payments' && (
        <div
          role="tabpanel"
          id="payments-panel"
          aria-labelledby="payments-tab"
          tabIndex={0}
          className="space-y-5 focus:outline-none"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold !text-slate-800">
              {payments.length} payment{payments.length === 1 ? '' : 's'}
            </h3>

            <button
              type="button"
              onClick={openForm}
              disabled={isReconciled}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition disabled:opacity-60 ${
                isReconciled
                  ? '!bg-slate-300 cursor-not-allowed'
                  : '!bg-emerald-600 hover:!bg-emerald-700'
              }`}
            >
              <Banknote size={15} />
              Record payment
            </button>
          </div>

          {showBalancePaymentPrompt && (
            <div className="flex flex-col gap-3 rounded-2xl border !border-amber-200 !bg-amber-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 !text-amber-600"
                />
                <div>
                  <p className="text-sm font-bold !text-amber-900">
                    This visit still owes{' '}
                    {formatCurrency(currentTotals?.outstandingBalance)}, but
                    every charge is already fully allocated.
                  </p>
                  <p className="mt-0.5 text-xs !text-amber-700">
                    This can happen after charges move up and down again
                    following a refund. Record a payment against the visit&apos;s
                    overall balance instead.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('balance');
                  openBalanceForm();
                }}
                className="inline-flex shrink-0 items-center gap-2 rounded-2xl border !border-amber-300 !bg-white px-4 py-2.5 text-sm font-medium !text-amber-700 shadow-sm transition hover:!bg-amber-50"
              >
                <Landmark size={15} />
                Record balance payment
              </button>
            </div>
          )}

          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
              <Wallet size={32} className="!text-slate-300" />
              <h3 className="mt-4 text-base font-bold !text-slate-700">
                No payments recorded yet
              </h3>
              <p className="mt-1 max-w-sm text-sm !text-slate-500">
                Payments made toward this visit&apos;s charges will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border !border-slate-200">
              <div className="divide-y !divide-slate-100">
                {payments.map((p) => (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold !text-slate-900">
                            {formatCurrency(p.amountPaid)}
                          </span>
                          <StatusBadge status={p.status} />
                          <span className="rounded-full border !border-slate-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-slate-500">
                            {p.paymentMethod}
                          </span>
                        </div>

                        <p className="mt-1 text-xs !text-slate-500">
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
                                className="inline-flex items-center gap-1 rounded-full border !border-slate-200 !bg-white px-2.5 py-1 text-xs !text-slate-600"
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
                              disabled={actionLoadingId === p.id || isReconciled}
                              onClick={() => handleConfirmClick(p)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold !text-white transition disabled:opacity-60 ${
                                isReconciled
                                  ? '!bg-slate-300 cursor-not-allowed'
                                  : '!bg-emerald-600 hover:!bg-emerald-700'
                              }`}
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
                              disabled={actionLoadingId === p.id || isReconciled}
                              onClick={() => setFailTarget(p.id)}
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
        </div>
      )}

      {activeTab === 'balance' && (
        <div
          role="tabpanel"
          id="balance-panel"
          aria-labelledby="balance-tab"
          tabIndex={0}
          className="space-y-5 focus:outline-none"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-bold !text-slate-800">
              {balancePayments.length} balance payment
              {balancePayments.length === 1 ? '' : 's'}
            </h3>

            <button
              type="button"
              onClick={openBalanceForm}
              disabled={isReconciled}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium shadow-sm transition disabled:opacity-60 ${
                isReconciled
                  ? '!border-slate-200 !bg-slate-100 !text-slate-400 cursor-not-allowed'
                  : '!border-amber-300 !bg-amber-50 !text-amber-700 hover:!bg-amber-100'
              }`}
            >
              <Landmark size={15} />
              Record balance payment
            </button>
          </div>

          <p className="text-xs !text-slate-500">
            Payments applied against the visit&apos;s overall balance rather
            than a specific charge — used when every charge is already fully
            allocated but the visit still owes money.
          </p>

          {balancePayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border !border-amber-100 !bg-amber-50/40 px-6 py-16 text-center">
              <Landmark size={32} className="!text-amber-300" />
              <h3 className="mt-4 text-base font-bold !text-slate-700">
                No balance payments recorded yet
              </h3>
              <p className="mt-1 max-w-sm text-sm !text-slate-500">
                Payments recorded against this visit&apos;s overall balance
                will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border !border-amber-200">
              <div className="divide-y !divide-amber-100">
                {balancePayments.map((p) => (
                  <div key={p.id} className="px-4 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-lg font-bold !text-slate-900">
                            {formatCurrency(p.amountPaid)}
                          </span>
                          <StatusBadge status={p.status} />
                          <span className="rounded-full border !border-amber-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-amber-700">
                            {p.paymentMethod}
                          </span>
                        </div>

                        <p className="mt-1 text-xs !text-slate-500">
                          Paid: {formatDateTime(p.paidAt)}
                          {p.confirmedAt &&
                            ` · Confirmed: ${formatDateTime(p.confirmedAt)}`}
                          {p.reference && ` · Ref: ${p.reference}`}
                        </p>

                        <p className="mt-1 text-sm !text-slate-600">
                          {p.reason}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {p.status === 'PENDING' && (
                          <>
                            <button
                              type="button"
                              disabled={balanceActionLoadingId === p.id || isReconciled}
                              onClick={() => handleBalanceConfirmClick(p)}
                              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold !text-white transition disabled:opacity-60 ${
                                isReconciled
                                  ? '!bg-slate-300 cursor-not-allowed'
                                  : '!bg-emerald-600 hover:!bg-emerald-700'
                              }`}
                            >
                              {balanceActionLoadingId === p.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              Confirm
                            </button>
                            <button
                              type="button"
                              disabled={balanceActionLoadingId === p.id || isReconciled}
                              onClick={() => setBalanceFailTarget(p.id)}
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
        </div>
      )}

      <Modal
        title="Record payment"
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={submitPayment}
        okText="Record payment"
        confirmLoading={submitting}
        okButtonProps={{ disabled: exceedsWalletBalance || isReconciled }}
        width={560}
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Charges to pay for
            </label>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-lg border !border-slate-200 p-3">
              {payableCharges.length === 0 ? (
                <p className="text-sm !text-slate-400">
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
                        disabled={isReconciled}
                      >
                        <span className="text-sm !text-slate-700">
                          {c.chargeName} — {formatCurrency(remaining)}{' '}
                          remaining
                          {adjusted && (
                            <span className="ml-1.5 text-xs !text-blue-600">
                              (adjusted from{' '}
                              {formatCurrency(balance!.totalAmount)})
                            </span>
                          )}
                          {amountPaid > 0 && (
                            <span className="ml-1.5 text-xs !text-emerald-600">
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
                          className="w-28 rounded-lg border !border-slate-300 px-2 py-1.5 text-sm focus:!border-blue-400 focus:outline-none"
                          disabled={isReconciled}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg !bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium !text-slate-600">
              Total amount
            </span>
            <span className="text-lg font-bold !text-slate-900">
              {formatCurrency(totalEntered)}
            </span>
          </div>

          {outstandingMismatch && (
            <div className="flex items-start gap-2.5 rounded-lg border !border-blue-200 !bg-blue-50 px-3.5 py-3">
              <AlertTriangle size={15} className="mt-0.5 shrink-0 !text-blue-600" />
              <p className="text-xs !text-blue-800">
                The selected charges show {formatCurrency(totalEntered)} remaining
                between them, but existing credit elsewhere on this visit means only{' '}
                <span className="font-bold">
                  {formatCurrency(outstandingMismatch.collectible)}
                </span>{' '}
                is genuinely still owed. This payment can still be recorded in full —{' '}
                {formatCurrency(outstandingMismatch.collectible)} will settle the
                outstanding balance, and the remaining{' '}
                <span className="font-bold">
                  {formatCurrency(outstandingMismatch.creditCreated)}
                </span>{' '}
                will need to be refunded to the patient as credit.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Payment method
            </label>
            <Select
              className="w-full"
              value={paymentMethod}
              onChange={setPaymentMethod}
              options={paymentMethods.map((m) => ({ value: m, label: m }))}
              disabled={isReconciled}
            />
          </div>

          {paymentMethod === 'WALLET' && (
            <div
              className={`rounded-lg border px-4 py-3 ${exceedsWalletBalance
                ? '!border-red-200 !bg-red-50'
                : '!border-blue-200 !bg-blue-50'
                }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${exceedsWalletBalance ? '!text-red-700' : '!text-blue-700'
                    }`}
                >
                  Patient wallet balance
                </span>
                <span
                  className={`font-bold ${exceedsWalletBalance ? '!text-red-800' : '!text-blue-900'
                    }`}
                >
                  {walletBalance === null
                    ? 'Loading…'
                    : formatCurrency(walletBalance)}
                </span>
              </div>

              {exceedsWalletBalance && (
                <div className="mt-2 flex items-start gap-2">
                  <AlertTriangle
                    size={14}
                    className="mt-0.5 shrink-0 !text-red-600"
                  />
                  <p className="text-xs !text-red-700">
                    This exceeds the patient&apos;s current wallet balance.
                  </p>
                </div>
              )}
            </div>
          )}

          {canAttachInvoice && (
            <Checkbox
              checked={attachInvoice}
              onChange={(e) => setAttachInvoice(e.target.checked)}
              disabled={isReconciled}
            >
              <span className="text-sm !text-slate-700">
                Attach to invoice {latestInvoice?.invoiceNumber}
              </span>
            </Checkbox>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reference (optional)
            </label>
            <Input
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              disabled={isReconciled}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isReconciled}
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Record balance payment"
        open={balanceFormOpen}
        onCancel={() => setBalanceFormOpen(false)}
        onOk={submitBalancePayment}
        okText="Record balance payment"
        confirmLoading={submittingBalance}
        okButtonProps={{
          disabled: balanceExceedsOutstanding || balanceExceedsWallet || isReconciled,
        }}
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-2.5 rounded-lg border !border-amber-200 !bg-amber-50 px-3.5 py-3">
            <AlertTriangle
              size={15}
              className="mt-0.5 shrink-0 !text-amber-600"
            />
            <p className="text-xs !text-amber-800">
              This payment applies against the visit&apos;s overall balance, not
              a specific charge. Use it only when the visit genuinely owes
              money but no charge has room left to attach a normal payment
              to.
            </p>
          </div>

          <div className="rounded-lg !bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium !text-slate-600">
                Current outstanding balance
              </span>
              <span className="font-bold !text-slate-900">
                {formatCurrency(currentTotals?.outstandingBalance)}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Amount
            </label>
            <Input
              type="number"
              max={currentTotals?.outstandingBalance}
              value={balanceAmount}
              onChange={(e) => setBalanceAmount(e.target.value)}
              disabled={isReconciled}
            />
          </div>

          {balanceExceedsOutstanding && (
            <div className="flex items-start gap-2.5 rounded-lg border !border-red-200 !bg-red-50 px-3.5 py-3">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 !text-red-600"
              />
              <p className="text-xs !text-red-700">
                This exceeds the visit&apos;s current outstanding balance of{' '}
                {formatCurrency(currentTotals?.outstandingBalance)}.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Payment method
            </label>
            <Select
              className="w-full"
              value={balanceMethod}
              onChange={setBalanceMethod}
              options={paymentMethods.map((m) => ({ value: m, label: m }))}
              disabled={isReconciled}
            />
          </div>

          {balanceMethod === 'WALLET' && (
            <div
              className={`rounded-lg border px-4 py-3 ${balanceExceedsWallet
                ? '!border-red-200 !bg-red-50'
                : '!border-blue-200 !bg-blue-50'
                }`}
            >
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`font-medium ${balanceExceedsWallet ? '!text-red-700' : '!text-blue-700'
                    }`}
                >
                  Patient wallet balance
                </span>
                <span
                  className={`font-bold ${balanceExceedsWallet ? '!text-red-800' : '!text-blue-900'
                    }`}
                >
                  {walletBalance === null
                    ? 'Loading…'
                    : formatCurrency(walletBalance)}
                </span>
              </div>

              {balanceExceedsWallet && (
                <div className="mt-2 flex items-start gap-2">
                  <AlertTriangle
                    size={14}
                    className="mt-0.5 shrink-0 !text-red-600"
                  />
                  <p className="text-xs !text-red-700">
                    This exceeds the patient&apos;s current wallet balance.
                  </p>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={balanceReason}
              onChange={(e) => setBalanceReason(e.target.value)}
              placeholder="Why is this payment not tied to a specific charge?"
              disabled={isReconciled}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reference (optional)
            </label>
            <Input
              value={balanceReference}
              onChange={(e) => setBalanceReference(e.target.value)}
              disabled={isReconciled}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={balanceNotes}
              onChange={(e) => setBalanceNotes(e.target.value)}
              disabled={isReconciled}
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
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={failReason}
          onChange={(e) => setFailReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Mark balance payment as failed"
        open={!!balanceFailTarget}
        onCancel={() => setBalanceFailTarget(null)}
        onOk={submitBalanceFailReason}
        okText="Mark failed"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={balanceFailReason}
          onChange={(e) => setBalanceFailReason(e.target.value)}
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
          <AlertTriangle size={18} className="mt-0.5 shrink-0 !text-red-600" />
          <p className="text-sm !text-slate-700">
            Confirming this payment will bring this visit&apos;s outstanding balance to ₦0.00. This can&apos;t be undone directly — if it turns out to be a mistake, the way to correct it is a credit refund (Credits tab), which records the excess as money owed back to the patient. Please confirm you want to proceed.
          </p>
        </div>
      </Modal>
    </div>
  );
}