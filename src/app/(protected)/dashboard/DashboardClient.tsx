'use client';

import { Card, Row, Col, Typography, Space, Tag } from 'antd';
import {
  UserOutlined,
  SafetyOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Props {
  email: string | null;
  roles: string[];
}

export default function DashboardClient({ email, roles }: Props) {
  return (
    <Space orientation="vertical" size={32} style={{ width: '100%' }}>
      <Card
        style={{
          borderRadius: 20,
          background:
            'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          color: '#fff',
        }}
        variant='outlined'
      >
        <Title level={2} style={{ color: '#fff', marginBottom: 4 }}>
          Welcome back 👋
        </Title>
        <Text style={{ color: '#9ca3af' }}>
          Here’s what’s happening with your account today
        </Text>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 18,
              height: '100%',
            }}
          >
            <Space size={16} align="start">
              <div
                style={{
                  background: '#eef2ff',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <UserOutlined style={{ fontSize: 22, color: '#4338ca' }} />
              </div>

              <div>
                <Text type="secondary">Signed in as</Text>
                <div>
                  <Text strong style={{ fontSize: 15 }}>
                    {email ?? 'Unknown'}
                  </Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card
            hoverable
            style={{
              borderRadius: 18,
              height: '100%',
            }}
          >
            <Space size={16} align="start">
              <div
                style={{
                  background: '#ecfeff',
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <SafetyOutlined
                  style={{ fontSize: 22, color: '#0e7490' }}
                />
              </div>

              <div>
                <Text type="secondary">Your roles</Text>
                <div style={{ marginTop: 6 }}>
                  {roles.length ? (
                    roles.map((role) => (
                      <Tag
                        key={role}
                        style={{
                          borderRadius: 999,
                          padding: '4px 12px',
                          border: 'none',
                          background: '#f1f5f9',
                        }}
                      >
                        {role}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">No roles assigned</Text>
                  )}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
