'use client';

import { Button, Form, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { validatePasswordResetTokenAction } from '@/lib/auth/validate-password-reset-token.action';
import { resetPasswordAction } from '@/lib/auth/reset-password.action';

type PageState = 'checking' | 'invalid' | 'form' | 'success';

export default function ResetPasswordForm() {
  const [form] = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [state, setState] = useState<PageState>('checking');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!token) {
        if (!cancelled) setState('invalid');
        return;
      }

      const valid = await validatePasswordResetTokenAction(token);

      if (cancelled) return;

      setState(valid ? 'form' : 'invalid');
    }

    check();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (state !== 'invalid') return;

    const timer = setTimeout(() => {
      router.replace('/forgot-password');
    }, 4000);

    return () => clearTimeout(timer);
  }, [state, router]);

  const onFinish = async (values: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    setError(null);

    if (values.newPassword !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await resetPasswordAction({
      token,
      newPassword: values.newPassword,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Failed to reset password');
      return;
    }

    setState('success');

    setTimeout(() => {
      router.replace('/login');
    }, 3000);
  };

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

          {state === 'checking' && (
            <p className="text-center text-[14px] text-[#888780]">
              Checking your link…
            </p>
          )}

          {state === 'invalid' && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FCEBEB]">
                <AlertCircle size={26} className="text-[#A32D2D]" />
              </div>
              <h2 className="text-[22px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                This link isn&apos;t valid
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#888780]">
                It may have expired or already been used. Reset links are
                only valid for 30 minutes and can only be used once.
              </p>
              <Link
                href="/forgot-password"
                className="mt-6 inline-block text-[13px] font-medium text-[#1D9E75] hover:underline"
              >
                Request a new link
              </Link>
            </div>
          )}

          {state === 'success' && (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F0]">
                <CheckCircle2 size={26} className="text-[#1D9E75]" />
              </div>
              <h2 className="text-[22px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                Password updated
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#888780]">
                Redirecting you to sign in…
              </p>
            </div>
          )}

          {state === 'form' && (
            <>
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#888780]">
                  Account recovery
                </div>
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                  Choose a new password
                </h2>
                <p className="mt-1 text-[14px] text-[#888780]">
                  Make it something you haven&apos;t used before
                </p>
              </div>

              {error && (
                <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border border-[#F7C1C1] bg-[#FCEBEB] px-3 py-2.5 text-sm text-[#A32D2D]">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>
                <Form.Item
                  name="newPassword"
                  rules={[
                    { required: true, message: 'Please enter a new password' },
                    { min: 8, message: 'Must be at least 8 characters' },
                  ]}
                  label={
                    <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                      New password
                    </span>
                  }
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                      <Lock size={16} className="text-[#B4B2A9]" />
                    </div>

                    <Input.Password
                      size="large"
                      placeholder="Enter new password"
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[{ required: true, message: 'Please confirm your password' }]}
                  label={
                    <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                      Confirm password
                    </span>
                  }
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                      <Lock size={16} className="text-[#B4B2A9]" />
                    </div>

                    <Input.Password
                      size="large"
                      placeholder="Re-enter new password"
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </Form.Item>

                <Button
                  htmlType="submit"
                  block
                  loading={loading}
                  className="!mt-4 !h-12 !rounded-[10px] !border-none !bg-[#0c1a12] !font-medium !text-white transition hover:!bg-[#1D9E75]"
                >
                  {!loading && <ArrowRight size={16} className="mr-2" />}
                  Reset password
                </Button>
              </Form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}