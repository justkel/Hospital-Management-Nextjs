'use client';

import { useEffect, useRef } from 'react';

interface Props {
  mode: 'refresh' | 'logout' | 'none';
  reason?: string;
  children?: React.ReactNode;
}

const MIN_DISPLAY_MS = 500;

export default function SessionGuard({ mode, reason, children }: Props) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (mode === 'none' || hasRun.current) return;
    hasRun.current = true;

    const startedAt = Date.now();
    const waitForMinDisplay = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = MIN_DISPLAY_MS - elapsed;
      return remaining > 0 ? new Promise((resolve) => setTimeout(resolve, remaining)) : Promise.resolve();
    };

    const goToLogin = async () => {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' }).catch(() => { });
      await waitForMinDisplay();
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
        await waitForMinDisplay();
        window.location.reload();
      } catch {
        goToLogin();
      }
    })();
  }, [mode, reason]);

  if (mode !== 'none') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden !bg-[#0C1A12] font-sans">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500;1,700&display=swap');
          .font-sans { font-family: 'Montserrat', ui-sans-serif, system-ui, sans-serif; }
        `}</style>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full !bg-[#1D9E75]/15 blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full !bg-[#5DCAA5]/10 blur-[100px]" />

        <div className="relative flex flex-col items-center gap-6">
          <span className="text-[22px] font-bold italic tracking-[-0.02em] !text-white">
            well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
          </span>
          <div className="relative h-10 w-10">
            <span className="absolute inset-0 rounded-full border-[3px] !border-white/10" />
            <span className="absolute inset-0 rounded-full border-[3px] !border-[#5DCAA5] border-t-transparent animate-spin" />
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[15px] font-bold tracking-[-0.01em] !text-white">
              {mode === 'logout' ? 'Signing you out' : 'Securing your session'}
            </p>
            <p className="text-[13px] font-medium !text-[#8fa89a]">Just a moment…</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
