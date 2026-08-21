import SessionGuard from '@/components/SessionGuard';
import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
  GetVisitProceduresByVisitDocument,
  GetVisitProceduresByVisitQuery,
  GetVisitProceduresByVisitQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import VisitProcedureClient from './visit-procedure-client';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VisitProceduresPage({ params }: Props) {
  const { id } = await params;

  const [visitData, procedureData] = await Promise.all([
    graphqlFetch<GetVisitByIdQuery, GetVisitByIdQueryVariables>(
      GetVisitByIdDocument,
      { id }
    ),
    graphqlFetch<
      GetVisitProceduresByVisitQuery,
      GetVisitProceduresByVisitQueryVariables
    >(GetVisitProceduresByVisitDocument, {
      visitId: id,
    }),
  ]);

  if (
    visitData.authOutcome === 'logout' ||
    procedureData.authOutcome === 'logout'
  ) {
    const reason = visitData.message || procedureData.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    visitData.authOutcome === 'refresh' ||
    procedureData.authOutcome === 'refresh'
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <VisitProcedureClient
        visit={visitData.data!.visit}
        initialProcedures={procedureData.data!.visitProceduresByVisit ?? []}
      />
    </SessionGuard>
  );
}