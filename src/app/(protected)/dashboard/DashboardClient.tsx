'use client';

import { Card, Row, Col, Typography, Space, Tag } from 'antd';
import { UserOutlined, SafetyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type Props = {
  email: string;
  roles: string[];
};

export default function DashboardClient({ email, roles }: Props) {
  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <div>
        <Title level={2} style={{ marginBottom: 4 }}>
          Welcome back 👋
        </Title>
        <Text type="secondary">
          Here’s a quick overview of your account
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} lg={8}>
          <Card variant='borderless' style={{ borderRadius: 16 }}>
            <Space size="middle">
              <UserOutlined style={{ fontSize: 24 }} />
              <div>
                <Text type="secondary">Signed in as</Text>
                <div>
                  <Text strong>{email}</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={8}>
          <Card variant='outlined' style={{ borderRadius: 16 }}>
            <Space size="middle">
              <SafetyOutlined style={{ fontSize: 24 }} />
              <div>
                <Text type="secondary">Roles</Text>
                <div>
                  {roles.map((role) => (
                    <Tag key={role} color="blue">
                      {role}
                    </Tag>
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
