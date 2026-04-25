import SessionGuard from '@/components/SessionGuard';
import LabRequestManagementClient from './LabRequestManagementClient';
import {
  FindAllLabRequestsDocument,
  FindAllLabRequestsQuery,
  FindAllLabRequestsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';

export default async function LabRequestsPage() {
  const data = await graphqlFetch<
    FindAllLabRequestsQuery,
    FindAllLabRequestsQueryVariables
  >(FindAllLabRequestsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data?.labRequests) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <LabRequestManagementClient paginated={data.labRequests} />
    </SessionGuard>
  );
}