import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import DashboardClient from './DashboardClient';
import SessionGuard from '@/components/SessionGuard';

export default async function DashboardPage() {
  const { data, authOutcome, message } = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(
    WhoAmIDocument,
    {}
  );

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.whoAmI) {
    return <SessionGuard mode="refresh" />;
  }

  const whoAmI = data.whoAmI;

  return (
    <SessionGuard mode="none">
      <DashboardClient
        email={whoAmI.email ?? 'Unknown'}
        roles={Array.isArray(whoAmI.roles) ? whoAmI.roles : []}
        phoneNumber={whoAmI.phoneNumber}
        status={whoAmI.status}
        lastLoginAt={whoAmI.lastLoginAt}
        lastSeenAt={whoAmI.lastSeenAt}
      />
    </SessionGuard>
  );
}
