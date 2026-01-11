'use client';

import { useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Tag } from 'antd';
import { UserOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  email: string | null;
  roles: string[];
  needsRefresh: boolean;
}

export default function DashboardClient({ email, roles, needsRefresh }: Props) {
  useEffect(() => {
    if (needsRefresh) {
      const refresh = async () => {
        try {
          const res = await fetch('/api/refresh', { method: 'POST' });
          const json = await res.json();
          if (!json.success) {
            window.location.href = '/login';
            return;
          }
          window.location.reload();
        } catch (err) {
          console.error('Refresh failed', err);
          window.location.href = '/login';
        }
      };
      refresh();
    }
  }, [needsRefresh]);

  if (needsRefresh) {
    return <p>Refreshing session…</p>;
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Welcome back 👋
        </Title>
        <Text type="secondary">Here’s a quick overview of your account</Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Card style={{ borderRadius: 16 }} variant='outlined'>
            <Space size="middle">
              <UserOutlined style={{ fontSize: 24 }} />
              <div>
                <Text type="secondary">Signed in as</Text>
                <div>
                  <Text strong>{email ?? 'Unknown'}</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card style={{ borderRadius: 16 }} variant='borderless'>
            <Space size="middle">
              <SafetyOutlined style={{ fontSize: 24 }} />
              <div>
                <Text type="secondary">Roles</Text>
                <div>
                  {roles.length > 0
                    ? roles.map((role) => (
                        <Tag key={role} color="blue">
                          {role}
                        </Tag>
                      ))
                    : 'No roles'}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
