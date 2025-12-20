import { redirect } from 'next/navigation';
import { graphqlFetch, AuthError } from '@/shared/graphql/fetcher';
import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';

import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  let data: WhoAmIQuery;

  try {
    data = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(
      WhoAmIDocument,
      {}
    );
  } catch (err: unknown) {
    if (
      err instanceof AuthError ||
      (err as { message?: string }).message === 'UNAUTHENTICATED'
    ) {
      redirect('/login');
    }
    throw err;
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

  return <DashboardClient email={email} roles={roles} />;
}
