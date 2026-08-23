import { ReactNode } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import { RoleProvider } from '@/providers/RoleContext';
import { Roles } from '@/shared/utils/enums/roles';
import SessionGuard from '@/components/SessionGuard';

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { data, authOutcome, message } = await graphqlFetch<
    WhoAmIQuery,
    WhoAmIQueryVariables
  >(WhoAmIDocument, {});

  if (authOutcome === 'refresh' || !data?.whoAmI) {
    return <SessionGuard mode="refresh" />;
  }

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  const roles: Roles[] = Array.isArray(data.whoAmI.roles)
    ? (data.whoAmI.roles.filter(
        (r): r is Roles => Object.values(Roles).includes(r as Roles)
      ) as Roles[])
    : [];

  return (
    <SessionGuard mode="none">
      <RoleProvider roles={roles}>
        <DashboardShell roles={roles}>{children}</DashboardShell>
      </RoleProvider>
    </SessionGuard>
  );
}