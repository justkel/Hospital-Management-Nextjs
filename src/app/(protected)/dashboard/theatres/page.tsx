import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatresDocument,
  GetTheatresQuery,
  GetTheatresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreManagementClient from './TheatreManagementClient';

export default async function TheatresPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetTheatresQuery,
    GetTheatresQueryVariables
  >(GetTheatresDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.theatres) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <TheatreManagementClient paginated={data.theatres} />
    </SessionGuard>
  );
}