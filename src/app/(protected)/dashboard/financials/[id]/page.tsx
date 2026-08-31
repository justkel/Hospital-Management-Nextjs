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
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5">
          <Link href="/dashboard/financials" className="text-sm font-semibold text-blue-700 hover:underline">← Back to financials</Link>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h1 className="text-2xl font-bold text-slate-900">Transaction details</h1>
            <p className="mt-1 break-all font-mono text-xs text-slate-400">{transaction.id}</p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {fields.map(([name, value]) => (
                <div key={name} className="rounded-xl bg-slate-50 p-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{name}</dt>
                  <dd className="mt-1 break-words text-sm font-medium text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            {transaction.visitId && <Link href={`/dashboard/visits/${transaction.visitId}`} className="mt-6 inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Open visit</Link>}
          </section>
        </div>
      </main>
    </SessionGuard>
  );
}
