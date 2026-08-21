import SessionGuard from '@/components/SessionGuard';

import VisitProcedureManagementClient from './VisitProcedureManagementClient';

import {
  GetVisitProceduresDocument,
  GetVisitProceduresQuery,
  GetVisitProceduresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

export default async function VisitProceduresPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetVisitProceduresQuery,
    GetVisitProceduresQueryVariables
  >(GetVisitProceduresDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <VisitProcedureManagementClient
        paginated={data!.visitProcedures}
      />
    </SessionGuard>
  );
}