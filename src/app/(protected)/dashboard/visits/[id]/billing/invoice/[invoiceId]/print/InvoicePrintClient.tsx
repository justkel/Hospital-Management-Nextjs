'use client';

import { Printer } from 'lucide-react';
import { GetVisitInvoiceDetailQuery } from '@/shared/graphql/generated/graphql';

type Detail = NonNullable<GetVisitInvoiceDetailQuery['visitInvoiceDetail']>;
type AdjustmentSnapshot = Detail['adjustmentSnapshots'][number];

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const REDUCING_TYPES = ['DISCOUNT', 'WAIVER', 'WRITE_OFF', 'INSURANCE'];

function isReducing(snapshot: AdjustmentSnapshot): boolean {
  if (
    snapshot.type === 'CORRECTION' ||
    snapshot.type === 'ADJUSTMENT_REVERSAL'
  ) {
    return snapshot.direction === 'DECREASE';
  }

  return REDUCING_TYPES.includes(snapshot.type);
}

export default function InvoicePrintClient({ detail }: { detail: Detail }) {
  const {
    invoice,
    lineItems,
    adjustmentSnapshots,
    payments,
    credits,
    balancePayments,
    outstandingBalance,
  } = detail;

  const successfulPayments = payments.filter((p) => p.status === 'SUCCESS');
  const successfulCredits = credits.filter((c) => c.status === 'SUCCESS');
  const successfulBalancePayments = balancePayments.filter(
    (p) => p.status === 'SUCCESS'
  );

  const organization = invoice.organization;
  const visit = invoice.visit;
  const patient = visit?.patient;

  const organizationAddress = [
    organization?.address?.addressLine1,
    organization?.address?.city,
    organization?.address?.state,
    organization?.address?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const organizationContact = [
    organization?.phoneNumber,
    organization?.email,
    organization?.website,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex justify-end print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:bg-slate-800"
          >
            <Printer size={15} />
            Print invoice
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 print:rounded-none print:border-0 print:p-0 sm:p-10">
          {organization && (
            <div className="mb-6 border-b border-slate-200 pb-6 print:border-slate-300">
              <h2 className="text-xl font-bold text-slate-900">
                {organization.name}
              </h2>
              {organizationAddress && (
                <p className="mt-1 text-xs text-slate-500">
                  {organizationAddress}
                </p>
              )}
              {organizationContact && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {organizationContact}
                </p>
              )}
            </div>
          )}

          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Invoice</h1>
              <p className="mt-1 font-mono text-sm text-slate-500">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Status
              </p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {invoice.status.replace(/_/g, ' ')}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Issued: {formatDate(invoice.issuedAt)}
              </p>
            </div>
          </div>

          {(patient || visit) && (
            <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-2 print:border print:border-slate-200 print:bg-white">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Billed to
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {patient?.fullName ?? '—'}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {patient?.gender ? `${patient.gender} · ` : ''}
                  DOB: {formatDate(patient?.dateOfBirth)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Visit
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  {visit?.visitType?.replace(/_/g, ' ') ?? '—'}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatDate(visit?.visitDateTime)}
                </p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Charges
            </h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 font-medium">Description</th>
                  <th className="py-2 text-right font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Unit price</th>
                  <th className="py-2 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 text-center text-slate-400"
                    >
                      No charges recorded on this invoice.
                    </td>
                  </tr>
                ) : (
                  lineItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100">
                      <td className="py-2.5 text-slate-700">
                        {item.chargeName}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-800">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {adjustmentSnapshots.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                Adjustments
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Reason</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {adjustmentSnapshots.map((snap) => {
                    const reducing = isReducing(snap);
                    return (
                      <tr key={snap.id} className="border-b border-slate-100">
                        <td className="py-2.5 text-slate-700">
                          {snap.type.replace(/_/g, ' ')}
                        </td>
                        <td className="py-2.5 text-slate-500">
                          {snap.reason}
                        </td>
                        <td
                          className={`py-2.5 text-right font-medium ${
                            reducing ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {reducing ? '−' : '+'}
                          {formatCurrency(snap.resolvedAmount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mb-8 flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-600">
              <span>Discounts</span>
              <span>−{formatCurrency(invoice.discountTotal)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
              <span>Total payable</span>
              <span>{formatCurrency(invoice.totalPayable)}</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
              Payments
            </h2>
            {successfulPayments.length === 0 ? (
              <p className="text-sm text-slate-400">
                No payments recorded yet.
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Method</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulPayments.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-2.5 text-slate-600">
                        {formatDate(p.paidAt)}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {p.paymentMethod}
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-800">
                        {formatCurrency(p.amountPaid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {successfulBalancePayments.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                Balance payments
              </h2>
              <p className="mb-2 text-xs text-slate-400">
                Paid against the visit&apos;s overall balance, not a specific
                charge above.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Method</th>
                    <th className="py-2 font-medium">Reason</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulBalancePayments.map((p) => (
                    <tr key={p.id} className="border-b border-slate-100">
                      <td className="py-2.5 text-slate-600">
                        {formatDate(p.paidAt)}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {p.paymentMethod}
                      </td>
                      <td className="py-2.5 text-slate-500">{p.reason}</td>
                      <td className="py-2.5 text-right font-medium text-slate-800">
                        {formatCurrency(p.amountPaid)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {successfulCredits.length > 0 && (
            <div className="mb-8">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">
                Refunds
              </h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Method</th>
                    <th className="py-2 font-medium">Reason</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {successfulCredits.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100">
                      <td className="py-2.5 text-slate-600">
                        {formatDate(c.confirmedAt)}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {c.method.replace(/_/g, ' ')}
                        {c.visitCharge?.chargeName &&
                          ` · ${c.visitCharge.chargeName}`}
                      </td>
                      <td className="py-2.5 text-slate-500">{c.reason}</td>
                      <td className="py-2.5 text-right font-medium text-red-600">
                        −{formatCurrency(c.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div
            className={`flex items-center justify-between rounded-xl px-5 py-4 ${
              outstandingBalance > 0
                ? 'bg-amber-50 print:border print:border-amber-300'
                : 'bg-emerald-50 print:border print:border-emerald-300'
            }`}
          >
            <span className="text-sm font-bold text-slate-700">
              {outstandingBalance > 0 ? 'Outstanding balance' : 'Fully paid'}
            </span>
            <span className="text-lg font-bold text-slate-900">
              {formatCurrency(outstandingBalance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}