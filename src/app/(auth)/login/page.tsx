'use client';

import { Button, Card, Form, Input, Typography, Alert } from 'antd';
import { loginAction } from '@/lib/auth/login.action';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title } = Typography;

const STATUS_MESSAGE_MAP: Record<string, string> = {
  SUSPENDED: 'Your account has been suspended. Please contact an administrator.',
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card style={{ width: 380 }}>
        <Title level={3} style={{ textAlign: 'center' }}>
          Staff Login
        </Title>

        {error && (
          <Alert
            type="error"
            title={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          disabled={loading}
        >
          <Form.Item
            label="Staff Code"
            name="userCode"
            rules={[{ required: true, message: 'Enter staff code' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter password' }]}
          >
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
