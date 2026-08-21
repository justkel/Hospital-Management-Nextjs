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

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  const wards = data?.wards;

  if (!wards) {
    return <SessionGuard mode="none" />;
  }

  return (
    <SessionGuard mode="none">
      <WardManagementClient paginated={wards} />
    </SessionGuard>
  );
}