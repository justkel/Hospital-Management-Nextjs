import { WhoAmIDocument, WhoAmIQuery, WhoAmIQueryVariables } from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const data = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(WhoAmIDocument, {});

  // If access token expired, data will be null
  if (!data) {
    return <DashboardClient email={null} roles={[]} needsRefresh={true} />;
  }

  const raw = data.whoAmI ?? '';
  const [emailPart, rolesPart] = raw.split(' and ');

  const email = emailPart?.replace('Your email is ', '').trim() ?? 'Unknown';

  const roles = rolesPart
    ?.replace('your roles are ', '')
    .split(',')
    .map((r) => r.trim()) ?? [];

  return <DashboardClient email={email} roles={roles} needsRefresh={false} />;
}
