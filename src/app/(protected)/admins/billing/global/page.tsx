import SessionGuard from '@/components/SessionGuard';
import GlobalBillingClient from './GlobalBillingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import {
  GetGlobalBillingCategoriesDocument,
  GetGlobalBillingCategoriesQuery,
  GetGlobalBillingCategoriesQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function GlobalBillingPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetGlobalBillingCategoriesQuery,
    GetGlobalBillingCategoriesQueryVariables
  >(GetGlobalBillingCategoriesDocument, {});

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.globalBillingCategories) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <GlobalBillingClient categories={data.globalBillingCategories} />
    </SessionGuard>
  );
}