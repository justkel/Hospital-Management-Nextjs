import Link from 'next/link';
import SessionGuard from '@/components/SessionGuard';
import {
  FinancialTransactionDocument,
  FinancialTransactionQuery,
  FinancialTransactionQueryVariables,
  FinancialTransactionType,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';

const label = (value: string) =>
  value.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const money = (value: number, currency: string) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format(value);

export default async function FinancialTransactionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const type = Object.values(FinancialTransactionType).includes(query.type as FinancialTransactionType)
    ? (query.type as FinancialTransactionType)
    : undefined;
  const { data, authOutcome, message } = await graphqlFetch<
    FinancialTransactionQuery,
    FinancialTransactionQueryVariables
  >(FinancialTransactionDocument, { id, type });

  if (authOutcome === 'logout') return <SessionGuard mode="logout" reason={message} />;
  if (authOutcome === 'refresh') return <SessionGuard mode="refresh" />;
  const transaction = data?.financialTransaction;
  if (!transaction) return <SessionGuard mode="none"><div className="p-8 text-center">Transaction not found.</div></SessionGuard>;

  const fields = [
    ['Transaction', label(transaction.type)],
    ['Direction', label(transaction.direction)],
    ['Status', label(transaction.status)],
    ['Occurred', new Date(transaction.occurredAt).toLocaleString()],
    ['Amount', money(transaction.amount, transaction.currency)],
    ['Payment method', transaction.paymentMethod ? label(transaction.paymentMethod) : '—'],
    ['Reference', transaction.reference || '—'],
    ['Invoice', transaction.invoiceNumber || '—'],
    ['Staff', transaction.staffName || '—'],
    ['Reason', transaction.reason || '—'],
    ['Notes', transaction.notes || '—'],
  ];

  return (
    <SessionGuard mode="none">
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/dashboard/financials"
            className="group inline-flex items-center gap-1 text-sm font-medium !text-slate-500 hover:text-blue-600 transition-colors mb-6"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to financials
          </Link>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-5 sm:px-8 sm:py-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Transaction Details</h1>
                  <p className="mt-1.5 text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded-md inline-block">
                    ID: {transaction.id}
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  ● Completed
                </span>
              </div>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8">
              <dl className="grid gap-4 sm:grid-cols-2">
                {fields.map(([name, value]) => (
                  <div
                    key={name}
                    className="group rounded-xl bg-slate-50/80 px-4 py-3.5 transition-all hover:bg-slate-100/80 hover:shadow-sm"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      {name}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-slate-900 break-words">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {transaction.visitId && (
                <div className="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6">
                  <p className="text-sm text-slate-500">
                    Associated with visit #{transaction.visitId}
                  </p>
                  <Link
                    href={`/dashboard/visits/${transaction.visitId}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold !text-black shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-700 hover:shadow-slate-900/30 active:scale-95"
                  >
                    View Visit
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </SessionGuard>
  );
}
