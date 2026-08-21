import SessionGuard from '@/components/SessionGuard';
import GlobalBillingClient from './GlobalBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetGlobalBillingCategoriesDocument,
  GetGlobalBillingCategoriesQuery,
  GetGlobalBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function GlobalBillingPage() {
  const [data] = await Promise.all([
    graphqlFetch<
      GetGlobalBillingCategoriesQuery,
      GetGlobalBillingCategoriesQueryVariables
    >(GetGlobalBillingCategoriesDocument, {}),
  ]);

  if (data.authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={data.message} />;
  }

  if (data.authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <GlobalBillingClient
        categories={data.data!.globalBillingCategories}
      />
    </SessionGuard>
  );
}