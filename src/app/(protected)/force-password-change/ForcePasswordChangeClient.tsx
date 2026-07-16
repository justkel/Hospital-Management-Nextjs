'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';

export default function ForcePasswordChangeClient() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setLoading(true);

    const res = await clientFetch('/api/staff/update-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
      credentials: 'include',
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? 'Something went wrong');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // // force re-login
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f4f0] font-sans lg:grid lg:grid-cols-[1fr_480px]">
      <AuthBrandPanel />

      <div className="flex min-h-screen flex-col justify-center bg-[#f5f4f0] px-6 py-12 sm:px-10">
        <div className="w-full max-w-[380px] mx-auto">

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#1D9E75]">
              <ShieldCheck size={17} className="text-white" />
            </div>
            <span className="text-[16px] font-medium text-[#2C2C2A]">HMS Pro</span>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#888780]">
              Security checkpoint
            </div>
            <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
              Update your password
            </h2>
            <p className="mt-1 text-[14px] text-[#888780]">
              For your security, set a new password before continuing.
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border border-[#F7C1C1] bg-[#FCEBEB] px-3 py-2.5 text-sm text-[#A32D2D]">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border border-[#BFE8D2] bg-[#EAF7F0] px-3 py-2.5 text-sm text-[#1D7A4F]">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
              Password updated successfully. Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-[10px] border border-[#D3D1C7] bg-white pl-4 pr-11 text-[#2C2C2A] outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B2A9] transition hover:text-[#5F5E5A]"
                >
                  {showCurrent ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-[10px] border border-[#D3D1C7] bg-white pl-4 pr-11 text-[#2C2C2A] outline-none transition focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B4B2A9] transition hover:text-[#5F5E5A]"
                >
                  {showNew ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1.5 text-[12px] text-[#B4B2A9]">
                Must be at least 8 characters, and different from your current password.
              </p>
            </div>

            <button
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-[10px] border-none bg-[#0c1a12] font-medium !text-white transition hover:bg-[#1D9E75] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
