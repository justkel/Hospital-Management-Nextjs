import SessionGuard from '@/components/SessionGuard';

import {
  GetWardsDocument,
  GetWardsQuery,
  GetWardsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import WardManagementClient from './WardManagementClient';

export default async function WardsPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetWardsQuery,
    GetWardsQueryVariables
  >(GetWardsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.wards) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <WardManagementClient paginated={data.wards} />
    </SessionGuard>
  );
}