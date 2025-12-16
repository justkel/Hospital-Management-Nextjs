'use client';

import { Button, Card, Form, Input, Typography } from 'antd';
import { loginAction } from '@/lib/auth/login.action';

const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();

  const onFinish = async (values: { userCode: string; password: string }) => {
    await loginAction(values);
    console.log(values);
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

        <Form form={form} layout="vertical" onFinish={onFinish}>
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

          <Button type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
}
