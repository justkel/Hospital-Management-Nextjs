'use client';

import { createContext, useContext } from 'react';
import { Roles } from '@/shared/utils/enums/roles';

const RoleContext = createContext<Roles[]>([]);

export const RoleProvider = ({
  roles,
  children,
}: {
  roles: Roles[];
  children: React.ReactNode;
}) => {
  return (
    <RoleContext.Provider value={roles}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoles = () => useContext(RoleContext);