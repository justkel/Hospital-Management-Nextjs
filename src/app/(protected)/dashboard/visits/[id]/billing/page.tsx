import SessionGuard from '@/components/SessionGuard';
import {
  GetVisitBillingPageDocument,
  GetVisitBillingPageQuery,
  GetVisitBillingPageQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import BillingClient from './billing-client';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VisitBillingPage({ params }: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetVisitBillingPageQuery,
    GetVisitBillingPageQueryVariables
  >(
    GetVisitBillingPageDocument,
    {
      id,
      visitId: id,
    }
  );

  if (!data?.visit) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <Suspense fallback={null}>
        <BillingClient
          visit={data.visit}
          initialSummary={
            data?.visitChargeSummary ?? {
              lockedCharges: [],
              editableCharges: [],
              total: 0,
            }
          }
          initialUnbilled={data?.unbilledPrescriptions ?? []}
          initialAdjustments={data?.billingAdjustments ?? []}
          initialLatestInvoice={data?.latestVisitInvoice ?? null}
          initialInvoices={data?.visitInvoices ?? []}
          initialPayments={data?.visitPayments ?? []}
          initialCredits={data?.visitCredits ?? []}
          initialCreditBalance={data?.visitCreditBalance ?? 0}
        />
      </Suspense>
    </SessionGuard>
  );
}