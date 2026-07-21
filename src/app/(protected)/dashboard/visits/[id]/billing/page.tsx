import SessionGuard from '@/components/SessionGuard';
import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
  GetVisitChargeSummaryDocument,
  GetVisitChargeSummaryQuery,
  GetVisitChargeSummaryQueryVariables,
  GetUnbilledPrescriptionsDocument,
  GetUnbilledPrescriptionsQuery,
  GetUnbilledPrescriptionsQueryVariables,
  GetBillingAdjustmentsDocument,
  GetBillingAdjustmentsQuery,
  GetBillingAdjustmentsQueryVariables,
  GetLatestVisitInvoiceDocument,
  GetLatestVisitInvoiceQuery,
  GetLatestVisitInvoiceQueryVariables,
  GetVisitInvoicesDocument,
  GetVisitInvoicesQuery,
  GetVisitInvoicesQueryVariables,
  GetVisitPaymentsDocument,
  GetVisitPaymentsQuery,
  GetVisitPaymentsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import BillingClient from './billing-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VisitBillingPage({ params }: Props) {
  const { id } = await params;

  const [
    visitRes,
    summaryRes,
    unbilledRes,
    adjustmentsRes,
    latestInvoiceRes,
    invoicesRes,
    paymentsRes,
  ] = await Promise.all([
    graphqlFetch<GetVisitByIdQuery, GetVisitByIdQueryVariables>(
      GetVisitByIdDocument,
      { id }
    ),
    graphqlFetch<
      GetVisitChargeSummaryQuery,
      GetVisitChargeSummaryQueryVariables
    >(GetVisitChargeSummaryDocument, { visitId: id }),
    graphqlFetch<
      GetUnbilledPrescriptionsQuery,
      GetUnbilledPrescriptionsQueryVariables
    >(GetUnbilledPrescriptionsDocument, { visitId: id }),
    graphqlFetch<
      GetBillingAdjustmentsQuery,
      GetBillingAdjustmentsQueryVariables
    >(GetBillingAdjustmentsDocument, { visitId: id }),
    graphqlFetch<
      GetLatestVisitInvoiceQuery,
      GetLatestVisitInvoiceQueryVariables
    >(GetLatestVisitInvoiceDocument, { visitId: id }),
    graphqlFetch<GetVisitInvoicesQuery, GetVisitInvoicesQueryVariables>(
      GetVisitInvoicesDocument,
      { visitId: id }
    ),
    graphqlFetch<GetVisitPaymentsQuery, GetVisitPaymentsQueryVariables>(
      GetVisitPaymentsDocument,
      { visitId: id }
    ),
  ]);

  if (!visitRes?.visit) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <BillingClient
        visit={visitRes.visit}
        initialSummary={
          summaryRes?.visitChargeSummary ?? {
            lockedCharges: [],
            editableCharges: [],
            total: 0,
          }
        }
        initialUnbilled={unbilledRes?.unbilledPrescriptions ?? []}
        initialAdjustments={adjustmentsRes?.billingAdjustments ?? []}
        initialLatestInvoice={latestInvoiceRes?.latestVisitInvoice ?? null}
        initialInvoices={invoicesRes?.visitInvoices ?? []}
        initialPayments={paymentsRes?.visitPayments ?? []}
      />
    </SessionGuard>
  );
}