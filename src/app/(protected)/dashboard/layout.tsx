'use client';

import { ReactNode, useState } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Modal } from 'antd';
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
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const userRoles = useUserRoles();
  const roles = userRoles.roles;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (json.success) {
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const userMenu = (
    <Menu
      items={[
        { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
        { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Logout',
          danger: true,
          onClick: () => setLogoutModal(true),
        },
      ]}
    />
  );

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
    ...(roles.includes(Roles.ADMIN)
    ? [{ key: 'staff', icon: <TeamOutlined />, label: <Link href="/admins/staff">Staff</Link> }]
    : []),
    { key: 'patients', icon: <TeamOutlined />, label: 'Patients' },
    { key: 'records', icon: <FileTextOutlined />, label: 'Medical Records' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    ...(roles.includes(Roles.ADMIN)
      ? [{ key: 'audit', icon: <FileTextOutlined />, label: 'Audit Logs' }]
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
          <Avatar shape="square" size={40} style={{ background: '#1677ff' }}>
            H
          </Avatar>
          {!collapsed && <span>Hospital Admin</span>}
        </div>

        <Menu mode="inline" defaultSelectedKeys={['dashboard']} style={{ borderRight: 0 }} items={menuItems} />

        <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center' }}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            danger
            onClick={() => setLogoutModal(true)}
          >
            {!collapsed && 'Logout'}
          </Button>
        </div>
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

      <Modal
        title="Confirm Logout"
        open={logoutModal}
        onOk={handleLogout}
        onCancel={() => setLogoutModal(false)}
        okText="Logout"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </Layout>
  );
}
