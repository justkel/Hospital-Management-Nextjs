import { Suspense } from 'react';

import SessionGuard from '@/components/SessionGuard';
import {
  GetVisitBillingPageDocument,
  GetVisitBillingPageQuery,
  GetVisitBillingPageQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import BillingClient from './billing-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VisitBillingPage({ params }: Props) {
  const { id } = await params;

  const { data, authOutcome, message } = await graphqlFetch<
    GetVisitBillingPageQuery,
    GetVisitBillingPageQueryVariables
  >(GetVisitBillingPageDocument, {
    id,
    visitId: id,
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (!data?.visit) {
    return <SessionGuard mode="none" />;
  }

  return (
    <SessionGuard mode="none">
      <Suspense fallback={null}>
        <BillingClient
          visit={data.visit}
          initialSummary={
            data.visitChargeSummary ?? {
              lockedCharges: [],
              editableCharges: [],
              total: 0,
            }
          }
          initialUnbilled={data.unbilledPrescriptions ?? []}
          initialAdjustments={data.billingAdjustments ?? []}
          initialLatestInvoice={data.latestVisitInvoice ?? null}
          initialInvoices={data.visitInvoices ?? []}
          initialPayments={data.visitPayments ?? []}
          initialCredits={data.visitCredits ?? []}
          initialCreditBalance={data.visitCreditBalance ?? 0}
        />
      </Suspense>
    </SessionGuard>
  );
}