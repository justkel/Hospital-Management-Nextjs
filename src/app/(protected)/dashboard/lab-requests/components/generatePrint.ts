import { FindLabRequestByIdQuery, LabResultsByLabRequestQuery } from "@/shared/graphql/generated/graphql";
import { formatDateTime } from "@/utils/formatDateTime";

export function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

type LabRequestType =
  FindLabRequestByIdQuery['labRequestById'];

type LabResultsType =
  LabResultsByLabRequestQuery['labResultsByLabRequest'];  

export default function generatePrintHTML(labRequest: LabRequestType, labResults: LabResultsType) {
  const patient = labRequest.visit?.patient;
  const org = labRequest?.organization;

  const address = org?.address
    ? `${org.address.addressLine1 || ''}, ${org.address.city || ''}, ${org.address.state || ''}, ${org.address.country || ''}`
    : '';

  return `
  <html>
  <head>
    <title>Lab Result</title>

    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
      body {
        font-family: 'Montserrat', Arial, sans-serif;
        padding: 32px;
        color: #0f172a;
        font-size: 13px;
        line-height: 1.6;
      }

      .header {
        text-align: center;
        margin-bottom: 20px;
      }

      .org-name {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }

      .org-meta {
        font-size: 12px;
        color: #475569;
        margin-top: 4px;
      }

      .divider {
        border-top: 2px solid #0f172a;
        margin: 16px 0 24px;
      }

      .title {
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 20px;
      }

      .section {
        margin-bottom: 20px;
      }

      .section-title {
        font-weight: 600;
        margin-bottom: 8px;
        font-size: 13px;
        color: #1e293b;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px 12px;
        font-size: 13px;
      }

      .info-item {
        display: flex;
        gap: 4px;
      }

      .label {
        font-weight: 500;
        color: #475569;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }

      th, td {
        border: 1px solid #cbd5f5;
        padding: 8px;
        font-size: 12px;
      }

      th {
        background: #f1f5f9;
        text-align: left;
        font-weight: 600;
      }

      .test-title {
        margin-top: 18px;
        font-weight: 600;
        font-size: 13px;
      }

      .footer {
        margin-top: 40px;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }

      .signature {
        text-align: center;
        margin-top: 40px;
      }

      .signature-line {
        margin-top: 40px;
        border-top: 1px solid #000;
        width: 200px;
      }

      .muted {
        color: #64748b;
      }
    </style>
  </head>

  <body>
    <div class="header">
      <div class="org-name">${org?.name ?? 'Hospital Name'}</div>

      <div class="org-meta">
        ${address}
      </div>

      <div class="org-meta">
        ${org?.phoneNumber ?? ''} ${org?.email ? ' | ' + org.email : ''}
      </div>

      ${
        org?.website
          ? `<div class="org-meta">${org.website}</div>`
          : ''
      }
    </div>

    <div class="divider"></div>

    <div class="title">LABORATORY RESULT REPORT</div>

    <div class="section">
      <div class="section-title">Patient Information</div>

      <div class="info-grid">
        <div class="info-item"><span class="label">Name:</span> ${patient?.fullName ?? '-'}</div>
        <div class="info-item"><span class="label">Gender:</span> ${patient?.gender ?? '-'}</div>
        <div class="info-item"><span class="label">Age:</span> ${calculateAge(patient?.dateOfBirth) ?? '-'}</div>

        <div class="info-item"><span class="label">Visit Type:</span> ${labRequest.visit?.visitType ?? '-'}</div>
        <div class="info-item"><span class="label">Visit Date:</span> ${formatDateTime(labRequest.visit?.visitDateTime)}</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Lab Request Details</div>

      <div class="info-grid">
        <div class="info-item"><span class="label">Status:</span> ${labRequest.status}</div>
        <div class="info-item"><span class="label">Priority:</span> ${labRequest.priority}</div>
        <div class="info-item"><span class="label">Requested At:</span> ${formatDateTime(labRequest.createdAt)}</div>
      </div>
    </div>

    ${labResults
      .map(
        (res: any) => `
        <div class="test-title">${res.testName}</div>

        <table>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Reference</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            ${res.items
              .map(
                (item: any) => `
                <tr>
                  <td>${item.parameter}</td>
                  <td><strong>${item.value ?? '-'}</strong></td>
                  <td>${item.unit ?? '-'}</td>
                  <td>${item.referenceRange ?? '-'}</td>
                  <td>${item.interpretation ?? '-'}</td>
                </tr>
              `
              )
              .join('')}
          </tbody>
        </table>
      `
      )
      .join('')}

    <div class="signature">
      <div class="signature-line"></div>
      <div class="muted">Authorized Medical Personnel</div>
    </div>

    <div class="footer muted">
      <div>Generated on ${formatDateTime(new Date().toISOString())}</div>
    </div>

  </body>
  </html>
  `;
}