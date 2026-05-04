'use client';

import { ReactNode } from 'react';
import { useRoles } from '@/providers/RoleContext';
import { Roles } from '@/shared/utils/enums/roles';

interface Props {
  roles: Roles[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function HasRoles({ roles, children, fallback = null }: Props) {
  const userRoles = useRoles();

  const hasAccess = userRoles.some((r) => roles.includes(r));

  if (!hasAccess) return <>{fallback}</>;

  return <>{children}</>;
}

export function useHasRoles(roles: Roles[]) {
  const userRoles = useRoles();

  return userRoles.some((r) => roles.includes(r));
}