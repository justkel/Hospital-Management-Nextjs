'use client';

import { useEffect, useState } from 'react';
import { getUserRoles } from './getUserRoles';

export function useUserRoles() {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserRoles()
      .then(setRoles)
      .finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}
