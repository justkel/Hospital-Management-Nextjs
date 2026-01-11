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

  const raw = data.whoAmI ?? '';
  const [emailPart, rolesPart] = raw.split(' and ');

  const email =
    emailPart?.replace('Your email is ', '').trim() ?? 'Unknown';

  const roles =
    rolesPart
      ?.replace('your roles are ', '')
      .split(',')
      .map((r) => r.trim()) ?? [];

  return (
    <SessionGuard needsRefresh={false}>
      <DashboardClient email={email} roles={roles} />
    </SessionGuard>
  );
}
