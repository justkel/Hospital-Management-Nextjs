import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatresDocument,
  GetTheatresQuery,
  GetTheatresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreManagementClient from './TheatreManagementClient';

export default async function TheatresPage() {
  const data = await graphqlFetch<
    GetTheatresQuery,
    GetTheatresQueryVariables
  >(GetTheatresDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data?.theatres) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <TheatreManagementClient
        paginated={data.theatres}
      />
    </SessionGuard>
  );
}