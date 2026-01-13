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

        setTimeout(() => {
          window.location.reload();
        }, 600);
      } catch {
        window.location.href = '/login';
      }
    };

    refresh();
  }, [needsRefresh]);

  if (needsRefresh) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-12 w-12">
            <span className="absolute inset-0 rounded-full border-4 border-white/20" />
            <span className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-white font-semibold tracking-tight">
              Securing your session
            </p>
            <p className="text-sm text-white/60">
              Just a moment…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
