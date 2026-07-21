'use client';

import { useMemo, useState } from 'react';
import { Tabs } from 'antd';
import {
  Activity,
  FileText,
  Receipt,
  Wallet,
  Sparkles,
} from 'lucide-react';

import {
  GetVisitByIdQuery,
  GetVisitChargeSummaryQuery,
  GetUnbilledPrescriptionsQuery,
  GetBillingAdjustmentsQuery,
  GetLatestVisitInvoiceQuery,
  GetVisitInvoicesQuery,
  GetVisitPaymentsQuery,
} from '@/shared/graphql/generated/graphql';

import ChargeSummaryTab from './components/ChargeSummaryTab';
import AdjustmentsTab from './components/AdjustmentsTab';
import InvoicesTab from './components/InvoicesTab';
import PaymentsTab from './components/PaymentsTab';

export type ChargeSummary = NonNullable<
  GetVisitChargeSummaryQuery['visitChargeSummary']
>;
export type ChargeRow = ChargeSummary['lockedCharges'][number];
export type UnbilledPrescription =
  GetUnbilledPrescriptionsQuery['unbilledPrescriptions'][number];
export type Adjustment = GetBillingAdjustmentsQuery['billingAdjustments'][number];
export type InvoiceRow = NonNullable<
  GetLatestVisitInvoiceQuery['latestVisitInvoice']
>;
export type PaymentRow = GetVisitPaymentsQuery['visitPayments'][number];

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function BillingClient({
  visit,
  initialSummary,
  initialUnbilled,
  initialAdjustments,
  initialLatestInvoice,
  initialInvoices,
  initialPayments,
}: {
  visit: GetVisitByIdQuery['visit'];
  initialSummary: ChargeSummary;
  initialUnbilled: UnbilledPrescription[];
  initialAdjustments: Adjustment[];
  initialLatestInvoice: InvoiceRow | null;
  initialInvoices: InvoiceRow[];
  initialPayments: PaymentRow[];
}) {
  const [summary, setSummary] = useState<ChargeSummary>(initialSummary);
  const [unbilled, setUnbilled] = useState<UnbilledPrescription[]>(
    initialUnbilled
  );
  const [adjustments, setAdjustments] =
    useState<Adjustment[]>(initialAdjustments);
  const [latestInvoice, setLatestInvoice] = useState<InvoiceRow | null>(
    initialLatestInvoice
  );
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initialInvoices);
  const [payments, setPayments] = useState<PaymentRow[]>(initialPayments);

  const [activeTab, setActiveTab] = useState('summary');

  const charges = useMemo(
    () => [...summary.lockedCharges, ...summary.editableCharges],
    [summary]
  );

  const pendingAdjustments = adjustments.filter(
    (a) => a.status === 'REQUESTED'
  ).length;

  const outstandingPrescriptions = unbilled.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-3 lg:px-3 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-6">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <Sparkles size={13} />
                Billing workspace
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Visit billing
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-500">
                Review charges, manage adjustments, generate invoices, and
                record payments for this visit — all in one place.
              </p>
            </div>

            <div className="mb-6 h-px bg-slate-100" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Activity size={16} />
                  </div>
                  <span className="text-xl font-semibold text-slate-900 sm:text-2xl">
                    {formatCurrency(summary.total)}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Current total
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Receipt size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">
                    {outstandingPrescriptions}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Unpriced prescriptions
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <FileText size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">
                    {pendingAdjustments}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Adjustments awaiting review
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Wallet size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">
                    {payments.length}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500">
                  Payments recorded
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="px-4 pt-4 sm:px-6">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              destroyOnHidden
              items={[
                {
                  key: 'summary',
                  label: 'Charge summary',
                  children: (
                    <ChargeSummaryTab
                      visitId={visit.id}
                      summary={summary}
                      unbilled={unbilled}
                      onSummaryChange={setSummary}
                      onUnbilledChange={setUnbilled}
                    />
                  ),
                },
                {
                  key: 'adjustments',
                  label: (
                    <span>
                      Adjustments
                      {pendingAdjustments > 0 && (
                        <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-100 px-1.5 text-[11px] font-bold text-amber-700">
                          {pendingAdjustments}
                        </span>
                      )}
                    </span>
                  ),
                  children: (
                    <AdjustmentsTab
                      visitId={visit.id}
                      adjustments={adjustments}
                      charges={charges}
                      onAdjustmentsChange={setAdjustments}
                    />
                  ),
                },
                {
                  key: 'invoices',
                  label: 'Invoices',
                  children: (
                    <InvoicesTab
                      visitId={visit.id}
                      latestInvoice={latestInvoice}
                      invoices={invoices}
                      onLatestInvoiceChange={setLatestInvoice}
                      onInvoicesChange={setInvoices}
                    />
                  ),
                },
                {
                  key: 'payments',
                  label: 'Payments',
                  children: (
                    <PaymentsTab
                      visitId={visit.id}
                      payments={payments}
                      charges={charges}
                      latestInvoice={latestInvoice}
                      onPaymentsChange={setPayments}
                      onLatestInvoiceChange={setLatestInvoice}
                    />
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}