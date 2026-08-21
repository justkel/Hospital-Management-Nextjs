'use client';

import { ShieldCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Props {
  mode: 'refresh' | 'logout' | 'none';
  reason?: string;
  children?: React.ReactNode;
}

export default function SessionGuard({ mode, reason, children }: Props) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (mode === 'none' || hasRun.current) return;
    hasRun.current = true;

    const goToLogin = async () => {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' }).catch(() => { });
      const url = reason ? `/login?reason=${encodeURIComponent(reason)}` : '/login';
      window.location.href = url;
    };

    if (mode === 'logout') {
      goToLogin();
      return;
    }

    // mode === 'refresh'
    (async () => {
      try {
        const res = await fetch('/api/refresh', { method: 'POST', credentials: 'include' });
        const json = await res.json();
        if (!json.success) return goToLogin();
        window.location.reload();
      } catch {
        goToLogin();
      }
    })();
  }, [mode, reason]);

  if (mode !== 'none') {
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
              {mode === 'logout' ? 'Signing you out' : 'Securing your session'}
            </p>
            <p className="text-[13px] text-[#5a7a6a]">Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
