'use client';

import { useState } from 'react';
import { Button, Input } from 'antd';
import Link from 'next/link';
import Lottie from 'lottie-react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Compass,
  GraduationCap,
  Mail,
  MoreHorizontal,
  Phone,
  PlayCircle,
  User,
} from 'lucide-react';

import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import Cardiologist from '@/animations/Cardiologist.json';
import welcomeAnimation from '@/animations/Doctor welcoming pacient.json';

type ReasonOption = 'DEMO' | 'PRODUCT_EXPLORATION' | 'TRAINING' | 'OTHER';

const REASON_OPTIONS: {
  value: ReasonOption;
  label: string;
  description: string;
  icon: typeof Compass;
}[] = [
  {
    value: 'DEMO',
    label: 'See a live demo',
    description: 'Quick guided walkthrough',
    icon: PlayCircle,
  },
  {
    value: 'PRODUCT_EXPLORATION',
    label: 'Explore the product',
    description: 'Poke around on your own',
    icon: Compass,
  },
  {
    value: 'TRAINING',
    label: 'Training session',
    description: 'Onboarding a team',
    icon: GraduationCap,
  },
  {
    value: 'OTHER',
    label: 'Something else',
    description: 'Oooooooouuu!!!',
    icon: MoreHorizontal,
  },
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reasonForVisit: ReasonOption | null;
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  reasonForVisit: null,
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function GuestAccessPage() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit() {
    setError(null);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('Please enter your first and last name');
      return;
    }
    if (!isValidEmail(form.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.phone.trim()) {
      setError('Please enter a phone number');
      return;
    }
    if (!form.reasonForVisit) {
      setError('Let us know why you\u2019re requesting access');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/guest-requests/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          reasonForVisit: form.reasonForVisit,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Failed to submit your request');
        return;
      }

      setSubmitted(true);
    } catch {
      setError('Unable to reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f4f0] font-sans lg:grid lg:grid-cols-[1fr_480px]">
      <AuthBrandPanel />

      <div className="flex min-h-screen flex-col justify-center bg-[#f5f4f0] px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-[420px]">
          {submitted ? (
            <div className="text-center">
              <div className="mx-auto -mb-2 h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
                <Lottie animationData={welcomeAnimation} loop autoplay />
              </div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1D9E75]/25 bg-[#F0FAF5] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-[#1D9E75]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
                Request received
              </div>

              <h2 className="text-[24px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                You&apos;re on the list!
              </h2>

              <p className="mx-auto mt-2 max-w-[320px] text-[14px] leading-relaxed text-[#888780]">
                An admin will review your request shortly. Once approved,
                we&apos;ll send login details to{' '}
                <span className="font-medium text-[#2C2C2A]">{form.email}</span>.
              </p>

              <Link
                href="/login"
                className="mt-7 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1D9E75] hover:underline"
              >
                <ArrowLeft size={13} />
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mx-auto mb-6 h-[120px] w-[120px] sm:h-[140px] sm:w-[140px]">
                <Lottie animationData={Cardiologist} loop autoplay />
              </div>

              <div className="mb-7 text-center">
                <div className="mb-3 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#888780]">
                  Guest access
                </div>
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                  Explore the platform
                </h2>
                <p className="mt-1 text-[14px] text-[#888780]">
                  Request temporary demo access — no strings attached
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border border-[#F7C1C1] bg-[#FCEBEB] px-3 py-2.5 text-sm text-[#A32D2D]">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                      First name
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                        <User size={16} className="text-[#B4B2A9]" />
                      </div>
                      <Input
                        size="large"
                        placeholder="Ada"
                        value={form.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                      Last name
                    </label>
                    <Input
                      size="large"
                      placeholder="Lovelace"
                      value={form.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                      <Mail size={16} className="text-[#B4B2A9]" />
                    </div>
                    <Input
                      size="large"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                    Phone number
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                      <Phone size={16} className="text-[#B4B2A9]" />
                    </div>
                    <Input
                      size="large"
                      type="tel"
                      placeholder="+234 800 000 0000"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                    What brings you here?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {REASON_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const selected = form.reasonForVisit === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('reasonForVisit', opt.value)}
                          className={`flex flex-col items-start gap-2 rounded-[10px] border px-3 py-3 text-left transition ${
                            selected
                              ? 'border-[#1D9E75] bg-[#F0FAF5]'
                              : 'border-[#D3D1C7] bg-white hover:border-[#B4B2A9]'
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                              selected
                                ? 'bg-[#1D9E75] text-white'
                                : 'bg-[#F5F4F0] text-[#888780]'
                            }`}
                          >
                            <Icon size={15} />
                          </div>
                          <div>
                            <p
                              className={`text-[12.5px] font-medium leading-tight ${
                                selected ? 'text-[#1D9E75]' : 'text-[#2C2C2A]'
                              }`}
                            >
                              {opt.label}
                            </p>
                            <p className="mt-0.5 text-[11px] leading-tight text-[#B4B2A9]">
                              {opt.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  block
                  loading={loading}
                  onClick={handleSubmit}
                  className="!mt-2 !h-12 !rounded-[10px] !border-none !bg-[#0c1a12] !font-medium !text-white transition hover:!bg-[#1D9E75]"
                >
                  {!loading && <ArrowRight size={16} className="mr-2" />}
                  Request access
                </Button>
              </div>

              <p className="mt-6 border-t border-[#D3D1C7] pt-5 text-center text-[13px] text-[#888780]">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-[#1D9E75] hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}