'use client';

import { useEffect, useState } from 'react';
import { Modal, Input, Select, message } from 'antd';
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Filter,
  Gift,
  Loader2,
  PlusCircle,
  ThumbsDown,
  ThumbsUp,
  Wallet,
  X,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from '@/app/(protected)/dashboard/visits/[id]/billing/components/StatusBadge';
import type { GetPatientWalletTransactionsPaginatedQuery } from '@/shared/graphql/generated/graphql';

export type WalletTransactionRow =
  GetPatientWalletTransactionsPaginatedQuery['patientWalletTransactionsPaginated']['items'][number];

interface PaginatedTransactions {
  items: WalletTransactionRow[];
  total: number;
  page: number;
  pageCount: number;
}

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
  TOP_UP: {
    label: 'Wallet top-up',
    sign: '+',
    icon: PlusCircle,
    badgeClass: '!bg-violet-100 !text-violet-700',
  },
};

const TYPE_FILTER_OPTIONS = [
  { value: 'GRANT', label: 'Grant' },
  { value: 'TRANSFER_IN', label: 'Transfer in' },
  { value: 'SPEND', label: 'Spend' },
  { value: 'TOP_UP', label: 'Top-up' },
];

const STATUS_FILTER_OPTIONS = [
  { value: 'REQUESTED', label: 'Requested' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'FAILED', label: 'Failed' },
];

const TOP_UP_METHODS = ['CASH', 'POS', 'CARD', 'TRANSFER', 'INSURANCE'];

interface GrantForm {
  amount: string;
  reason: string;
  notes?: string;
}

const EMPTY_GRANT_FORM: GrantForm = { amount: '', reason: '' };

interface TopUpForm {
  amount: string;
  paymentMethod: string;
  reason: string;
  notes?: string;
}

const EMPTY_TOPUP_FORM: TopUpForm = {
  amount: '',
  paymentMethod: 'CASH',
  reason: '',
};

const PAGE_SIZE = 20;

