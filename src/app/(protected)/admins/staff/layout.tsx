import { ReactNode } from 'react';
import DashboardShell from '@/components/layout/DashboardShell';
import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
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
    ? data.whoAmI.roles as Roles[]
    : [];

  return (
    <DashboardShell roles={roles}>
      {children}
    </DashboardShell>
  );
}