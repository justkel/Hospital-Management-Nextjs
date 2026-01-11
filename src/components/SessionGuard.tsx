'use client';

import { useEffect } from 'react';

interface Props {
  needsRefresh: boolean;
  children?: React.ReactNode;
}

export default function SessionGuard({ needsRefresh, children }: Props) {
  useEffect(() => {
    if (!needsRefresh) return;

    const refresh = async () => {
      try {
        const res = await fetch('/api/refresh', { method: 'POST' });
        const json = await res.json();

        if (!json.success) {
          window.location.href = '/login';
          return;
        }

        window.location.reload();
      } catch {
        window.location.href = '/login';
      }
    };

    refresh();
  }, [needsRefresh]);

  if (needsRefresh) {
    return <p>Refreshing session…</p>;
  }

  return <>{children}</>;
}
