import SessionGuard from '@/components/SessionGuard';
import OrganizationBillingClient from './OrganizationBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetOrganizationBillingCategoriesDocument,
  GetOrganizationBillingCategoriesQuery,
  GetOrganizationBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';
import DashboardLayout from '@/app/(protected)/dashboard/layout';

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
      <DashboardLayout>
        <OrganizationBillingClient
          categories={data.organizationBillingCategories}
        />
      </DashboardLayout>

    </SessionGuard>
  );
}