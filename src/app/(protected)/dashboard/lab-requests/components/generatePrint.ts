import {
  FindLabRequestByIdQuery,
  LabResultsByLabRequestQuery,
} from "@/shared/graphql/generated/graphql";
import { formatDateTime } from "@/utils/formatDateTime";

export function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return null;
  }

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

type LabRequestType = FindLabRequestByIdQuery["labRequestById"];

type LabResultsType =
  LabResultsByLabRequestQuery["labResultsByLabRequest"];

type LabResultItem = LabResultsType[number];

type LabResultLineItem = NonNullable<LabResultItem["items"]>[number];

export default function generatePrintHTML(
  labRequest: LabRequestType,
  labResults: LabResultsType,
) {
  const patient = labRequest.visit?.patient;
  const organization = labRequest.organization;

  const escapeHtml = (value: string | number | null | undefined) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatValue = (value: string | number | null | undefined) =>
    value !== null && value !== undefined && String(value).trim()
      ? escapeHtml(value)
      : "—";

  const address = [
    organization?.address?.addressLine1,
    organization?.address?.city,
    organization?.address?.state,
    organization?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const contact = [organization?.phoneNumber, organization?.email]
    .filter(Boolean)
    .join(" | ");

  const resultsContent =
    labResults.length === 0
      ? `
          <div class="empty-state">
            No laboratory results available.
          </div>
        `
      : labResults
          .map(
            (result: LabResultItem) => `
              <section class="test-section">
                <div class="test-title">
                  ${formatValue(result.testName)}
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                      <th>Unit</th>
                      <th>Reference Range</th>
                      <th>Interpretation</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${
                      result.items && result.items.length > 0
                        ? result.items
                            .map(
                              (item: LabResultLineItem) => `
                                <tr>
                                  <td>${formatValue(item.parameter)}</td>
                                  <td class="result-value">
                                    ${formatValue(item.value)}
                                  </td>
                                  <td>${formatValue(item.unit)}</td>
                                  <td>
                                    ${formatValue(item.referenceRange)}
                                  </td>
                                  <td>
                                    ${formatValue(item.interpretation)}
                                  </td>
                                </tr>
                              `,
                            )
                            .join("")
                        : `
                            <tr>
                              <td
                                colspan="5"
                                class="no-items"
                              >
                                No result items available.
                              </td>
                            </tr>
                          `
                    }
                  </tbody>
                </table>
              </section>
            `,
          )
          .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>Laboratory Result Report</title>

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

          html,
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }

          body {
            color: #0f172a;
            font-family: "Montserrat", Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
          }

          .document {
            width: 100%;
            max-width: 174mm;
            margin: 0 auto;
          }

          .header {
            margin-top: 24px;
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

          .org-name {
            margin: 0;
            color: #0f172a;
            font-size: 20px;
            font-weight: 700;
            line-height: 1.3;
          }

          .document-title {
            margin: 0;
            color: #0f172a;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-align: right;
          }

          .org-meta {
            margin-top: 5px;
            color: #64748b;
            font-size: 10px;
            line-height: 1.5;
          }

          .section {
            margin-top: 22px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .section-title {
            padding-bottom: 8px;
            margin-bottom: 12px;
            border-bottom: 1px solid #cbd5e1;
            color: #0f172a;
            font-size: 13px;
            font-weight: 700;
          }

          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 32px;
          }

          .info-item {
            display: flex;
            gap: 8px;
          }

          .label {
            color: #64748b;
            font-weight: 500;
            white-space: nowrap;
          }

          .value {
            color: #0f172a;
            font-weight: 600;
          }

          .test-section {
            margin-top: 24px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .test-title {
            padding-bottom: 7px;
            margin-bottom: 10px;
            color: #0f172a;
            font-size: 13px;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
          }

          th,
          td {
            padding: 9px 8px;
            border: 1px solid #cbd5e1;
            font-size: 10px;
            text-align: left;
            vertical-align: top;
            overflow-wrap: break-word;
          }

          th {
            background: #f8fafc;
            color: #334155;
            font-weight: 600;
          }

          th:nth-child(1),
          td:nth-child(1) {
            width: 22%;
          }

          th:nth-child(2),
          td:nth-child(2) {
            width: 18%;
          }

          th:nth-child(3),
          td:nth-child(3) {
            width: 14%;
          }

          th:nth-child(4),
          td:nth-child(4) {
            width: 24%;
          }

          th:nth-child(5),
          td:nth-child(5) {
            width: 22%;
          }

          .result-value {
            color: #0f172a;
            font-weight: 700;
          }

          .no-items {
            padding: 16px;
            color: #64748b;
            text-align: center;
          }

          .empty-state {
            padding: 24px 0;
            color: #64748b;
            text-align: center;
          }

          .signature-section {
            margin-top: 40px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .signature-line {
            width: 220px;
            max-width: 100%;
            margin-top: 48px;
            border-top: 1px solid #64748b;
          }

          .signature-label {
            margin-top: 5px;
            color: #64748b;
            font-size: 10px;
          }

          .footer {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            color: #94a3b8;
            font-size: 10px;
          }

          @media print {
            html,
            body {
              width: 100%;
              background: #ffffff;
            }

            .document {
              width: 100%;
              max-width: none;
              margin: 0;
            }
          }
        </style>
      </head>

      <body>
        <main class="document">
          <header class="header">
            <div class="header-top">
              <div>
                <h1 class="org-name">
                  ${escapeHtml(organization?.name ?? "Hospital Name")}
                </h1>

                ${
                  address
                    ? `
                      <div class="org-meta">
                        ${escapeHtml(address)}
                      </div>
                    `
                    : ""
                }

                ${
                  contact
                    ? `
                      <div class="org-meta">
                        ${escapeHtml(contact)}
                      </div>
                    `
                    : ""
                }

                ${
                  organization?.website
                    ? `
                      <div class="org-meta">
                        ${escapeHtml(organization.website)}
                      </div>
                    `
                    : ""
                }
              </div>

              <h2 class="document-title">
                LABORATORY<br />
                RESULT REPORT
              </h2>
            </div>
          </header>

          <section class="section">
            <div class="section-title">Patient Information</div>

            <div class="info-grid">
              <div class="info-item">
                <span class="label">Name:</span>
                <span class="value">
                  ${formatValue(patient?.fullName)}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Gender:</span>
                <span class="value">
                  ${formatValue(patient?.gender)}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Age:</span>
                <span class="value">
                  ${formatValue(calculateAge(patient?.dateOfBirth))}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Visit Type:</span>
                <span class="value">
                  ${formatValue(labRequest.visit?.visitType)}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Visit Date:</span>
                <span class="value">
                  ${formatValue(
                    formatDateTime(labRequest.visit?.visitDateTime),
                  )}
                </span>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="section-title">Lab Request Details</div>

            <div class="info-grid">
              <div class="info-item">
                <span class="label">Status:</span>
                <span class="value">
                  ${formatValue(labRequest.status)}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Priority:</span>
                <span class="value">
                  ${formatValue(labRequest.priority)}
                </span>
              </div>

              <div class="info-item">
                <span class="label">Requested At:</span>
                <span class="value">
                  ${formatValue(formatDateTime(labRequest.createdAt))}
                </span>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="section-title">Laboratory Results</div>

            ${resultsContent}
          </section>

          <section class="signature-section">
            <div class="section-title">Authorization</div>

            <div class="signature-line"></div>
            <div class="signature-label">
              Authorized Medical Personnel
            </div>
          </section>

          <footer class="footer">
            <span>
              Generated by Hospital Management System
            </span>

            <span>
              Generated on
              ${escapeHtml(
                formatDateTime(new Date().toISOString()),
              )}
            </span>
          </footer>
        </main>
      </body>
    </html>
  `;
}