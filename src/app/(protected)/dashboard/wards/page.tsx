import SessionGuard from '@/components/SessionGuard';

import {
  GetWardsDocument,
  GetWardsQuery,
  GetWardsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import WardManagementClient from './WardManagementClient';

export default async function WardsPage() {
  const data = await graphqlFetch<
    GetWardsQuery,
    GetWardsQueryVariables
  >(GetWardsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data?.wards) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <WardManagementClient paginated={data.wards} />
    </SessionGuard>
  );
}