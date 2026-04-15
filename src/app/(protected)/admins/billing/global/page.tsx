import SessionGuard from '@/components/SessionGuard';
import GlobalBillingClient from './GlobalBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetGlobalBillingCategoriesDocument,
  GetGlobalBillingCategoriesQuery,
  GetGlobalBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';
import DashboardLayout from '@/app/(protected)/dashboard/layout';

export default async function GlobalBillingPage() {
  const data = await graphqlFetch<
    GetGlobalBillingCategoriesQuery,
    GetGlobalBillingCategoriesQueryVariables
  >(GetGlobalBillingCategoriesDocument, {});

  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <DashboardLayout>
        <GlobalBillingClient
          categories={data.globalBillingCategories}
        />
      </DashboardLayout>

    </SessionGuard>
  );
}