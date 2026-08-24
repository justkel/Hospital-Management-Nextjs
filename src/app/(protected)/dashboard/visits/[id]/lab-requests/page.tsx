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
    graphqlFetch<GetLabRequestsByVisitQuery, GetLabRequestsByVisitQueryVariables>(
      GetLabRequestsByVisitDocument,
      { visitId: id }
    ),
  ]);

  if (
    visitRes.authOutcome === 'logout' ||
    labRequestsRes.authOutcome === 'logout'
  ) {
    const reason = visitRes.message || labRequestsRes.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    visitRes.authOutcome === 'refresh' ||
    labRequestsRes.authOutcome === 'refresh' ||
    !visitRes.data?.visit ||
    !labRequestsRes.data?.labRequestsByVisit
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <LabRequestClient
        visit={visitRes.data.visit}
        initialLabRequests={labRequestsRes.data.labRequestsByVisit}
      />
    </SessionGuard>
  );
}