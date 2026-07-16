'use client';

import { useState } from 'react';
import { Form, Input, message } from 'antd';
import { AlertCircle, KeyRound, Lock } from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';

export default function ProfileClient() {
  const [form] = Form.useForm();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    setError(null);

    if (values.newPassword !== values.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const res = await clientFetch('/api/staff/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error || 'Failed to change password');
        return;
      }

      message.success('Password changed successfully');
      form.resetFields();
    } catch (err) {
      console.error(err);
      setError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 md:p-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            Profile
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account security settings
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <KeyRound size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Change password</h3>
              <p className="text-sm text-slate-500">
                Update the password used to sign in
              </p>
            </div>
          </div>

          <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-xs text-amber-700">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            Changing your password signs you out of every other device and
            browser — this one stays signed in.
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={submitting}
          >
            <Form.Item
              name="currentPassword"
              label={
                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Current password
                </span>
              }
              rules={[{ required: true, message: 'Enter your current password' }]}
            >
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                  <Lock size={16} className="text-slate-400" />
                </div>
                <Input.Password
                  size="large"
                  placeholder="Enter current password"
                  className="!h-11 !rounded-xl !border-slate-200 !pl-10"
                />
              </div>
            </Form.Item>

            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-4">
              <Form.Item
                name="newPassword"
                label={
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    New password
                  </span>
                }
                rules={[
                  { required: true, message: 'Enter a new password' },
                  { min: 8, message: 'Must be at least 8 characters' },
                ]}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <Input.Password
                    size="large"
                    placeholder="Enter new password"
                    className="!h-11 !rounded-xl !border-slate-200 !pl-10"
                  />
                </div>
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={
                  <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Confirm new password
                  </span>
                }
                rules={[{ required: true, message: 'Confirm your new password' }]}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-3 z-10 flex items-center">
                    <Lock size={16} className="text-slate-400" />
                  </div>
                  <Input.Password
                    size="large"
                    placeholder="Re-enter new password"
                    className="!h-11 !rounded-xl !border-slate-200 !pl-10"
                  />
                </div>
              </Form.Item>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white! shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Changing password…' : 'Change password'}
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}