import { VisitPrescription } from "@/shared/graphql/generated/graphql";

export function generatePrescriptionPrintHTML(
  prescriptions: VisitPrescription[],
) {
  const firstPrescription = prescriptions[0];

  const organization = firstPrescription?.visit?.organization;
  const patient = firstPrescription?.visit?.patient;

  const organizationName =
    organization?.name || "Hospital Management System";

  const organizationAddress = [
    organization?.address?.addressLine1,
    organization?.address?.city,
    organization?.address?.state,
    organization?.address?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const organizationContact = [
    organization?.email,
    organization?.phoneNumber,
  ]
    .filter(Boolean)
    .join(" | ");

  const escapeHtml = (value: string | null | undefined) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  const formatValue = (value: string | null | undefined) =>
    value ? escapeHtml(value) : "—";

  const prescriptionContent =
    prescriptions.length === 0
      ? `
        <div class="empty-state">
          No prescriptions available.
        </div>
      `
      : prescriptions
        .map(
          (prescription, index) => `
              <div class="prescription-card">
                <div class="prescription-header">
                  <div>
                    <div class="prescription-number">
                      Prescription ${index + 1}
                    </div>
                    <div class="drug">
                      ${formatValue(prescription.drug)}
                    </div>
                  </div>

                  ${prescription.isProvidedInHouse
              ? `<div class="tag">In-house medication</div>`
              : ""
            }
                </div>

                <div class="prescription-details">
                  <div>
                    <span class="detail-label">Dose</span>
                    <span class="detail-value">
                      ${formatValue(prescription.dose)}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">Route</span>
                    <span class="detail-value">
                      ${formatValue(prescription.route)}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">Frequency</span>
                    <span class="detail-value">
                      ${formatValue(prescription.frequency)}
                    </span>
                  </div>

                  <div>
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">
                      ${formatValue(prescription.startDate)} – ${formatValue(
              prescription.endDate,
            )}
                    </span>
                  </div>
                </div>

                ${prescription.notes
              ? `
                      <div class="notes">
                        <span class="detail-label">Instructions / Notes</span>
                        <p>${escapeHtml(prescription.notes)}</p>
                      </div>
                    `
              : ""
            }

                <div class="prescribed-by">
                  Prescribed by:
                  <strong>
                    ${formatValue(
              prescription.prescribingDoctor?.fullName,
            )}
                  </strong>
                </div>
              </div>
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
        <title>Prescription Sheet</title>

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
            background: #ffffff;
          }

          body {
            margin: 0;
            padding: 32px 24px;
            background: #ffffff;
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

          .org {
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
            line-height: 1.5;
          }

          .section {
            margin-top: 20px;
          }

          .section-title {
            padding-bottom: 8px;
            margin-bottom: 12px;
            border-bottom: 1px solid #cbd5e1;
            color: #0f172a;
            font-size: 13px;
            font-weight: 700;
          }

          .patient-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px 32px;
          }

          .patient-item {
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

          .prescription-card {
            padding: 16px 0;
            border-bottom: 1px solid #e2e8f0;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .prescription-card:first-child {
            padding-top: 0;
          }

          .prescription-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 14px;
          }

          .prescription-number {
            margin-bottom: 3px;
            color: #64748b;
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .drug {
            color: #0f172a;
            font-size: 15px;
            font-weight: 700;
          }

          .tag {
            padding: 4px 9px;
            border: 1px solid #cbd5e1;
            border-radius: 999px;
            color: #334155;
            font-size: 10px;
            font-weight: 600;
            white-space: nowrap;
          }

          .prescription-details {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px 32px;
          }

          .detail-label {
            display: block;
            margin-bottom: 2px;
            color: #64748b;
            font-size: 10px;
            font-weight: 500;
          }

          .detail-value {
            color: #0f172a;
            font-size: 12px;
            font-weight: 600;
          }

          .notes {
            margin-top: 14px;
          }

          .notes p {
            margin: 4px 0 0;
            color: #334155;
            white-space: pre-wrap;
          }

          .prescribed-by {
            margin-top: 14px;
            color: #64748b;
            font-size: 11px;
          }

          .prescribed-by strong {
            color: #0f172a;
          }

          .doctor-section {
            margin-top: 32px;
            break-inside: avoid;
            page-break-inside: avoid;
          }

          .doctor-name {
            margin-bottom: 40px;
            color: #0f172a;
            font-size: 12px;
            font-weight: 600;
          }

          .signature-line {
            width: 220px;
            max-width: 100%;
            border-top: 1px solid #64748b;
          }

          .signature-label {
            margin-top: 5px;
            color: #64748b;
            font-size: 10px;
          }

          .empty-state {
            padding: 20px 0;
            color: #64748b;
            text-align: center;
          }

          .footer {
            margin-top: 40px;
            padding-top: 12px;
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
            }
          }
        </style>
      </head>

      <body>
        <main class="document">
          <header class="header">
            <div class="header-top">
              <div>
                <h1 class="org">
                  ${escapeHtml(organizationName)}
                </h1>

                ${organizationAddress
      ? `
                      <div class="meta">
                        ${escapeHtml(organizationAddress)}
                      </div>
                    `
      : ""
    }

                ${organizationContact
      ? `
                      <div class="meta">
                        ${escapeHtml(organizationContact)}
                      </div>
                    `
      : ""
    }
              </div>

              <p class="document-type">PRESCRIPTION</p>
            </div>
          </header>

          <section class="section">
            <div class="section-title">Patient Information</div>

            <div class="patient-grid">
              <div class="patient-item">
                <span class="label">Name:</span>
                <span class="value">
                  ${formatValue(patient?.fullName)}
                </span>
              </div>

              <div class="patient-item">
                <span class="label">Gender:</span>
                <span class="value">
                  ${formatValue(patient?.gender)}
                </span>
              </div>

              <div class="patient-item">
                <span class="label">DOB:</span>
                <span class="value">
                  ${formatValue(patient?.dateOfBirth)}
                </span>
              </div>

              <div class="patient-item">
                <span class="label">Visit Type:</span>
                <span class="value">
                  ${formatValue(firstPrescription?.visit?.visitType)}
                </span>
              </div>
            </div>
          </section>

          <section class="section">
            <div class="section-title">Prescriptions</div>

            ${prescriptionContent}
          </section>

          <section class="doctor-section">
            <div class="section-title">Prescribing Doctor</div>

            <div class="doctor-name">
              ${formatValue(
      firstPrescription?.prescribingDoctor?.fullName,
    )}
            </div>

            <div class="signature-line"></div>
            <div class="signature-label">Signature</div>
          </section>

          <footer class="footer">
            Generated by Hospital Management System
          </footer>
        </main>
      </body>
    </html>
  `;
}