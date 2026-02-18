import {
  FindAllVisitsDocument,
  FindAllVisitsQuery,
  FindAllVisitsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import VisitManagementClient from './VisitManagementClient';

export default async function VisitsPage() {
  const data = await graphqlFetch<
    FindAllVisitsQuery,
    FindAllVisitsQueryVariables
  >(FindAllVisitsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data?.visits) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <VisitManagementClient paginated={data.visits} />
    </SessionGuard>
  );
}
