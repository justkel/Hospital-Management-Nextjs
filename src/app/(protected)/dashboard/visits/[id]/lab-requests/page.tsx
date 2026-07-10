import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
  GetLabRequestsByVisitDocument,
  GetLabRequestsByVisitQuery,
  GetLabRequestsByVisitQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import LabRequestClient from './labRequestClient';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function VisitLabRequestsPage({ params }: Props) {
  const { id } = await params;

  const [visitRes, labRequestsRes] = await Promise.all([
    graphqlFetch<GetVisitByIdQuery, GetVisitByIdQueryVariables>(
      GetVisitByIdDocument,
      { id }
    ),
    graphqlFetch<
      GetLabRequestsByVisitQuery,
      GetLabRequestsByVisitQueryVariables
    >(GetLabRequestsByVisitDocument, { visitId: id }),
  ]);

  if (!visitRes?.visit) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <LabRequestClient
        visit={visitRes.visit}
        initialLabRequests={labRequestsRes?.labRequestsByVisit ?? []}
      />
    </SessionGuard>
  );
}