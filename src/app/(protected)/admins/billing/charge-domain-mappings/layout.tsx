import { ReactNode } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import SessionGuard from '@/components/SessionGuard';
import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import { Roles } from '@/shared/utils/enums/roles';
import { RoleProvider } from '@/providers/RoleContext';

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { data, authOutcome, message } = await graphqlFetch<
    WhoAmIQuery,
    WhoAmIQueryVariables
  >(WhoAmIDocument, {});

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  const roles: Roles[] = Array.isArray(data?.whoAmI?.roles)
    ? (data.whoAmI.roles as Roles[])
    : [];

  return (
    <SessionGuard mode="none">
      <RoleProvider roles={roles}>
        <DashboardShell roles={roles}>
          {children}
        </DashboardShell>
      </RoleProvider>
    </SessionGuard>
  );
}