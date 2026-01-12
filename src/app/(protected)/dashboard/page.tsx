import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import DashboardClient from './DashboardClient';
import SessionGuard from '@/components/SessionGuard';

export default async function DashboardPage() {
  const data = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(
    WhoAmIDocument,
    {}
  );

  // Access token expired → let SessionGuard refresh or redirect
  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  const email = data.whoAmI?.email ?? 'Unknown';
  const roles = Array.isArray(data.whoAmI?.roles)
    ? data.whoAmI.roles
    : [];

  return (
    <SessionGuard needsRefresh={false}>
      <DashboardClient email={email} roles={roles} />
    </SessionGuard>
  );
}