export default function PatientWalletClient({
  patientId,
  initialBalance,
  initialPaginated,
}: {
  patientId: string;
  initialBalance: number;
  initialPaginated: PaginatedTransactions;
}) {
  const [balance, setBalance] = useState<number>(initialBalance);
  const [paginated, setPaginated] =
    useState<PaginatedTransactions>(initialPaginated);
  const [refreshing, setRefreshing] = useState(false);

  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const [grantFormOpen, setGrantFormOpen] = useState(false);
  const [grantForm, setGrantForm] = useState<GrantForm>(EMPTY_GRANT_FORM);
  const [submittingGrant, setSubmittingGrant] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [topUpFormOpen, setTopUpFormOpen] = useState(false);
  const [topUpForm, setTopUpForm] = useState<TopUpForm>(EMPTY_TOPUP_FORM);
  const [submittingTopUp, setSubmittingTopUp] = useState(false);

  const [topUpFailTarget, setTopUpFailTarget] = useState<string | null>(null);
  const [topUpFailReason, setTopUpFailReason] = useState('');

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

  const refreshTransactions = async (targetPage?: number) => {
    setRefreshing(true);

    try {
      const params = new URLSearchParams({
        patientId,
        page: String(targetPage ?? paginated.page),
        limit: String(PAGE_SIZE),
      });

      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);

      const res = await clientFetch(
        `/api/patient-wallet/transactions-paginated?${params.toString()}`,
        { cache: 'no-store' }
      );
      const json = await res.json();

      if (res.ok && json.transactions) {
        setPaginated(json.transactions);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshBalance();
    refreshTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  useEffect(() => {
    refreshTransactions(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, statusFilter]);

  const clearFilters = () => {
    setTypeFilter(undefined);
    setStatusFilter(undefined);
  };

  const hasActiveFilters = !!typeFilter || !!statusFilter;

  const goToPage = (page: number) => {
    if (page < 1 || page > paginated.pageCount) return;
    refreshTransactions(page);
  };

  // --- Grants ---

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

  // --- Top-ups ---

  const openTopUpForm = () => {
    setTopUpForm(EMPTY_TOPUP_FORM);
    setTopUpFormOpen(true);
  };

  const submitTopUp = async () => {
    if (!topUpForm.amount || Number(topUpForm.amount) <= 0) {
      message.error('Enter a valid amount');
      return;
    }

    if (!topUpForm.reason.trim()) {
      message.error('A reason is required');
      return;
    }

    setSubmittingTopUp(true);

    try {
      const res = await clientFetch('/api/patient-wallet/top-up/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          amount: Number(topUpForm.amount),
          paymentMethod: topUpForm.paymentMethod,
          reason: topUpForm.reason.trim(),
          notes: topUpForm.notes?.trim() || undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to record top-up');
        return;
      }

      message.success('Top-up recorded — confirm it once the money is in hand');
      setTopUpFormOpen(false);
      await refreshTransactions();
    } finally {
      setSubmittingTopUp(false);
    }
  };

  const confirmTopUp = async (transactionId: string) => {
    setActionLoadingId(transactionId);

    try {
      const res = await clientFetch('/api/patient-wallet/top-up/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to confirm top-up');
        return;
      }

      message.success('Top-up confirmed');
      await Promise.all([refreshTransactions(), refreshBalance()]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitTopUpFail = async () => {
    if (!topUpFailTarget) return;

    if (!topUpFailReason.trim()) {
      message.error('A reason is required');
      return;
    }

    setActionLoadingId(topUpFailTarget);

    try {
      const res = await clientFetch('/api/patient-wallet/top-up/fail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: topUpFailTarget,
          reason: topUpFailReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Action failed');
        return;
      }

      message.success('Done');
      setTopUpFailTarget(null);
      setTopUpFailReason('');
      await refreshTransactions();
    } finally {
      setActionLoadingId(null);
    }
  };

  const transactions = paginated.items;

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
            Goodwill grants, wallet top-ups, credit transferred in from
            visits, and spending toward future charges — all recorded here.
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

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openTopUpForm}
                className="inline-flex items-center gap-2 rounded-2xl !bg-violet-600 px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:!bg-violet-700"
              >
                <PlusCircle size={15} />
                Top up wallet
              </button>
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
        </div>

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-bold !text-slate-800">
              {paginated.total} transaction{paginated.total === 1 ? '' : 's'}
            </h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-medium !text-slate-400">
                <Filter size={13} />
                Filter
              </div>
              <Select
                allowClear
                placeholder="Type"
                className="w-36"
                size="small"
                value={typeFilter}
                onChange={(v) => setTypeFilter(v)}
                options={TYPE_FILTER_OPTIONS}
              />
              <Select
                allowClear
                placeholder="Status"
                className="w-36"
                size="small"
                value={statusFilter}
                onChange={(v) => setStatusFilter(v)}
                options={STATUS_FILTER_OPTIONS}
              />
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 rounded-lg border !border-slate-200 !bg-white px-2.5 py-1 text-xs font-medium !text-slate-500 transition hover:!bg-slate-50"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
              <Wallet size={32} className="!text-slate-300" />
              <h3 className="mt-4 text-base font-bold !text-slate-700">
                {hasActiveFilters
                  ? 'No transactions match these filters'
                  : 'No wallet activity yet'}
              </h3>
              <p className="mt-1 max-w-sm text-sm !text-slate-500">
                {hasActiveFilters
                  ? 'Try a different type or status, or clear the filters.'
                  : 'Grants, top-ups, transfers, and spends for this patient will appear here.'}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 !bg-white px-3 py-1.5 text-xs font-medium !text-slate-600 transition hover:!bg-slate-50"
                >
                  <X size={12} />
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div
              className={`overflow-hidden rounded-xl border !border-slate-200 transition-opacity ${
                refreshing ? 'opacity-60' : 'opacity-100'
              }`}
            >
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
                              {t.paymentMethod && (
                                <span className="rounded-full border !border-slate-200 !bg-white px-2 py-0.5 text-[10px] font-bold uppercase !text-slate-500">
                                  {t.paymentMethod}
                                </span>
                              )}
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

                        {t.type === 'TOP_UP' && t.status === 'PENDING' && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              disabled={actionLoadingId === t.id}
                              onClick={() => confirmTopUp(t.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg !bg-emerald-600 px-3 py-2 text-xs font-bold !text-white transition hover:!bg-emerald-700 disabled:opacity-60"
                            >
                              {actionLoadingId === t.id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              Confirm
                            </button>
                            <button
                              type="button"
                              disabled={actionLoadingId === t.id}
                              onClick={() => setTopUpFailTarget(t.id)}
                              className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-2 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
                            >
                              <XCircle size={13} />
                              Fail
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

          {paginated.pageCount > 1 && (
            <div className="mt-4 flex items-center justify-between rounded-xl border !border-slate-200 !bg-white px-4 py-3">
              <span className="text-xs !text-slate-500">
                Page {paginated.page} of {paginated.pageCount}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={paginated.page <= 1 || refreshing}
                  onClick={() => goToPage(paginated.page - 1)}
                  className="inline-flex items-center gap-1 rounded-lg border !border-slate-200 !bg-white px-3 py-1.5 text-xs font-medium !text-slate-600 transition hover:!bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={13} />
                  Previous
                </button>
                <button
                  type="button"
                  disabled={paginated.page >= paginated.pageCount || refreshing}
                  onClick={() => goToPage(paginated.page + 1)}
                  className="inline-flex items-center gap-1 rounded-lg border !border-slate-200 !bg-white px-3 py-1.5 text-xs font-medium !text-slate-600 transition hover:!bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={13} />
                </button>
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

      <Modal
        title="Top up wallet"
        open={topUpFormOpen}
        onCancel={() => setTopUpFormOpen(false)}
        onOk={submitTopUp}
        okText="Record top-up"
        confirmLoading={submittingTopUp}
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-2.5 rounded-lg border !border-violet-200 !bg-violet-50 px-3.5 py-3">
            <AlertTriangle
              size={15}
              className="mt-0.5 shrink-0 !text-violet-600"
            />
            <p className="text-xs !text-violet-800">
              Records the patient handing over real money right now. It
              needs confirming once received — no separate approval step.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Amount
            </label>
            <Input
              type="number"
              value={topUpForm.amount}
              onChange={(e) =>
                setTopUpForm((f) => ({ ...f, amount: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Payment method
            </label>
            <Select
              className="w-full"
              value={topUpForm.paymentMethod}
              onChange={(v) =>
                setTopUpForm((f) => ({ ...f, paymentMethod: v }))
              }
              options={TOP_UP_METHODS.map((m) => ({ value: m, label: m }))}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={topUpForm.reason}
              onChange={(e) =>
                setTopUpForm((f) => ({ ...f, reason: e.target.value }))
              }
              placeholder="Why is the patient topping up?"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Notes (optional)
            </label>
            <Input.TextArea
              rows={2}
              value={topUpForm.notes}
              onChange={(e) =>
                setTopUpForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Mark top-up as failed"
        open={!!topUpFailTarget}
        onCancel={() => setTopUpFailTarget(null)}
        onOk={submitTopUpFail}
        okText="Mark failed"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={topUpFailReason}
          onChange={(e) => setTopUpFailReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}