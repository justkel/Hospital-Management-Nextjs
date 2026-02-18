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
  SolutionOutlined,
} from '@ant-design/icons';
import { useUserRoles } from '@/lib/auth/useUserRoles';
import { Roles } from '@/shared/utils/enums/roles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
          isOpen ? 'rotate-45 translate-y-2' : 'w-6'
        }`}
      />
      <span
        className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${
          isOpen ? 'opacity-0' : 'w-5'
        }`}
      />
      <span
        className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${
          isOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-4'
        }`}
      />
    </button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const pathname = usePathname();

  const selectedKey = (() => {
    if (pathname.startsWith('/admins/staff')) return 'staff';
    if (pathname.startsWith('/dashboard/patients')) return 'patients';
    if (pathname.startsWith('/dashboard/visits')) return 'visits';
    if (pathname.startsWith('/records')) return 'records';
    if (pathname.startsWith('/settings')) return 'settings';
    if (pathname.startsWith('/audit')) return 'audit';
    if (pathname.startsWith('/dashboard')) return 'dashboard';
    return '';
  })();

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
    { key: 'patients', icon: <MedicineBoxOutlined />, label: <Link href="/dashboard/patients">Patients</Link> },
    { key: 'records', icon: <FileTextOutlined />, label: 'Medical Records' },
    { key: 'visits', icon: <SolutionOutlined />, label: <Link href="/dashboard/visits">Visits</Link> },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    ...(roles.includes(Roles.ADMIN) ? [{ key: 'audit', icon: <FileSearchOutlined />, label: 'Audit Logs' }] : []),
  ];

  return (
    <Layout style={{ minHeight: '100vh', position: 'relative' }}>
      <Sider
        collapsible
        collapsed={!menuOpen}
        trigger={null}
        width={260}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '0 24px',
            gap: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          <Avatar shape="square" size={40} style={{ background: '#1677ff' }}>H</Avatar>
          <span>Hospital Staff</span>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={menuItems}
        />

        <div style={{ position: 'absolute', bottom: 24, width: '100%', textAlign: 'center' }}>
          <button
            className="flex items-center justify-center text-red-600 w-full"
            onClick={() => setLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </Sider>

      <Layout>
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
            <Hamburger isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)} />
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
          }}
        >
          {children}
        </Content>
      </Layout>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        />
      )}

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
