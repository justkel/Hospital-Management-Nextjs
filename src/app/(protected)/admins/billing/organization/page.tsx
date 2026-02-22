import SessionGuard from '@/components/SessionGuard';
import OrganizationBillingClient from './OrganizationBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetOrganizationBillingCategoriesDocument,
  GetOrganizationBillingCategoriesQuery,
  GetOrganizationBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function OrganizationBillingPage() {
  const data = await graphqlFetch<
    GetOrganizationBillingCategoriesQuery,
    GetOrganizationBillingCategoriesQueryVariables
  >(GetOrganizationBillingCategoriesDocument, {});

  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <OrganizationBillingClient
        categories={data.organizationBillingCategories}
      />
    </SessionGuard>
  );
}