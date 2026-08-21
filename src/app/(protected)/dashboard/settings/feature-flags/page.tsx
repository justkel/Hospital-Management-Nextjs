import SessionGuard from '@/components/SessionGuard';
import {
  GetOrganizationFeatureFlagsDocument,
  GetOrganizationFeatureFlagsQuery,
  GetOrganizationFeatureFlagsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import FeatureFlagsClient from './feature-flags-client';

export default async function FeatureFlagsPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetOrganizationFeatureFlagsQuery,
    GetOrganizationFeatureFlagsQueryVariables
  >(GetOrganizationFeatureFlagsDocument, {});

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (!data?.organizationFeatureFlags) {
    return <SessionGuard mode="none" />;
  }

  return (
    <SessionGuard mode="none">
      <FeatureFlagsClient
        initialFlags={data.organizationFeatureFlags}
      />
    </SessionGuard>
  );
}