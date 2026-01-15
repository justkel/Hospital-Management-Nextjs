'use client';

import { ReactNode, useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Modal } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useUserRoles } from '@/lib/auth/useUserRoles';
import { Roles } from '@/shared/utils/enums/roles';
import Link from 'next/link';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

function Hamburger({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
  return (
    <button
      onClick={toggle}
      className="flex flex-col justify-between w-8 h-6 cursor-pointer"
      aria-label="Toggle Menu"
    >
      <span
        className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${
          isOpen ? 'rotate-0 translate-y-3' : 'w-6'
        }`}
      />
      <span
        className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'w-5'
        }`}
      />
      <span
        className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${
          isOpen ? '-rotate-90 -translate-y-2 w-6' : 'w-4'
        }`}
      />
    </button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  const userRoles = useUserRoles();
  const roles = userRoles.roles;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      const json = await res.json();
      if (json.success) window.location.href = '/login';
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
        { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true, onClick: () => setLogoutModal(true) },
      ]}
    />
  );

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link href="/dashboard">Dashboard</Link> },
    ...(roles.includes(Roles.ADMIN) ? [{ key: 'staff', icon: <TeamOutlined />, label: <Link href="/admins/staff">Staff</Link> }] : []),
    { key: 'patients', icon: <MedicineBoxOutlined />, label: 'Patients' },
    { key: 'records', icon: <FileTextOutlined />, label: 'Medical Records' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    ...(roles.includes(Roles.ADMIN) ? [{ key: 'audit', icon: <FileSearchOutlined />, label: 'Audit Logs' }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={260}
        breakpoint="md"
        collapsedWidth={0}
        onCollapse={setCollapsed}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          zIndex: 100,
        }}
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

        <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center' }}>
          <button
            className="flex items-center justify-center text-red-600 w-full"
            onClick={() => setLogoutModal(true)}
          >
            {!collapsed ? 'Logout' : <LogoutOutlined />}
          </button>
        </div>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 0 : 260, transition: 'margin-left 0.3s' }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            padding: '0 24px',
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Space size="middle">
            <Hamburger
              isOpen={!collapsed}
              toggle={() => setCollapsed(!collapsed)}
            />
            <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>
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
            margin: 12,
            padding: 24,
            background: '#fff',
            borderRadius: 12,
            minHeight: 'calc(100vh - 112px)',
            transition: 'margin-left 0.3s',
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
