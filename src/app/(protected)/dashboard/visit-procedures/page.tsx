import SessionGuard from '@/components/SessionGuard';

import VisitProcedureManagementClient from './VisitProcedureManagementClient';

import {
  GetVisitProceduresDocument,
  GetVisitProceduresQuery,
  GetVisitProceduresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

export default async function VisitProceduresPage() {
  const proceduresData = await graphqlFetch<
    GetVisitProceduresQuery,
    GetVisitProceduresQueryVariables
  >(GetVisitProceduresDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!proceduresData?.visitProcedures) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <VisitProcedureManagementClient
        paginated={proceduresData.visitProcedures}
      />
    </SessionGuard>
  );
}