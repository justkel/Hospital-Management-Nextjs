import SessionGuard from '@/components/SessionGuard';
import {
  GetPatientWalletBalanceDocument,
  GetPatientWalletBalanceQuery,
  GetPatientWalletBalanceQueryVariables,
  GetPatientWalletTransactionsDocument,
  GetPatientWalletTransactionsQuery,
  GetPatientWalletTransactionsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import PatientWalletClient from './components/PatientWalletClient';

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
      GetPatientWalletTransactionsQuery,
      GetPatientWalletTransactionsQueryVariables
    >(GetPatientWalletTransactionsDocument, { patientId: id }),
  ]);

  if (balanceRes?.patientWalletBalance === undefined) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <PatientWalletClient
        patientId={id}
        initialBalance={balanceRes.patientWalletBalance}
        initialTransactions={transactionsRes?.patientWalletTransactions ?? []}
      />
    </SessionGuard>
  );
}