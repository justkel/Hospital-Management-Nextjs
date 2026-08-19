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

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatValue(value: string | number | null | undefined) {
  return value === null || value === undefined || value === ''
    ? '—'
    : escapeHtml(value);
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

export function generateInvoicePrintHTML(detail: Detail) {
  const {
    invoice,
    lineItems,
    adjustmentSnapshots,
    payments,
    credits,
    balancePayments,
    outstandingBalance,
  } = detail;

  const successfulPayments = payments.filter((payment) => {
    return payment.status === 'SUCCESS';
  });

  const successfulCredits = credits.filter((credit) => {
    return credit.status === 'SUCCESS';
  });

  const successfulBalancePayments = balancePayments.filter((payment) => {
    return payment.status === 'SUCCESS';
  });

  const organization = invoice.organization;
  const visit = invoice.visit;
  const patient = visit?.patient;

  const organizationName =
    organization?.name || 'Hospital Management System';

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
    .join(' | ');

  const chargeRows =
    lineItems.length === 0
      ? `
        <tr>
          <td colspan="4" class="empty-cell">
            No charges recorded on this invoice.
          </td>
        </tr>
      `
      : lineItems
          .map(
            (item) => `
              <tr>
                <td>${formatValue(item.chargeName)}</td>
                <td class="text-right">${formatValue(item.quantity)}</td>
                <td class="text-right">
                  ${formatCurrency(item.unitPrice)}
                </td>
                <td class="text-right amount">
                  ${formatCurrency(item.totalAmount)}
                </td>
              </tr>
            `,
          )
          .join('');

  const adjustmentSection =
    adjustmentSnapshots.length === 0
      ? ''
      : `
        <section class="section">
          <div class="section-title">Adjustments</div>

          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reason</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              ${adjustmentSnapshots
                .map((snapshot) => {
                  const reducing = isReducing(snapshot);

                  return `
                    <tr>
                      <td>
                        ${escapeHtml(
                          snapshot.type.replace(/_/g, ' '),
                        )}
                      </td>

                      <td>
                        ${formatValue(snapshot.reason)}
                      </td>

                      <td class="text-right ${
                        reducing ? 'amount-reducing' : 'amount-increasing'
                      }">
                        ${reducing ? '−' : '+'}
                        ${formatCurrency(snapshot.resolvedAmount)}
                      </td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </section>
      `;

  const paymentSection = `
    <section class="section">
      <div class="section-title">Payments</div>

      ${
        successfulPayments.length === 0
          ? `
            <div class="empty-state">
              No payments recorded yet.
            </div>
          `
          : `
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Method</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                ${successfulPayments
                  .map(
                    (payment) => `
                      <tr>
                        <td>${formatDate(payment.paidAt)}</td>
                        <td>${formatValue(payment.paymentMethod)}</td>
                        <td class="text-right amount">
                          ${formatCurrency(payment.amountPaid)}
                        </td>
                      </tr>
                    `,
                  )
                  .join('')}
              </tbody>
            </table>
          `
      }
    </section>
  `;

  const balancePaymentSection =
    successfulBalancePayments.length === 0
      ? ''
      : `
        <section class="section">
          <div class="section-title">Balance Payments</div>

          <p class="section-description">
            Paid against the visit's overall balance, not a specific charge.
          </p>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Reason</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              ${successfulBalancePayments
                .map(
                  (payment) => `
                    <tr>
                      <td>${formatDate(payment.paidAt)}</td>
                      <td>${formatValue(payment.paymentMethod)}</td>
                      <td>${formatValue(payment.reason)}</td>
                      <td class="text-right amount">
                        ${formatCurrency(payment.amountPaid)}
                      </td>
                    </tr>
                  `,
                )
                .join('')}
            </tbody>
          </table>
        </section>
      `;

  const refundSection =
    successfulCredits.length === 0
      ? ''
      : `
        <section class="section">
          <div class="section-title">Refunds</div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Reason</th>
                <th class="text-right">Amount</th>
              </tr>
            </thead>

            <tbody>
              ${successfulCredits
                .map(
                  (credit) => `
                    <tr>
                      <td>${formatDate(credit.confirmedAt)}</td>

                      <td>
                        ${escapeHtml(credit.method.replace(/_/g, ' '))}
                        ${
                          credit.visitCharge?.chargeName
                            ? ` | ${escapeHtml(
                                credit.visitCharge.chargeName,
                              )}`
                            : ''
                        }
                      </td>

                      <td>${formatValue(credit.reason)}</td>

                      <td class="text-right amount-refund">
                        −${formatCurrency(credit.amount)}
                      </td>
                    </tr>
                  `,
                )
                .join('')}
            </tbody>
          </table>
        </section>
      `;

  const outstandingLabel =
    outstandingBalance > 0 ? 'Outstanding Balance' : 'Fully Paid';

  const status =
    invoice.status?.replace(/_/g, ' ') || '—';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>
          Invoice ${escapeHtml(invoice.invoiceNumber)}
        </title>

        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        <style>
          @page {
            size: A4;
            margin: 18mm;
          }

          * {
            box-sizing: border-box;
          }

          html {
            background: #f1f5f9;
          }

          body {
            margin: 0;
            padding: 32px 24px;
            background: #f1f5f9;
            color: #0f172a;
            font-family: "Montserrat", Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
          }

          .document {
            width: 100%;
            max-width: 174mm;
            margin: 0 auto;
            background: #ffffff;
            padding: 12mm;
          }

          .header {
            padding-bottom: 18px;
            margin-bottom: 24px;
            border-bottom: 2px solid #0f172a;
          }

          .header-top {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
          }

          .organization-name {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.3;
          }

          .document-type {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.08em;
          }

          .meta {
            margin-top: 5px;
            color: #64748b;
            font-size: 11px;
          }

          .invoice-summary {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            padding-bottom: 20px;
            margin-bottom: 24px;
            border-bottom: 1px solid #cbd5e1;
          }

          .invoice-number {
            margin-top: 4px;
            color: #475569;
            font-family: monospace;
            font-size: 12px;
          }

          .summary-right {
            text-align: right;
          }

          .small-label {
            color: #64748b;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .status {
            margin-top: 3px;
            color: #0f172a;
            font-size: 12px;
            font-weight: 700;
          }

          .patient-box {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            padding: 14px 16px;
            margin-bottom: 24px;
            border: 1px solid #cbd5e1;
          }

          .patient-name {
            margin-top: 4px;
            font-size: 13px;
            font-weight: 700;
          }

          .patient-meta {
            margin-top: 3px;
            color: #64748b;
            font-size: 11px;
          }

          .section {
            margin-top: 24px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .section-title {
            padding-bottom: 8px;
            margin-bottom: 10px;
            border-bottom: 1px solid #cbd5e1;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .section-description {
            margin: -2px 0 10px;
            color: #64748b;
            font-size: 10px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            padding: 8px 6px;
            border-bottom: 1px solid #cbd5e1;
            color: #64748b;
            font-size: 10px;
            font-weight: 600;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          td {
            padding: 9px 6px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
            vertical-align: top;
          }

          .text-right {
            text-align: right;
          }

          .amount {
            color: #0f172a;
            font-weight: 600;
          }

          .amount-reducing {
            color: #047857;
            font-weight: 600;
          }

          .amount-increasing,
          .amount-refund {
            color: #b91c1c;
            font-weight: 600;
          }

          .empty-cell,
          .empty-state {
            padding: 18px;
            color: #94a3b8;
            text-align: center;
          }

          .totals {
            width: 100%;
            max-width: 280px;
            margin: 24px 0 0 auto;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            padding: 5px 0;
            color: #475569;
          }

          .total-row.discount {
            color: #047857;
          }

          .total-row.final {
            padding-top: 10px;
            margin-top: 6px;
            border-top: 1px solid #cbd5e1;
            color: #0f172a;
            font-size: 14px;
            font-weight: 700;
          }

          .balance-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            padding: 14px 16px;
            margin-top: 28px;
            border: 1px solid #cbd5e1;
          }

          .balance-label {
            font-size: 12px;
            font-weight: 700;
          }

          .balance-amount {
            font-size: 16px;
            font-weight: 700;
          }

          .footer {
            padding-top: 12px;
            margin-top: 36px;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 10px;
            text-align: center;
          }

          @media print {
            html,
            body {
                width: 100%;
                margin: 0;
                padding: 0;
                background: #ffffff;
            }

            .document {
                width: 100%;
                max-width: none;
                margin: 0;
                padding: 0;
            }

            .print-bar {
                display: none;
            }
            }

            .print-bar {
            display: flex;
            justify-content: flex-end;
            max-width: 174mm;
            margin: 0 auto 16px;
            }

            .print-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 18px;
            border: none;
            border-radius: 10px;
            background: #0f172a;
            color: #ffffff;
            font-family: "Montserrat", Arial, sans-serif;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            }

            .print-button:hover {
            background: #1e293b;
            }
        </style>
      </head>

      <body>
      <div class="print-bar">
        <button type="button" class="print-button" onclick="window.print()">
           Print invoice
        </button>
      </div>
        <main class="document">
          <header class="header">
            <div class="header-top">
              <div>
                <h1 class="organization-name">
                  ${escapeHtml(organizationName)}
                </h1>

                ${
                  organizationAddress
                    ? `
                      <div class="meta">
                        ${escapeHtml(organizationAddress)}
                      </div>
                    `
                    : ''
                }

                ${
                  organizationContact
                    ? `
                      <div class="meta">
                        ${escapeHtml(organizationContact)}
                      </div>
                    `
                    : ''
                }
              </div>

              <p class="document-type">INVOICE</p>
            </div>
          </header>

          <section class="invoice-summary">
            <div>
              <div class="small-label">Invoice Number</div>

              <div class="invoice-number">
                ${escapeHtml(invoice.invoiceNumber)}
              </div>
            </div>

            <div class="summary-right">
              <div class="small-label">Status</div>

              <div class="status">
                ${escapeHtml(status)}
              </div>

              <div class="meta">
                Issued: ${formatDate(invoice.issuedAt)}
              </div>
            </div>
          </section>

          ${
            patient || visit
              ? `
                <section class="patient-box">
                  <div>
                    <div class="small-label">Billed To</div>

                    <div class="patient-name">
                      ${formatValue(patient?.fullName)}
                    </div>

                    <div class="patient-meta">
                      ${
                        patient?.gender
                          ? `${escapeHtml(patient.gender)} | `
                          : ''
                      }
                      DOB: ${formatDate(patient?.dateOfBirth)}
                    </div>
                  </div>

                  <div>
                    <div class="small-label">Visit</div>

                    <div class="patient-name">
                      ${
                        visit?.visitType
                          ? escapeHtml(
                              visit.visitType.replace(/_/g, ' '),
                            )
                          : '—'
                      }
                    </div>

                    <div class="patient-meta">
                      ${formatDate(visit?.visitDateTime)}
                    </div>
                  </div>
                </section>
              `
              : ''
          }

          <section class="section">
            <div class="section-title">Charges</div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Qty</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>

              <tbody>
                ${chargeRows}
              </tbody>
            </table>
          </section>

          ${adjustmentSection}

          <section class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${formatCurrency(invoice.subtotal)}</span>
            </div>

            <div class="total-row discount">
              <span>Discounts</span>
              <span>−${formatCurrency(invoice.discountTotal)}</span>
            </div>

            <div class="total-row final">
              <span>Total Payable</span>
              <span>${formatCurrency(invoice.totalPayable)}</span>
            </div>
          </section>

          ${paymentSection}

          ${balancePaymentSection}

          ${refundSection}

          <section class="balance-box">
            <span class="balance-label">
              ${outstandingLabel}
            </span>

            <span class="balance-amount">
              ${formatCurrency(outstandingBalance)}
            </span>
          </section>

          <footer class="footer">
            Generated by Hospital Management System
            ${
              invoice.issuedAt
                ? ` | Invoice issued ${formatDateTime(invoice.issuedAt)}`
                : ''
            }
          </footer>
        </main>
      </body>
    </html>
  `;
}