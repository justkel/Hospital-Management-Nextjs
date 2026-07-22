import SessionGuard from '@/components/SessionGuard';
import {
  GetOrganizationFeatureFlagsDocument,
  GetOrganizationFeatureFlagsQuery,
  GetOrganizationFeatureFlagsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import FeatureFlagsClient from './feature-flags-client';

export default async function FeatureFlagsPage() {
  const flagsRes = await graphqlFetch<
    GetOrganizationFeatureFlagsQuery,
    GetOrganizationFeatureFlagsQueryVariables
  >(GetOrganizationFeatureFlagsDocument, {});

  if (!flagsRes?.organizationFeatureFlags) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <FeatureFlagsClient initialFlags={flagsRes.organizationFeatureFlags} />
    </SessionGuard>
  );
}