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
      pagination: { page: 1, limit: PAGE_SIZE },
    }),
  ]);

  if (balanceRes?.patientWalletBalance === undefined) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <PatientWalletClient
        patientId={id}
        initialBalance={balanceRes.patientWalletBalance}
        initialPaginated={
          transactionsRes?.patientWalletTransactionsPaginated ?? {
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