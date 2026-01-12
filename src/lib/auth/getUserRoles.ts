export async function getUserRoles(): Promise<string[]> {
  try {
    const res = await fetch('/api/auth', {
      credentials: 'include',
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data: {
      roles?: {
        email: string;
        roles: string[];
      };
    } = await res.json();

    return Array.isArray(data.roles?.roles)
      ? data.roles.roles
      : [];
  } catch {
    return [];
  }
}
