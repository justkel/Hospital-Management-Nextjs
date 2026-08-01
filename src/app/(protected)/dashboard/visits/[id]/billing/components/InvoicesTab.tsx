'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { message } from 'antd';
import {
  AlertTriangle,
  FileCheck2,
  FilePlus2,
  Info,
  Loader2,
  Printer,
  Receipt,
  RefreshCw,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from './StatusBadge';
import type { InvoiceRow } from '../billing-client';

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

interface CurrentTotals {
  subtotal: number;
  discountTotal: number;
  surchargeTotal: number;
  totalPayable: number;
  totalPaid: number;
  outstandingBalance: number;
}

export default function InvoicesTab({
  visitId,
  latestInvoice,
  invoices,
  onLatestInvoiceChange,
  onInvoicesChange,
}: {
  visitId: string;
  latestInvoice: InvoiceRow | null;
  invoices: InvoiceRow[];
  onLatestInvoiceChange: (invoice: InvoiceRow | null) => void;
  onInvoicesChange: (invoices: InvoiceRow[]) => void;
}) {
  const [generating, setGenerating] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const [currentTotals, setCurrentTotals] = useState<CurrentTotals | null>(
    null
  );

  const printHref = (invoiceId: string) =>
    `/dashboard/visits/${visitId}/billing/invoice/${invoiceId}/print`;

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

  const refresh = async () => {
    const [latestRes, listRes] = await Promise.all([
      clientFetch(`/api/visit-invoice/latest?visitId=${visitId}`, {
        cache: 'no-store',
      }),
      clientFetch(`/api/visit-invoice/list?visitId=${visitId}`, {
        cache: 'no-store',
      }),
    ]);

    const latestJson = await latestRes.json();
    const listJson = await listRes.json();

    if (latestRes.ok) {
      onLatestInvoiceChange(latestJson.invoice ?? null);
    }

    if (listRes.ok && listJson.invoices) {
      onInvoicesChange(listJson.invoices);
    }
  };

  useEffect(() => {
    refresh();
    refreshCurrentTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const generate = async () => {
    setGenerating(true);

    try {
      const res = await clientFetch('/api/visit-invoice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to generate invoice');
        return;
      }

      message.success('Invoice generated');
      await Promise.all([refresh(), refreshCurrentTotals()]);
    } finally {
      setGenerating(false);
    }
  };

  const issue = async () => {
    if (!latestInvoice) return;

    setIssuing(true);

    try {
      const res = await clientFetch('/api/visit-invoice/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: latestInvoice.id }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to issue invoice');
        return;
      }

      message.success('Invoice issued and locked');
      await refresh();
    } finally {
      setIssuing(false);
    }
  };

  const totalPayableChanged =
    !!latestInvoice &&
    !!currentTotals &&
    Math.abs(Number(latestInvoice.totalPayable) - currentTotals.totalPayable) >
      0.01;

  const outstandingChanged =
    !!latestInvoice &&
    !!currentTotals &&
    Math.abs(
      Number(latestInvoice.outstandingBalance ?? 0) -
        currentTotals.outstandingBalance
    ) > 0.01;

  const isStale = totalPayableChanged || outstandingChanged;

  return (
    <div className="space-y-6 py-5">
      <div className="overflow-hidden rounded-2xl border !border-blue-200 !bg-blue-50/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b !border-blue-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide !text-blue-700">
              Current totals (live)
            </p>
            <p className="mt-0.5 text-xs !text-blue-600/80">
              Reflects charges and applied adjustments right now — not a
              real invoice, nothing here is ever printed.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshCurrentTotals}
            className="inline-flex items-center gap-1.5 rounded-lg border !border-blue-200 !bg-white px-3 py-1.5 text-xs font-medium !text-blue-700 transition hover:!bg-blue-50"
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {currentTotals ? (
          <>
            <div className="grid grid-cols-1 divide-y !divide-blue-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide !text-blue-600/70">
                  Subtotal
                </p>
                <p className="mt-1 text-lg font-semibold !text-slate-800">
                  {formatCurrency(currentTotals.subtotal)}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide !text-blue-600/70">
                  Discounts
                </p>
                <p className="mt-1 text-lg font-semibold !text-emerald-600">
                  −{formatCurrency(currentTotals.discountTotal)}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide !text-blue-600/70">
                  Total payable
                </p>
                <p className="mt-1 text-lg font-bold !text-slate-900">
                  {formatCurrency(currentTotals.totalPayable)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x !divide-blue-100 border-t !border-blue-100">
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide !text-blue-600/70">
                  Total paid
                </p>
                <p className="mt-1 text-lg font-semibold !text-emerald-600">
                  {formatCurrency(currentTotals.totalPaid)}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide !text-blue-600/70">
                  Outstanding
                </p>
                <p
                  className={`mt-1 text-lg font-bold ${
                    currentTotals.outstandingBalance > 0.01
                      ? '!text-amber-600'
                      : '!text-emerald-600'
                  }`}
                >
                  {formatCurrency(currentTotals.outstandingBalance)}
                </p>
              </div>
            </div>

            {totalPayableChanged && (
              <div className="flex items-start gap-2.5 border-t !border-blue-200 !bg-amber-50 px-5 py-3.5">
                <AlertTriangle
                  size={15}
                  className="mt-0.5 shrink-0 !text-amber-600"
                />
                <p className="text-xs !text-amber-800">
                  This differs from the latest generated invoice (
                  {formatCurrency(latestInvoice?.totalPayable)}). Printing
                  that invoice now will still show its original figures —
                  generate a new one first if you want the print to match
                  what&apos;s shown here.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="px-5 py-6 text-center text-sm !text-blue-600/60">
            Loading current totals…
          </div>
        )}
      </div>

      {outstandingChanged && (
        <div className="flex items-start gap-2.5 rounded-2xl border !border-sky-200 !bg-sky-50 px-5 py-4">
          <Info size={18} className="mt-0.5 shrink-0 !text-sky-600" />
          <div>
            <p className="text-sm font-bold !text-sky-900">
              The latest invoice shows{' '}
              {formatCurrency(latestInvoice?.outstandingBalance)} outstanding,
              but current totals show{' '}
              {formatCurrency(currentTotals?.outstandingBalance)}.
            </p>
            <p className="mt-0.5 text-xs !text-sky-700">
              This usually just means a payment was recorded after this
              invoice was generated — the invoice keeps the figures it had
              at the time, on purpose. Generate a new invoice if you want
              its outstanding balance to reflect what&apos;s owed right now.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-bold !text-slate-800">
          Latest invoice
        </h3>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-2xl border !border-slate-200 !bg-white px-4 py-2.5 text-sm font-medium !text-slate-700 shadow-sm transition hover:!bg-slate-50 disabled:opacity-60"
          >
            {generating ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <FilePlus2 size={14} />
            )}
            Generate invoice
          </button>

          {latestInvoice?.status === 'DRAFT' && (
            <button
              type="button"
              onClick={issue}
              disabled={issuing}
              className="inline-flex items-center gap-2 rounded-2xl !bg-blue-600 px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:!bg-blue-700 disabled:opacity-60"
            >
              {issuing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <FileCheck2 size={14} />
              )}
              Issue &amp; lock
            </button>
          )}
        </div>
      </div>

      {!latestInvoice ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
          <Receipt size={32} className="!text-slate-300" />
          <h3 className="mt-4 text-base font-bold !text-slate-700">
            No invoice generated yet
          </h3>
          <p className="mt-1 max-w-sm text-sm !text-slate-500">
            Once charges and adjustments look right, generate the first
            invoice for this visit.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border !border-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b !border-slate-100 !bg-slate-50 px-5 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Invoice number
              </p>
              <p className="font-mono text-lg font-bold !text-slate-900">
                {latestInvoice.invoiceNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge status={latestInvoice.status} />

              <Link
                href={printHref(latestInvoice.id)}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 !bg-white px-3 py-1.5 text-xs font-medium !text-slate-600 transition hover:!border-blue-300 hover:!bg-blue-50 hover:!text-blue-700"
              >
                <Printer size={13} />
                Print
                {isStale && (
                  <span
                    className="ml-0.5 h-1.5 w-1.5 rounded-full !bg-amber-500"
                    title="This invoice's figures differ from current totals"
                  />
                )}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y !divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Subtotal
              </p>
              <p className="mt-1 text-lg font-semibold !text-slate-800">
                {formatCurrency(latestInvoice.subtotal)}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Discounts applied
              </p>
              <p className="mt-1 text-lg font-semibold !text-emerald-600">
                −{formatCurrency(latestInvoice.discountTotal)}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Total payable
              </p>
              <p className="mt-1 text-lg font-bold !text-slate-900">
                {formatCurrency(latestInvoice.totalPayable)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x !divide-slate-100 border-t !border-slate-100">
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Total paid
              </p>
              <p className="mt-1 text-lg font-semibold !text-emerald-600">
                {formatCurrency(latestInvoice.totalPaid)}
              </p>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs font-medium uppercase tracking-wide !text-slate-400">
                Outstanding
              </p>
              <p
                className={`mt-1 text-lg font-bold ${
                  Number(latestInvoice.outstandingBalance) > 0.01
                    ? '!text-amber-600'
                    : '!text-emerald-600'
                }`}
              >
                {formatCurrency(latestInvoice.outstandingBalance)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 border-t !border-slate-100 px-5 py-3 text-xs !text-slate-500">
            <span>Issued: {formatDateTime(latestInvoice.issuedAt)}</span>
            <span>Locked: {formatDateTime(latestInvoice.lockedAt)}</span>
          </div>
        </div>
      )}

      {invoices.length > 1 && (
        <div>
          <h3 className="mb-3 text-sm font-bold !text-slate-800">
            Invoice history ({invoices.length})
          </h3>

          <div className="overflow-hidden rounded-xl border !border-slate-200">
            <div className="divide-y !divide-slate-100">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                >
                  <span className="font-mono text-sm font-medium !text-slate-700">
                    {inv.invoiceNumber}
                  </span>
                  <StatusBadge status={inv.status} />
                  <span className="text-sm font-semibold !text-slate-800">
                    {formatCurrency(inv.totalPayable)}
                  </span>
                  {Number(inv.outstandingBalance) > 0.01 && (
                    <span className="text-xs font-medium !text-amber-600">
                      {formatCurrency(inv.outstandingBalance)} owed
                    </span>
                  )}
                  <Link
                    href={printHref(inv.id)}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 !bg-white px-2.5 py-1 text-xs font-medium !text-slate-600 transition hover:!border-blue-300 hover:!bg-blue-50 hover:!text-blue-700"
                  >
                    <Printer size={12} />
                    Print
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}