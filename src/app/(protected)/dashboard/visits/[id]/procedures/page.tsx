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

  if (!visitData?.visit) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <VisitProcedureClient
        visit={visitData.visit}
        initialProcedures={procedureData?.visitProceduresByVisit ?? []}
      />
    </SessionGuard>
  );
}