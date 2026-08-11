'use client';

import { useMemo, useState, useCallback } from 'react';
import {
  AlertTriangle,
  CircleDollarSign,
  FileText,
  LayoutList,
  Receipt,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import {
  GetVisitBillingPageQuery,
} from '@/shared/graphql/generated/graphql';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import ChargeSummaryTab from './components/ChargeSummaryTab';
import AdjustmentsTab from './components/AdjustmentsTab';
import InvoicesTab from './components/InvoicesTab';
import PaymentsTab from './components/PaymentsTab';
import CreditsTab from './components/CreditsTab';

export type ChargeSummary = NonNullable<
  GetVisitBillingPageQuery['visitChargeSummary']
>;
export type ChargeRow = ChargeSummary['lockedCharges'][number];
export type UnbilledPrescription =
  GetVisitBillingPageQuery['unbilledPrescriptions'][number];
export type Adjustment = GetVisitBillingPageQuery['billingAdjustments'][number];
export type InvoiceRow = NonNullable<
  GetVisitBillingPageQuery['latestVisitInvoice']
>;
export type PaymentRow = GetVisitBillingPageQuery['visitPayments'][number];
export type CreditRow = GetVisitBillingPageQuery['visitCredits'][number];

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type TabKey = 'summary' | 'adjustments' | 'invoices' | 'payments' | 'credits';

const TAB_KEYS: TabKey[] = ['summary', 'adjustments', 'invoices', 'payments', 'credits'];

function isTabKey(value: string | null): value is TabKey {
  return !!value && (TAB_KEYS as string[]).includes(value);
}

interface TabConfig {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  badge?: number;
  alert?: boolean;
}

export default function BillingClient({
  visit,
  initialSummary,
  initialUnbilled,
  initialAdjustments,
  initialLatestInvoice,
  initialInvoices,
  initialPayments,
  initialCredits,
  initialCreditBalance,
}: {
  visit: GetVisitBillingPageQuery['visit'];
  initialSummary: ChargeSummary;
  initialUnbilled: UnbilledPrescription[];
  initialAdjustments: Adjustment[];
  initialLatestInvoice: InvoiceRow | null;
  initialInvoices: InvoiceRow[];
  initialPayments: PaymentRow[];
  initialCredits: CreditRow[];
  initialCreditBalance: number;
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
  const [credits, setCredits] = useState<CreditRow[]>(initialCredits);
  const [creditBalance, setCreditBalance] = useState<number>(
    initialCreditBalance
  );

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = isTabKey(tabParam) ? tabParam : 'summary';

  const setActiveTab = useCallback(
    (tab: TabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'summary') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      const query = params.toString();
      router.replace(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const charges = useMemo(
    () => [...summary.lockedCharges, ...summary.editableCharges],
    [summary]
  );

  const pendingAdjustments = adjustments.filter(
    (a) => a.status === 'REQUESTED'
  ).length;

  const outstandingPrescriptions = unbilled.length;

  const hasCreditBalance = creditBalance > 0.01;

  const tabs: TabConfig[] = [
    { key: 'summary', label: 'Charge summary', icon: LayoutList },
    {
      key: 'adjustments',
      label: 'Adjustments',
      icon: FileText,
      badge: pendingAdjustments > 0 ? pendingAdjustments : undefined,
    },
    { key: 'invoices', label: 'Invoices', icon: Receipt },
    { key: 'payments', label: 'Payments', icon: Wallet },
    {
      key: 'credits',
      label: 'Credits',
      icon: CircleDollarSign,
      alert: hasCreditBalance,
    },
  ];

  return (
    <div className="min-h-screen !bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-3 lg:px-3 space-y-6">
        <div className="relative overflow-hidden rounded-2xl border !border-slate-200/80 !bg-white">
          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-6">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
                <Sparkles size={13} />
                Billing workspace
              </div>

              <h1 className="text-2xl font-semibold tracking-tight !text-slate-900 sm:text-3xl">
                Visit billing
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-slate-500">
                Review charges, manage adjustments, generate invoices, and
                record payments for this visit — all in one place.
              </p>
            </div>

            {hasCreditBalance && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border !border-amber-200 !bg-amber-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="shrink-0 !text-amber-600" />
                  <div>
                    <p className="text-sm font-bold !text-amber-900">
                      This visit has a credit balance of{' '}
                      {formatCurrency(creditBalance)}
                    </p>
                    <p className="text-xs !text-amber-700">
                      Money is owed back — process it from the Credits tab.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('credits')}
                  className="rounded-lg border !border-amber-300 !bg-white px-3 py-1.5 text-xs font-bold !text-amber-700 transition hover:!bg-amber-100"
                >
                  Go to Credits
                </button>
              </div>
            )}

            <div className="mb-6 h-px !bg-slate-100" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl !bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xl font-semibold !text-slate-900 sm:text-2xl">
                    {formatCurrency(summary.total)}
                  </span>
                </div>
                <p className="text-xs font-medium !text-slate-500">
                  Current total
                </p>
              </div>

              <div className="rounded-xl !bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-amber-100 !text-amber-600">
                    <Receipt size={16} />
                  </div>
                  <span className="text-2xl font-semibold !text-slate-900">
                    {outstandingPrescriptions}
                  </span>
                </div>
                <p className="text-xs font-medium !text-slate-500">
                  Unpriced prescriptions
                </p>
              </div>

              <div className="rounded-xl !bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-orange-100 !text-orange-600">
                    <FileText size={16} />
                  </div>
                  <span className="text-2xl font-semibold !text-slate-900">
                    {pendingAdjustments}
                  </span>
                </div>
                <p className="text-xs font-medium !text-slate-500">
                  Adjustments awaiting review
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border !border-slate-200/70 !bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="border-b !border-slate-100 px-3 pt-3 sm:px-5">
            <div className="flex gap-1.5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`group relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? '!bg-slate-900 !text-white shadow-md shadow-slate-900/10'
                        : '!text-slate-500 hover:!bg-slate-100 hover:!text-slate-800'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${
                        isActive
                          ? '!text-white'
                          : '!text-slate-400 group-hover:!text-slate-600'
                      }`}
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>

                    {tab.badge !== undefined && (
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                          isActive
                            ? '!bg-white/20 !text-white'
                            : '!bg-amber-100 !text-amber-700'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}

                    {tab.alert && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full !bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 sm:px-6">
            {activeTab === 'summary' && (
              <ChargeSummaryTab
                visitId={visit.id}
                summary={summary}
                unbilled={unbilled}
                onSummaryChange={setSummary}
                onUnbilledChange={setUnbilled}
              />
            )}

            {activeTab === 'adjustments' && (
              <AdjustmentsTab
                visitId={visit.id}
                adjustments={adjustments}
                charges={charges}
                onAdjustmentsChange={setAdjustments}
              />
            )}

            {activeTab === 'invoices' && (
              <InvoicesTab
                visitId={visit.id}
                latestInvoice={latestInvoice}
                invoices={invoices}
                onLatestInvoiceChange={setLatestInvoice}
                onInvoicesChange={setInvoices}
              />
            )}

            {activeTab === 'payments' && (
              <PaymentsTab
                visitId={visit.id}
                patientId={visit.patientId}
                payments={payments}
                charges={charges}
                latestInvoice={latestInvoice}
                onPaymentsChange={setPayments}
                onLatestInvoiceChange={setLatestInvoice}
              />
            )}

            {activeTab === 'credits' && (
              <CreditsTab
                visitId={visit.id}
                patientId={visit.patientId}
                charges={charges}
                credits={credits}
                creditBalance={creditBalance}
                onCreditsChange={setCredits}
                onCreditBalanceChange={setCreditBalance}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}