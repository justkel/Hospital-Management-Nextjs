'use client';

import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';
import { requestPasswordResetAction } from '@/lib/auth/request-password-reset.action';

export default function ForgotPasswordPage() {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setError(null);
    setLoading(true);

    const result = await requestPasswordResetAction(values);

    setLoading(false);

    if (!result.success) {
      setError(result.message || 'Something went wrong');
      return;
    }

    setSubmitted(true);
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

          {submitted ? (
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF7F0]">
                <CheckCircle2 size={26} className="text-[#1D9E75]" />
              </div>
              <h2 className="text-[22px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                Check your inbox
              </h2>
              <p className="mt-2 text-[14px] leading-relaxed text-[#888780]">
                If an account exists for that email, we&apos;ve sent a link
                to reset your password. It expires in 30 minutes.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-[13px] font-medium text-[#1D9E75] hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#888780]">
                  Account recovery
                </div>
                <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#2C2C2A]">
                  Forgot password?
                </h2>
                <p className="mt-1 text-[14px] text-[#888780]">
                  Enter your email and we&apos;ll send you a reset link
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
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Enter a valid email address' },
                  ]}
                  label={
                    <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                      Email address
                    </span>
                  }
                >
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                      <Mail size={16} className="text-[#B4B2A9]" />
                    </div>

                    <Input
                      size="large"
                      placeholder="you@hospital.com"
                      className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                    />
                  </div>
                </Form.Item>

                <Button
                  htmlType="submit"
                  block
                  loading={loading}
                  className="!mt-4 !mb-6 !h-12 !rounded-[10px] !border-none !bg-[#0c1a12] !font-medium !text-white transition hover:!bg-[#1D9E75]"
                >
                  {!loading && <ArrowRight size={16} className="mr-2" />}
                  Send reset link
                </Button>
              </Form>

              <p className="mt-6 text-center text-[13px] text-[#888780]">
                Remembered your password?{' '}
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