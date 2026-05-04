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

export default async function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(
    WhoAmIDocument,
    {}
  );

  const roles: Roles[] = Array.isArray(data?.whoAmI?.roles)
    ? (data.whoAmI.roles.filter(
      (r): r is Roles => Object.values(Roles).includes(r as Roles)
    ) as Roles[])
    : [];

  return (
    <RoleProvider roles={roles}>
      <DashboardShell roles={roles}>
        {children}
      </DashboardShell>
    </RoleProvider>
  );
}