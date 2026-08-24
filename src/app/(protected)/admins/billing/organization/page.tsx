import SessionGuard from '@/components/SessionGuard';
import OrganizationBillingClient from './OrganizationBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetOrganizationBillingCategoriesDocument,
  GetOrganizationBillingCategoriesQuery,
  GetOrganizationBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function OrganizationBillingPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetOrganizationBillingCategoriesQuery,
    GetOrganizationBillingCategoriesQueryVariables
  >(GetOrganizationBillingCategoriesDocument, {});

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.organizationBillingCategories) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <OrganizationBillingClient
        categories={data.organizationBillingCategories}
      />
    </SessionGuard>
  );
}