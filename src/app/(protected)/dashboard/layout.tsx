'use client';

import { ReactNode, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  TeamOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useUserRoles } from '@/lib/auth/useUserRoles';
import { Roles } from '@/shared/utils/enums/roles';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const userRoles = useUserRoles();
  const roles = userRoles.roles;

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
        { type: 'divider' },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
      ]}
    />
  );

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'patients', icon: <TeamOutlined />, label: 'Patients' },
    { key: 'records', icon: <FileTextOutlined />, label: 'Medical Records' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    ...(roles.includes(Roles.ADMIN)
    ? [
        {
          key: 'audit',
          icon: <FileTextOutlined />,
          label: 'Audit Logs',
        },
      ]
    : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        style={{ background: '#ffffff', borderRight: '1px solid #f0f0f0' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? 0 : '0 24px',
            gap: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <Avatar shape="square" size={40} style={{ background: '#1677ff' }}>H</Avatar>
          {!collapsed && <span>Hospital Admin</span>}
        </div>

        <Menu mode="inline" defaultSelectedKeys={['dashboard']} style={{ borderRight: 0 }} items={menuItems} />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#ffffff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space size="middle">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: 18 }}
            />
            <Title level={4} style={{ margin: 0 }}>
              Dashboard
            </Title>
          </Space>

          <Dropdown menu={{ items: userMenu.props.items }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar icon={<UserOutlined />} />
              <Text strong>Admin</Text>
            </Space>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: '24px',
            background: '#ffffff',
            borderRadius: 12,
            minHeight: 'calc(100vh - 112px)',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
