import SessionGuard from '@/components/SessionGuard';
import {
  GetPatientWalletBalanceDocument,
  GetPatientWalletBalanceQuery,
  GetPatientWalletBalanceQueryVariables,
  GetPatientWalletTransactionsPaginatedDocument,
  GetPatientWalletTransactionsPaginatedQuery,
  GetPatientWalletTransactionsPaginatedQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import PatientWalletClient from './components/PatientWalletClient';

const PAGE_SIZE = 20;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PatientWalletPage({ params }: Props) {
  const { id } = await params;

  const [balanceRes, transactionsRes] = await Promise.all([
    graphqlFetch<
      GetPatientWalletBalanceQuery,
      GetPatientWalletBalanceQueryVariables
    >(GetPatientWalletBalanceDocument, { patientId: id }),

    graphqlFetch<
      GetPatientWalletTransactionsPaginatedQuery,
      GetPatientWalletTransactionsPaginatedQueryVariables
    >(GetPatientWalletTransactionsPaginatedDocument, {
      patientId: id,
      pagination: {
        page: 1,
        limit: PAGE_SIZE,
      },
    }),
  ]);

  if (
    balanceRes.authOutcome === 'logout' ||
    transactionsRes.authOutcome === 'logout'
  ) {
    const reason = balanceRes.message || transactionsRes.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    balanceRes.authOutcome === 'refresh' ||
    transactionsRes.authOutcome === 'refresh'
  ) {
    return <SessionGuard mode="refresh" />;
  }

  if (balanceRes.data?.patientWalletBalance === undefined) {
    return <SessionGuard mode="none" />;
  }

  return (
    <SessionGuard mode="none">
      <PatientWalletClient
        patientId={id}
        initialBalance={balanceRes.data.patientWalletBalance}
        initialPaginated={
          transactionsRes.data?.patientWalletTransactionsPaginated ?? {
            items: [],
            total: 0,
            page: 1,
            pageCount: 1,
          }
        }
      />
    </SessionGuard>
  );
}