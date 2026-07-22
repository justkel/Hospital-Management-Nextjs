'use client';

import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import { ShieldCheck, User, Clock, Activity } from 'lucide-react';

import pillAnimation from '@/animations/pill.json';

interface Props {
  email: string | null;
  roles: string[];
  phoneNumber?: string | null;
  status?: string | null;
  lastLoginAt?: string | null;
  lastSeenAt?: string | null;
}

export default function DashboardClient({
  email,
  roles,
  status,
  lastLoginAt,
  lastSeenAt,
}: Props) {

  const [animationReady, setAnimationReady] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);

  const allReady = animationReady || forceReveal;

  const handleAnimationReady = () => {
    setAnimationReady(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setForceReveal(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const formatRelativeTime = (value?: string | null) => {
    if (!value) return '—';

    const date = new Date(value);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {!allReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1a12]">
          <div className="relative h-10 w-10">
            <span className="absolute inset-0 rounded-full border-[3px] border-white/10" />
            <span className="absolute inset-0 rounded-full border-[3px] border-[#5DCAA5] border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      <div className={allReady ? 'flex flex-col gap-5' : 'opacity-0'}>
        <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-7 sm:px-8">

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-[#1D9E75]/15 blur-[60px]" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">

            <div>
              <div className="mb-2.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#5DCAA5]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                Clinical workspace
              </div>

              <h1 className="mb-1 text-[22px] font-medium tracking-[-0.02em] text-white">
                {greeting} 👋
              </h1>

              <p className="text-[13px] leading-relaxed text-[#5a7a6a]">
                Here&apos;s what&apos;s happening with your account today.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/20 bg-[#1D9E75]/12 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#1D9E75]" />
                  <span className="text-[12px] font-medium text-[#1D9E75]">
                    All systems operational
                  </span>
                </div>

                {status && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                    <span className="text-[12px] font-medium text-white">
                      Status: {status}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="hidden gap-2.5 sm:flex">
              {[
                { val: String(roles.length || '—'), label: 'Roles' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="min-w-[68px] rounded-[10px] border border-white/[0.08] bg-white/[0.05] p-3 text-center"
                >
                  <p className="text-[20px] font-medium leading-none text-white">
                    {s.val}
                  </p>

                  <p className="mt-1 text-[10px] uppercase tracking-[0.07em] text-[#3B6D11]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="rounded-xl border border-[#E8E6E0] bg-white p-5 transition hover:border-[#D3D1C7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">

            <div className="h-[120px] w-[100px] shrink-0">
              <Lottie
                animationData={pillAnimation}
                loop
                autoplay
                onDOMLoaded={handleAnimationReady}
              />
            </div>

            <div className="hidden h-10 w-px bg-[#E8E6E0] sm:block" />

            <div className="flex items-center gap-3 sm:w-[220px] sm:shrink-0">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
                <User size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                  Signed in as
                </p>
                <p className="truncate text-[14px] font-medium text-[#2C2C2A]">
                  {email}
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-[#E8E6E0] sm:block" />

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-md bg-[#FFFBEB] text-[#D97706]">
                  <ShieldCheck size={13} />
                </div>
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                  Roles
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {roles.length ? (
                  roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex items-center gap-1 rounded-full border border-[#1D9E75]/25 bg-[#F0FAF5] px-2.5 py-1 text-[11px] font-medium text-[#1D9E75]"
                    >
                      <span className="h-1 w-1 rounded-full bg-[#1D9E75]" />
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-[#B4B2A9]">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white transition hover:border-[#D3D1C7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-1 divide-y divide-[#F0F0EC] sm:grid-cols-2 sm:divide-x sm:divide-y-0">

            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <Clock size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                  Signed in since
                </p>
                <p className="mt-0.5 truncate text-[16px] font-semibold text-[#2C2C2A]">
                  {formatRelativeTime(lastLoginAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEFDF4] text-[#16A34A]">
                <Activity size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                  Last active
                </p>
                <p className="mt-0.5 truncate text-[16px] font-semibold text-[#2C2C2A]">
                  {formatRelativeTime(lastSeenAt)}
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}