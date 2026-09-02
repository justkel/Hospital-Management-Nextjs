"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Eye,
  FileText,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { FinancialsQuery } from "@/shared/graphql/generated/graphql";
import {
  DashboardPeriod,
  FinancialTransactionDirection,
  FinancialTransactionType,
} from "@/shared/graphql/generated/graphql";
import CollapsibleSection from "@/app/(protected)/dashboard/visits/components/CollapsibleSection";

type Financials = FinancialsQuery["financials"];

const money = (value: number, currency = "NGN") =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

const label = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

type SummaryCard = {
  title: string;
  value: number;
  description: string;
  scopeLabel: string;
  icon: LucideIcon;
  colors: string;
};

export default function FinancialsClient({
  financials,
}: {
  financials: Financials;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { summary } = financials;
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("");
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const applyQuery = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
        return;
      }

      params.set(key, value);
    });

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const showCustomDateRange = !period;
  const showPaymentMethodFilter =
    !type ||
    [
      FinancialTransactionType.Payment,
      FinancialTransactionType.BalancePayment,
      FinancialTransactionType.Wallet,
    ].includes(type as FinancialTransactionType);

  const filteredItems = useMemo(() => {
    const now = new Date();
    let periodStart: Date | null = null;
    if (period) {
      periodStart = new Date(now);
      if (period === DashboardPeriod.Today) periodStart.setHours(0, 0, 0, 0);
      if (period === DashboardPeriod.ThisWeek) {
        periodStart.setHours(0, 0, 0, 0);
        periodStart.setDate(
          periodStart.getDate() - ((periodStart.getDay() + 6) % 7),
        );
      }
      if (period === DashboardPeriod.ThisMonth) {
        periodStart.setHours(0, 0, 0, 0);
        periodStart.setDate(1);
      }
      if (period === DashboardPeriod.Last_24Hours) {
        periodStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }
      if (period === DashboardPeriod.Last_7Days) {
        periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      if (period === DashboardPeriod.Last_3Months) {
        periodStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }
    }
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (toDate) toDate.setSeconds(59, 999);
    const query = search.trim().toLowerCase();

    return financials.items.filter((item) => {
      const occurredAt = new Date(item.occurredAt);
      const textMatches =
        !query ||
        [
          item.patientName,
          item.visitId,
          item.invoiceNumber,
          item.reference,
          item.reason,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      return (
        textMatches &&
        (!periodStart || occurredAt >= periodStart) &&
        (!fromDate || occurredAt >= fromDate) &&
        (!toDate || occurredAt <= toDate) &&
        (!type || item.type === type) &&
        (!direction || item.direction === direction) &&
        (!status || item.status === status) &&
        (!paymentMethod || item.paymentMethod === paymentMethod)
      );
    });
  }, [
    financials.items,
    search,
    period,
    type,
    direction,
    status,
    paymentMethod,
    from,
    to,
  ]);

  const statuses = Array.from(
    new Set(financials.items.map((item) => item.status)),
  ).sort();
  const paymentMethods = Array.from(
    new Set(financials.items.map((item) => item.paymentMethod).filter(Boolean)),
  ).sort() as string[];

  const summaryCards: SummaryCard[] = [
    {
      title: "Gross billed",
      value: summary.grossBilled,
      description:
        "Latest invoice total per visit within the selected window; before discounts, credits, and adjustments are netted.",
      scopeLabel: "Time-scoped",
      icon: FileText,
      colors: "text-blue-700 bg-blue-50",
    },
    {
      title: "Unissued billable exposure",
      value: summary.unissuedBillableValue,
      description:
        "Current charge exposure for visits that still have no generated invoice; operational review only, not part of gross billed.",
      scopeLabel: "Operational",
      icon: Wallet,
      colors: "text-slate-700 bg-slate-100",
    },
    {
      title: "Gross collected",
      value: summary.grossCollected ?? summary.paymentsReceived,
      description:
        "Successful cash and settlement inflow captured in the current period; the direct counterpart to gross billed.",
      scopeLabel: "Time-scoped",
      icon: ArrowDownLeft,
      colors: "text-emerald-700 bg-emerald-50",
    },
    {
      title: "Outstanding balance",
      value: summary.outstandingBalance,
      description:
        "Current open balance across active invoices; kept fixed and not tied to the selected timeline.",
      scopeLabel: "Current state",
      icon: Wallet,
      colors: "text-amber-700 bg-amber-50",
    },
    {
      title: "Credits issued",
      value: summary.creditsCreated,
      description:
        "Credits created within the active time span; useful for credit memo and account adjustments.",
      scopeLabel: "Time-scoped",
      icon: CircleDollarSign,
      colors: "text-violet-700 bg-violet-50",
    },
    {
      title: "Net adjustments",
      value: summary.adjustmentsTotal,
      description:
        "Net adjustment impact after reversal and correction direction are applied; positive and negative movements are netted.",
      scopeLabel: "Time-scoped",
      icon: ArrowUpRight,
      colors: "text-orange-700 bg-orange-50",
    },
    {
      title: "Transactions",
      value: financials.total,
      description:
        "Visible ledger entries matched to the current page and active filters.",
      scopeLabel: "Filtered view",
      icon: FileText,
      colors: "text-slate-700 bg-slate-100",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-300">
            Finance
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            Financial transactions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
            Review organization-wide invoices, payments, credits, wallet
            activity, and billing adjustments.
          </p>
        </header>

        <CollapsibleSection
          title="Financial summary"
          icon={<Wallet size={15} />}
          iconColor="blue"
          defaultOpen={false}
        >
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {summaryCards.map(
              ({
                title,
                value,
                description,
                scopeLabel,
                icon: Icon,
                colors,
              }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors}`}
                    >
                      <Icon size={17} />
                    </span>
                    <strong className="text-lg font-bold text-slate-900">
                      {title === "Transactions"
                        ? value.toLocaleString()
                        : money(value)}
                    </strong>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {title}
                    </p>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
                      {scopeLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    {description}
                  </p>
                </div>
              ),
            )}
          </section>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Operational context
              </h3>
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
                Distinctions matter
              </span>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-blue-100 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                  Gross billed
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Issued invoice value. This is the official billed amount for the
                  selected window, based on the latest invoice per visit.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                  Unissued billable exposure
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Visits with charges but no generated invoice. This is an
                  operational signal, not a billed total.
                </p>
              </div>

              <div className="rounded-xl border border-amber-100 bg-white p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Outstanding balance
                </p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Current open balance across live invoices. This stays fixed and
                  is not tied to the selected timeline.
                </p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
        >
          <input
            value={search}
            onChange={(event) => {
              const value = event.target.value;
              setSearch(value);
              applyQuery({ search: value || undefined });
            }}
            placeholder="Search patient, visit ID, invoice, reference..."
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
          />

          <select
            value={period}
            onChange={(event) => {
              const nextPeriod = event.target.value;
              setPeriod(nextPeriod);
              setFrom("");
              setTo("");
              applyQuery({
                period: nextPeriod || undefined,
                from: undefined,
                to: undefined,
              });
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All dates</option>
            <option value={DashboardPeriod.Today}>Today</option>
            <option value={DashboardPeriod.ThisWeek}>This week</option>
            <option value={DashboardPeriod.ThisMonth}>This month</option>
            <option value={DashboardPeriod.Last_3Months}>Last 3 months</option>
            <option value={DashboardPeriod.Last_24Hours}>Last 24 hours</option>
            <option value={DashboardPeriod.Last_7Days}>Last 7 days</option>
          </select>

          <select
            value={type}
            onChange={(event) => {
              const nextType = event.target.value;
              setType(nextType);
              if (
                nextType &&
                ![
                  FinancialTransactionType.Payment,
                  FinancialTransactionType.BalancePayment,
                  FinancialTransactionType.Wallet,
                ].includes(nextType as FinancialTransactionType)
              ) {
                setPaymentMethod("");
              }
              applyQuery({
                type: nextType || undefined,
                paymentMethod:
                  nextType &&
                  [
                    FinancialTransactionType.Payment,
                    FinancialTransactionType.BalancePayment,
                    FinancialTransactionType.Wallet,
                  ].includes(nextType as FinancialTransactionType)
                    ? paymentMethod || undefined
                    : undefined,
              });
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All transaction types</option>
            {Object.values(FinancialTransactionType).map((type) => (
              <option key={type} value={type}>
                {label(type)}
              </option>
            ))}
          </select>

          <select
            value={direction}
            onChange={(event) => {
              const nextDirection = event.target.value;
              setDirection(nextDirection);
              applyQuery({ direction: nextDirection || undefined });
            }}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All directions</option>
            {Object.values(FinancialTransactionDirection).map((direction) => (
              <option key={direction} value={direction}>
                {label(direction)}
              </option>
            ))}
          </select>

          {showCustomDateRange && (
            <>
              <input
                value={from}
                onChange={(event) => {
                  const next = event.target.value;
                  setFrom(next);
                  applyQuery({ from: next || undefined });
                }}
                type="datetime-local"
                className="rounded-lg border !border-slate-200 px-3 py-2 text-sm"
              />
              <input
                value={to}
                onChange={(event) => {
                  const next = event.target.value;
                  setTo(next);
                  applyQuery({ to: next || undefined });
                }}
                type="datetime-local"
                className="rounded-lg border !border-slate-200 px-3 py-2 text-sm"
              />
            </>
          )}

          <select
            value={status}
            onChange={(event) => {
              const nextStatus = event.target.value;
              setStatus(nextStatus);
              applyQuery({ status: nextStatus || undefined });
            }}
            className="rounded-lg border !border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {statuses.map((value) => (
              <option key={value} value={value}>
                {label(value)}
              </option>
            ))}
          </select>

          {showPaymentMethodFilter && (
            <select
              value={paymentMethod}
              onChange={(event) => {
                const nextMethod = event.target.value;
                setPaymentMethod(nextMethod);
                applyQuery({ paymentMethod: nextMethod || undefined });
              }}
              className="rounded-lg border !border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All payment methods</option>
              {paymentMethods.map((value) => (
                <option key={value} value={value}>
                  {label(value)}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPeriod("");
              setType("");
              setDirection("");
              setStatus("");
              setPaymentMethod("");
              setFrom("");
              setTo("");
              router.push(pathname, { scroll: false });
            }}
            className="rounded-lg border !border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Clear filters
          </button>
        </form>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-slate-100 px-4 py-4 sm:px-5">
            <h2 className="text-base font-bold text-slate-900">
              Transaction ledger
            </h2>
            <p className="text-xs text-slate-500">
              {filteredItems.length.toLocaleString()} of{" "}
              {financials.total.toLocaleString()} records
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Transaction</th>
                  <th className="px-4 py-3 font-semibold">Patient / visit</th>
                  <th className="px-4 py-3 font-semibold">
                    Method / reference
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr
                    key={`${item.type}-${item.id}`}
                    className="cursor-pointer hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                      {new Date(item.occurredAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/financials/${item.id}?type=${item.type}`}
                          className="font-semibold text-blue-700 hover:underline"
                        >
                          {label(item.type)}
                        </Link>
                        <Link
                          href={`/dashboard/financials/${item.id}?type=${item.type}`}
                          aria-label={`View ${label(item.type)} transaction`}
                          className="rounded-md p-1 text-slate-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={15} />
                        </Link>
                      </div>
                      <p className="text-xs text-slate-500">
                        {label(item.direction)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {item.visitId ? (
                        <Link
                          href={`/dashboard/visits/${item.visitId}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {item.patientName || "Patient record"}
                        </Link>
                      ) : (
                        <span className="text-slate-600">
                          {item.patientName || "—"}
                        </span>
                      )}
                      {item.invoiceNumber && (
                        <p className="text-xs text-slate-500">
                          {item.invoiceNumber}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <p>
                        {item.paymentMethod ? label(item.paymentMethod) : "—"}
                      </p>
                      <p className="mt-1 text-slate-400">
                        {item.reference || item.reason || "—"}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-slate-900">
                      {money(item.amount, item.currency)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {label(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="px-5 py-14 text-center text-sm text-slate-500">
              No financial transactions found.
            </div>
          )}
        </section>

        {financials.pageCount > 1 && (
          <nav
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm"
            aria-label="Financial transactions pagination"
          >
            <span className="text-xs text-slate-500">
              Page {financials.page} of {financials.pageCount}
            </span>
            <div className="flex items-center gap-2">
              {financials.page > 1 && (
                <Link
                  href={`/dashboard/financials?page=${financials.page - 1}`}
                  className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Previous
                </Link>
              )}
              {financials.page < financials.pageCount && (
                <Link
                  href={`/dashboard/financials?page=${financials.page + 1}`}
                  className="rounded-lg bg-slate-900 px-3 py-2 font-medium text-white hover:bg-slate-700"
                >
                  Next
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}
