'use client';

import {
  Button,
  Form,
  Input,
} from 'antd';
import { loginAction } from '@/lib/auth/login.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Activity, AlertCircle, ArrowRight, CreditCard, FileText, IdCard, ShieldCheck, Sparkles, Users, Loader2, CheckCircle } from 'lucide-react';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';

const STATUS_MESSAGE_MAP: Record<string, string> = {
  SUSPENDED: 'Your account has been suspended.',
  PENDING: 'Your account is pending approval.',
  INACTIVE: 'Your account is inactive.',
  ACCOUNT_INACTIVE: 'Your account is not active. Please contact your administrator.',
};

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [buttonText, setButtonText] = useState('Sign in');

  const onFinish = async (values: { userCode: string; password: string }) => {
    setError(null);
    setLoading(true);
    setSuccess(false);
    setButtonText('Authenticating...');

    try {
      const result = await loginAction(values);

      if (!result.success) {
        const customMessage =
          (result.status && STATUS_MESSAGE_MAP[result.status]) ||
          (result.code && STATUS_MESSAGE_MAP[result.code]) ||
          result.message ||
          'Login failed';

        setError(customMessage);
        setLoading(false);
        setButtonText('Sign in');
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setLoading(false);
      setSuccess(true);
      setButtonText('Success!');
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (result.forcePasswordChange) {
        router.replace('/force-password-change');
        return;
      }

      router.replace('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
      setSuccess(false);
      setButtonText('Sign in');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden !bg-[#f5f4f0] font-sans lg:grid lg:grid-cols-[1fr_480px]">
      <AuthBrandPanel />

      <div className="flex min-h-screen flex-col justify-center !bg-[#f5f4f0] px-6 py-12 sm:px-10">
        <div className="w-full max-w-[380px] mx-auto">

          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="text-[19px] font-bold italic tracking-[-0.02em] !text-[#14231A]">
              well<span className="!text-[#1D9E75] underline decoration-[#1D9E75]/30 underline-offset-4">flex</span>ia !
            </span>
          </div>

          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.1em] !text-[#888780]">
              Secure access
            </div>
            <h2 className="text-[26px] font-extrabold tracking-[-0.02em] !text-[#2C2C2A]">Welcome back</h2>
            <p className="mt-1 text-[14px] font-medium !text-[#888780]">Sign in to your clinical workspace</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border !border-[#F7C1C1] !bg-[#FCEBEB] px-3 py-2.5 text-sm font-medium !text-[#A32D2D] animate-in slide-in-from-top-2 duration-200">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading || success}>

            <Form.Item
              name="userCode"
              rules={[{ required: true }]}
              label={
                <span className="text-[11px] font-bold uppercase tracking-[0.07em] !text-[#888780]">
                  Staff code
                </span>
              }
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                  <IdCard size={16} className="!text-[#B4B2A9]" />
                </div>

                <Input
                  size="large"
                  placeholder="e.g. STF-00142"
                  disabled={loading || success}
                  className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9] transition-all focus:!border-[#1D9E75] focus:!shadow-[0_0_0_3px_rgba(29,158,117,0.1)] disabled:!bg-[#f5f4f0] disabled:!cursor-not-allowed"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true }]}
              label={
                <span className="text-[11px] font-bold uppercase tracking-[0.07em] !text-[#888780]">
                  Password
                </span>
              }
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                  <ShieldCheck size={16} className="!text-[#B4B2A9]" />
                </div>

                <Input.Password
                  size="large"
                  placeholder="Enter your password"
                  disabled={loading || success}
                  className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9] transition-all focus:!border-[#1D9E75] focus:!shadow-[0_0_0_3px_rgba(29,158,117,0.1)] disabled:!bg-[#f5f4f0] disabled:!cursor-not-allowed"
                />
              </div>
            </Form.Item>

            <div className="mb-2 flex justify-end">
              <Link
                href="/forgot-password"
                className="text-[12px] font-bold !text-[#1D9E75] hover:underline transition-colors hover:!text-[#167A5E]"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              htmlType="submit"
              block
              loading={loading}
              disabled={loading || success}
              className={`!mt-4 !h-12 !rounded-[10px] !border-none !font-bold !text-white transition-all duration-500 ${
                success 
                  ? '!bg-[#1D9E75] !shadow-[0_4px_20px_rgba(29,158,117,0.3)]' 
                  : loading 
                  ? '!bg-[#0c1a12]' 
                  : '!bg-[#0c1a12] hover:!bg-[#1D9E75] hover:!shadow-[0_4px_20px_rgba(29,158,117,0.2)]'
              }`}
            >
              {success ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={18} className="animate-in zoom-in duration-500" />
                  <span className="animate-in fade-in duration-500">Success!</span>
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">Authenticating...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  {buttonText ? (buttonText) : "Sign in"}
                </span>
              )}
            </Button>
          </Form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 !bg-[#D3D1C7]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.07em] !text-[#B4B2A9]">New here?</span>
            <div className="h-px flex-1 !bg-[#D3D1C7]" />
          </div>

          <Link href="/guest-access" className="block">
            <Button
              block
              disabled={loading || success}
              className="!h-12 !rounded-[10px] !border !border-[#1D9E75]/30 !bg-[#F0FAF5] !font-bold !text-[#1D9E75] transition-all hover:!border-[#1D9E75] hover:!bg-[#1D9E75]/10 hover:scale-[1.02] disabled:!opacity-50 disabled:!cursor-not-allowed"
            >
              <Sparkles size={15} className="mr-2 inline -mt-0.5" />
              Try the demo as a guest
            </Button>
          </Link>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 !bg-[#D3D1C7]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.07em] !text-[#B4B2A9]">What&apos;s included</span>
            <div className="h-px flex-1 !bg-[#D3D1C7]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FileText, label: 'Patient records', tint: '!bg-[#F0FAF5] !text-[#1D9E75]' },
              { icon: Users, label: 'Staff control', tint: '!bg-[#EFF6FF] !text-[#2563EB]' },
              { icon: CreditCard, label: 'Billing', tint: '!bg-[#FFFBEB] !text-[#D97706]' },
              { icon: Activity, label: 'Procedure tracking', tint: '!bg-[#F5F3FF] !text-[#7C3AED]' },
            ].map(({ icon: Icon, label, tint }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-lg border !border-[#D3D1C7] !bg-white px-3 py-2.5 transition-all hover:!border-[#1D9E75]/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:scale-[1.02]"
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tint}`}>
                  <Icon size={13} />
                </div>
                <span className="text-[12px] font-semibold !text-[#5F5E5A]">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t !border-[#D3D1C7] pt-5 text-center text-[11px] font-medium !text-[#B4B2A9]">
            Secured with end-to-end encryption
          </p>
        </div>
      </div>

    </div>
  );
}