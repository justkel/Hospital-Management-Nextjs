'use client';

import {
  Button,
  Form,
  Input,
} from 'antd';
import { loginAction } from '@/lib/auth/login.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Activity, AlertCircle, ArrowRight, CreditCard, FileText, IdCard, ShieldCheck, Users } from 'lucide-react';

const STATUS_MESSAGE_MAP: Record<string, string> = {
  SUSPENDED: 'Your account has been suspended.',
  PENDING: 'Your account is pending approval.',
  INACTIVE: 'Your account is inactive.',
};

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: {
    userCode: string;
    password: string;
  }) => {
    setError(null);
    setLoading(true);

    const result = await loginAction(values);

    setLoading(false);

    if (!result.success) {
      const customMessage =
        (result.status && STATUS_MESSAGE_MAP[result.status]) ||
        result.message ||
        'Login failed';

      setError(customMessage);
      return;
    }

    if (result.forcePasswordChange) {
      router.replace('/force-password-change');
      return;
    }

    router.replace('/dashboard');

  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f4f0] font-sans lg:grid lg:grid-cols-[1fr_480px]">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0c1a12] px-10 py-12 lg:flex xl:px-14">

        <div className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 20% 80%, rgba(29,158,117,0.18) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 10%, rgba(93,202,165,0.10) 0%, transparent 55%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#1D9E75]">
            <ShieldCheck size={19} className="text-white" />
          </div>
          <div>
            <p className="text-[16px] font-medium leading-none text-white">HMS Pro</p>
            <p className="mt-0.5 text-[11px] uppercase tracking-[0.06em] text-[#3B6D11]">Clinical OS</p>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col justify-center py-12">
          <span className="pointer-events-none absolute -top-2 -left-2 select-none text-[96px] font-medium leading-none tracking-[-0.04em] text-white/[0.06]">
            24/7
          </span>

          <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#5DCAA5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
            Healthcare reimagined
          </div>

          <h1 className="mb-5 text-[38px] font-medium leading-[1.1] tracking-[-0.025em] text-white">
            One platform.<br />
            <span className="text-[#5DCAA5]">Every patient.</span><br />
            Every workflow.
          </h1>

          <p className="mb-10 max-w-sm text-[13px] leading-[1.75] text-[#5a7a6a]">
            Built for clinicians who move fast. Manage records, billing, staff, and procedures without switching tools.
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { val: '24/7', label: 'Access' },
              { val: 'Secure', label: 'Patient Records' },
              { val: 'Fast', label: 'Workflow' },
            ].map(m => (
              <div key={m.label} className="rounded-xl border border-white/[0.07] bg-white/[0.04] px-4 py-3.5">
                <p className="text-[22px] font-medium leading-none text-white">{m.val}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.06em] text-[#3B6D11]">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-between border-t border-white/[0.06] pt-5">
          <span className="text-[11px] text-[#1f3328]">© {new Date().getFullYear()} HMS Pro</span>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/12 px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
            <span className="text-[11px] font-medium text-[#1D9E75]">All systems live</span>
          </div>
        </div>
      </div>
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
              Secure access
            </div>
            <h2 className="text-[26px] font-medium tracking-[-0.02em] text-[#2C2C2A]">Welcome back</h2>
            <p className="mt-1 text-[14px] text-[#888780]">Sign in to your clinical workspace</p>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-[10px] border border-[#F7C1C1] bg-[#FCEBEB] px-3 py-2.5 text-sm text-[#A32D2D]">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Form form={form} layout="vertical" onFinish={onFinish} disabled={loading}>

            <Form.Item
              name="userCode"
              rules={[{ required: true }]}
              label={
                <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                  Staff code
                </span>
              }
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                  <IdCard size={16} className="text-[#B4B2A9]" />
                </div>

                <Input
                  size="large"
                  placeholder="e.g. STF-00142"
                  className="!h-12 !rounded-[10px] !border-[#D3D1C7] !bg-white !pl-10 !text-[#2C2C2A] placeholder:!text-[#B4B2A9]"
                />
              </div>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true }]}
              label={
                <span className="text-[11px] font-medium uppercase tracking-[0.07em] text-[#888780]">
                  Password
                </span>
              }
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                  <ShieldCheck size={16} className="text-[#B4B2A9]" />
                </div>

                <Input.Password
                  size="large"
                  placeholder="Enter your password"
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
              Sign in
            </Button>
          </Form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#D3D1C7]" />
            <span className="text-[11px] uppercase tracking-[0.07em] text-[#B4B2A9]">What's included</span>
            <div className="h-px flex-1 bg-[#D3D1C7]" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FileText, label: 'Patient records' },
              { icon: Users, label: 'Staff control' },
              { icon: CreditCard, label: 'Billing' },
              { icon: Activity, label: 'Procedure tracking' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-lg border border-[#D3D1C7] bg-white px-3 py-2.5">
                <Icon size={14} className="shrink-0 text-[#1D9E75]" />
                <span className="text-[12px] font-medium text-[#5F5E5A]">{label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 border-t border-[#D3D1C7] pt-5 text-center text-[11px] text-[#B4B2A9]">
            Secured with end-to-end encryption
          </p>
        </div>
      </div>

    </div>
  );
}