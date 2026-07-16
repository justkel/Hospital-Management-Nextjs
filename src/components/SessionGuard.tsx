'use client';

import { useEffect, useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  needsRefresh: boolean;
  children?: React.ReactNode;
}

export default function SessionGuard({ needsRefresh, children }: Props) {
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (!needsRefresh || hasRefreshed.current) return;

    hasRefreshed.current = true;

    const refresh = async () => {
      try {
        const res = await fetch('/api/refresh', { method: 'POST', credentials: 'include' });
        const json = await res.json();

        if (!json.success) {
          await fetch('/api/logout', {
            method: 'POST',
            credentials: 'include',
          });
          window.location.href = '/login';
          return;
        }

        window.location.reload();
      } catch{
        await fetch('/api/logout', {
          method: 'POST',
          credentials: 'include',
        });
        window.location.href = '/login';
      }
    };

    refresh();
  }, [needsRefresh]);

  if (needsRefresh) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0c1a12]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(29,158,117,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 10%, rgba(93,202,165,0.10) 0%, transparent 55%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative flex flex-col items-center gap-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#1D9E75]">
            <ShieldCheck size={20} className="text-white" />
          </div>

          <div className="relative h-10 w-10">
            <span className="absolute inset-0 rounded-full border-[3px] border-white/10" />
            <span className="absolute inset-0 rounded-full border-[3px] border-[#5DCAA5] border-t-transparent animate-spin" />
          </div>

          <div className="space-y-1 text-center">
            <p className="text-[15px] font-medium tracking-[-0.01em] text-white">
              Securing your session
            </p>
            <p className="text-[13px] text-[#5a7a6a]">
              Just a moment…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
