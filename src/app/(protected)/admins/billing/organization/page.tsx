import SessionGuard from '@/components/SessionGuard';
import OrganizationBillingClient from './OrganizationBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetOrganizationBillingCategoriesDocument,
  GetOrganizationBillingCategoriesQuery,
  GetOrganizationBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function OrganizationBillingPage() {
  const [data] = await Promise.all([
    graphqlFetch<
      GetOrganizationBillingCategoriesQuery,
      GetOrganizationBillingCategoriesQueryVariables
    >(GetOrganizationBillingCategoriesDocument, {}),
  ]);

  if (data.authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={data.message} />;
  }

  if (data.authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <OrganizationBillingClient
        categories={data.data!.organizationBillingCategories}
      />
    </SessionGuard>
  );
}