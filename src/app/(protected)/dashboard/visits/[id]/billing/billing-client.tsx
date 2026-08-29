'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import {
  AlertTriangle,
  FileText,
  LayoutList,
  ShieldCheck,
  Sparkles,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { NairaIcon } from '@/components/icon/NairaIcon';

import {
  GetVisitBillingPageQuery,
  VisitStatus,
} from '@/shared/graphql/generated/graphql';
import { usePathname, useSearchParams } from 'next/navigation';
import { HasRoles, useHasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

import ChargeSummaryTab from './components/ChargeSummaryTab';
import AdjustmentsTab from './components/AdjustmentsTab';
import InvoicesTab from './components/InvoicesTab';
import PaymentsTab from './components/PaymentsTab';
import CreditsTab from './components/CreditsTab';
import PatientOutstandingBalance from '../../components/PatientOutstandingBalance';
import ReconcileVisitModal, {
  ReconciledVisitResult,
} from './components/ReconcileVisitModal';
import BillingTabErrorBoundary from './components/BillingTabErrorBoundary';

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

  const [visitStatus, setVisitStatus] = useState<VisitStatus | undefined>(
    visit.status
  );
  const [reconciledInfo, setReconciledInfo] =
    useState<ReconciledVisitResult | null>(null);
  const [reconcileModalOpen, setReconcileModalOpen] = useState(false);

  const canManageReconciliation = useHasRoles([
    Roles.GUEST,
    Roles.ADMIN,
    Roles.BILLING_OFFICER,
  ]);

  const isReconciled = visitStatus === VisitStatus.Reconciled;

  const handleReconciled = useCallback((updatedVisit: ReconciledVisitResult) => {
    setVisitStatus(updatedVisit.status);
    setReconciledInfo(updatedVisit);
  }, []);

  const handleSummaryChange = useCallback((value: ChargeSummary) => {
    setSummary({
      ...value,
      lockedCharges: value?.lockedCharges ?? [],
      editableCharges: value?.editableCharges ?? [],
    });
  }, []);
  const handleUnbilledChange = useCallback((value: UnbilledPrescription[]) => {
    setUnbilled(value ?? []);
  }, []);
  const handleAdjustmentsChange = useCallback((value: Adjustment[]) => {
    setAdjustments(value ?? []);
  }, []);
  const handleLatestInvoiceChange = useCallback((value: InvoiceRow | null) => {
    setLatestInvoice(value);
  }, []);
  const handleInvoicesChange = useCallback((value: InvoiceRow[]) => {
    setInvoices(value ?? []);
  }, []);
  const handlePaymentsChange = useCallback((value: PaymentRow[]) => {
    setPayments(value ?? []);
  }, []);
  const handleCreditsChange = useCallback((value: CreditRow[]) => {
    setCredits(value ?? []);
  }, []);
  const handleCreditBalanceChange = useCallback((value: number) => {
    setCreditBalance(value);
  }, []);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTabState] = useState<TabKey>(
    isTabKey(tabParam) ? tabParam : 'summary',
  );

  useEffect(() => {
    setActiveTabState(isTabKey(tabParam) ? tabParam : 'summary');
  }, [tabParam]);

  const setActiveTab = useCallback(
    (tab: TabKey) => {
      setActiveTabState(tab);
      const params = new URLSearchParams(window.location.search);
      if (tab === 'summary') {
        params.delete('tab');
      } else {
        params.set('tab', tab);
      }
      const query = params.toString();
      window.history.replaceState(
        window.history.state,
        '',
        `${pathname}${query ? `?${query}` : ''}`,
      );
    },
    [pathname],
  );

  useEffect(() => {
    const handlePopState = () => {
      const value = new URLSearchParams(window.location.search).get('tab');
      setActiveTabState(isTabKey(value) ? value : 'summary');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    { key: 'invoices', label: 'Invoices', icon: NairaIcon },
    { key: 'payments', label: 'Payments', icon: Wallet },
    {
      key: 'credits',
      label: 'Credits',
      icon: NairaIcon,
      alert: hasCreditBalance,
    },
  ];

  return (
    <div className="min-h-screen !bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl space-y-5 px-3 py-3 sm:space-y-6 sm:px-4 lg:px-3">
        <PatientOutstandingBalance patientId={visit.patientId} />
        <div className="relative overflow-hidden rounded-2xl border !border-slate-200/80 !bg-white">
          <div className="px-4 py-5 sm:px-8 sm:py-8">
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="mb-3.5 inline-flex max-w-full items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
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

              <HasRoles roles={[Roles.ADMIN, Roles.BILLING_OFFICER, Roles.GUEST]}>
                <div className="flex items-stretch gap-1.5 sm:flex-col sm:items-end">
                  <button
                    type="button"
                    disabled={isReconciled}
                    onClick={() => setReconcileModalOpen(true)}
                    className={`
                      inline-flex items-center justify-center gap-2 
                      rounded-xl px-3 sm:px-4 py-2.5 
                      text-xs sm:text-sm font-bold !text-white 
                      transition-all duration-200 
                      min-h-[44px] w-full sm:w-auto sm:min-h-11
                      disabled:cursor-not-allowed
                      ${isReconciled
                                          ? '!bg-slate-300 !hover:bg-slate-300'
                                          : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-700'
                                        }
                    `}
                  >
                    <ShieldCheck size={16} className="shrink-0" />
                    <span className="whitespace-nowrap">
                      {isReconciled ? 'Visit reconciled' : 'Reconcile visit'}
                    </span>
                  </button>
                  {isReconciled && reconciledInfo?.reconciledByStaff && (
                    <span className="self-center text-[11px] font-medium !text-slate-400 sm:self-auto">
                      By {reconciledInfo.reconciledByStaff.fullName}
                    </span>
                  )}
                </div>
              </HasRoles>
            </div>

            {!canManageReconciliation && isReconciled && (
              <div className="mb-6 flex items-start gap-2 rounded-xl border !border-emerald-200 !bg-emerald-50 px-4 py-3 text-xs font-semibold !text-emerald-700 sm:items-center">
                <ShieldCheck size={15} />
                This visit has been reconciled and is now closed for billing.
              </div>
            )}

            {hasCreditBalance && (
              <div className="mb-6 flex flex-col items-stretch gap-3 rounded-2xl border !border-amber-200 !bg-amber-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-start gap-3 sm:items-center">
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
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border !border-amber-300 !bg-white px-3 py-1.5 text-xs font-bold !text-amber-700 transition hover:!bg-amber-100"
                >
                  Go to Credits
                </button>
              </div>
            )}

            <div className="mb-6 h-px !bg-slate-100" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border !border-slate-100 !bg-slate-50/80 p-4 sm:p-5">
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xl font-semibold !text-slate-900 sm:text-2xl">
                    {formatCurrency(summary.total)}
                  </span>
                </div>
                <p className="text-xs font-medium !text-slate-500">
                  Current total
                </p>
              </div>

              <div className="rounded-xl border !border-slate-100 !bg-slate-50/80 p-4 sm:p-5">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-amber-100 !text-amber-600">
                    <NairaIcon size={16} />
                  </div>
                  <span className="text-2xl font-semibold !text-slate-900">
                    {outstandingPrescriptions}
                  </span>
                </div>
                <p className="text-xs font-medium !text-slate-500">
                  Unpriced prescriptions
                </p>
              </div>

              <div className="rounded-xl border !border-slate-100 !bg-slate-50/80 p-4 sm:p-5">
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
          <div className="border-b !border-slate-100 px-2 pt-2 sm:px-5 sm:pt-3">
            <div className="flex gap-1 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-1.5 sm:pb-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;

                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`group relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 sm:rounded-2xl sm:px-4 sm:text-sm ${isActive
                      ? '!bg-slate-900 !text-white shadow-md shadow-slate-900/10'
                      : '!text-slate-500 hover:!bg-slate-100 hover:!text-slate-800'
                      }`}
                  >
                    <Icon
                      size={16}
                      className={`shrink-0 transition-colors ${isActive
                        ? '!text-white'
                        : '!text-slate-400 group-hover:!text-slate-600'
                        }`}
                    />
                    <span className="whitespace-nowrap">{tab.label}</span>

                    {tab.badge !== undefined && (
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${isActive
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

          <div className="px-3 sm:px-6">
            <div className={activeTab === 'summary' ? '' : 'hidden'}>
              <BillingTabErrorBoundary tabName="charge summary">
                <ChargeSummaryTab
                visitId={visit.id}
                summary={summary}
                unbilled={unbilled}
                isReconciled={isReconciled}
                onSummaryChange={handleSummaryChange}
                onUnbilledChange={handleUnbilledChange}
                />
              </BillingTabErrorBoundary>
            </div>

            <div className={activeTab === 'adjustments' ? '' : 'hidden'}>
              <BillingTabErrorBoundary tabName="adjustments">
                <AdjustmentsTab
                visitId={visit.id}
                adjustments={adjustments}
                charges={charges}
                isReconciled={isReconciled}
                onAdjustmentsChange={handleAdjustmentsChange}
                />
              </BillingTabErrorBoundary>
            </div>

            <div className={activeTab === 'invoices' ? '' : 'hidden'}>
              <BillingTabErrorBoundary tabName="invoices">
                <InvoicesTab
                visitId={visit.id}
                latestInvoice={latestInvoice}
                invoices={invoices}
                isReconciled={isReconciled}
                onLatestInvoiceChange={handleLatestInvoiceChange}
                onInvoicesChange={handleInvoicesChange}
                />
              </BillingTabErrorBoundary>
            </div>

            <div className={activeTab === 'payments' ? '' : 'hidden'}>
              <BillingTabErrorBoundary tabName="payments">
                <PaymentsTab
                visitId={visit.id}
                patientId={visit.patientId}
                payments={payments}
                charges={charges}
                latestInvoice={latestInvoice}
                isReconciled={isReconciled}
                onPaymentsChange={handlePaymentsChange}
                onLatestInvoiceChange={handleLatestInvoiceChange}
                />
              </BillingTabErrorBoundary>
            </div>

            <div className={activeTab === 'credits' ? '' : 'hidden'}>
              <BillingTabErrorBoundary tabName="credits">
                <CreditsTab
                visitId={visit.id}
                patientId={visit.patientId}
                charges={charges}
                credits={credits}
                creditBalance={creditBalance}
                isReconciled={isReconciled}
                onCreditsChange={handleCreditsChange}
                onCreditBalanceChange={handleCreditBalanceChange}
                />
              </BillingTabErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      <HasRoles roles={[Roles.ADMIN, Roles.BILLING_OFFICER, Roles.GUEST]}>
        <ReconcileVisitModal
          visitId={visit.id}
          open={reconcileModalOpen}
          onClose={() => setReconcileModalOpen(false)}
          onReconciled={handleReconciled}
        />
      </HasRoles>
    </div>
  );
}