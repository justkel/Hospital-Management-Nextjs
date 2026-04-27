'use client';

import { ReactNode, useState, useEffect } from 'react';
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
    CreditCardOutlined,
    ExperimentOutlined,
    ArrowLeftOutlined,
} from '@ant-design/icons';
import { Roles } from '@/shared/utils/enums/roles';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
                className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : 'w-6'
                    }`}
            />
            <span
                className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-5'
                    }`}
            />
            <span
                className={`block h-0.5 rounded bg-gray-800 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2 w-6' : 'w-4'
                    }`}
            />
        </button>
    );
}

export default function DashboardShell({
    children,
    roles = [],
}: {
    children: ReactNode;
    roles?: string[];
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include',
            });
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
        if (pathname.startsWith('/admins/billing/global')) return 'billing-global';
        if (pathname.startsWith('/admins/billing/organization')) return 'billing-organization';
        if (pathname.startsWith('/settings')) return 'settings';
        if (pathname.startsWith('/audit')) return 'audit';
        if (pathname.startsWith('/dashboard')) return 'dashboard';
        return '';
    })();

    const defaultOpenKeys =
        selectedKey?.startsWith('billing') ? ['billing'] : [];

    const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

    useEffect(() => {
        if (menuOpen) {
            setOpenKeys(defaultOpenKeys);
        } else {
            setOpenKeys([]);
        }
    }, [menuOpen, selectedKey]);

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
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link href="/dashboard">Dashboard</Link>,
        },
        ...(roles.includes(Roles.ADMIN)
            ? [
                {
                    key: 'staff',
                    icon: <TeamOutlined />,
                    label: <Link href="/admins/staff">Staff</Link>,
                },
            ]
            : []),
        {
            key: 'patients',
            icon: <MedicineBoxOutlined />,
            label: <Link href="/dashboard/patients">Patients</Link>,
        },
        {
            key: 'records',
            icon: <FileTextOutlined />,
            label: 'Medical Records',
        },
        {
            key: 'visits',
            icon: <SolutionOutlined />,
            label: <Link href="/dashboard/visits">Visits</Link>,
        },
        {
            key: 'lab-requests',
            icon: <ExperimentOutlined />,
            label: <Link href="/dashboard/lab-requests">Lab Requests</Link>,
        },
        ...(roles.includes(Roles.ADMIN)
            ? [
                {
                    key: 'billing',
                    icon: <CreditCardOutlined />,
                    label: 'Billing',
                    children: [
                        {
                            key: 'billing-global',
                            label: <Link href="/admins/billing/global">Global</Link>,
                        },
                        {
                            key: 'billing-organization',
                            label: (
                                <Link href="/admins/billing/organization">
                                    Organization
                                </Link>
                            ),
                        },
                    ],
                },
            ]
            : []),
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
        },
        ...(roles.includes(Roles.ADMIN)
            ? [
                {
                    key: 'audit',
                    icon: <FileSearchOutlined />,
                    label: <Link href="/dashboard/audit">Audits</Link>,
                },
            ]
            : []),
    ];

    return (
        <Layout style={{ minHeight: '100vh', position: 'relative' }}>
            <Sider
                collapsible
                collapsed={!menuOpen}
                trigger={null}
                width={260}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    height: '100vh',
                    zIndex: 100,
                    background: '#fff',
                    borderRight: '1px solid #f0f0f0',
                    transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div
                    style={{
                        height: 64,
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 24px',
                        gap: 12,
                        fontWeight: 700,
                        fontSize: 18,
                        borderBottom: '1px solid #f0f0f0',
                        flexShrink: 0,
                    }}
                >
                    <Avatar shape="square" size={40} style={{ background: '#1677ff' }}>
                        H
                    </Avatar>
                    {menuOpen && <span>Hospital Staff</span>}
                </div>

                <div
                    style={{
                        flex: 1,
                        overflowY: 'auto',
                        paddingBottom: 16,
                    }}
                    className="scrollbar-hide"
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedKey]}
                        openKeys={openKeys}
                        onOpenChange={(keys) => setOpenKeys(keys)}
                        onClick={({ key, keyPath }) => {
                            const isLeaf =
                                keyPath.length > 1 ||
                                !menuItems.some(item => item.key === key && 'children' in item);

                            if (isLeaf) {
                                setMenuOpen(false);
                            }
                        }}
                        style={{ borderRight: 0 }}
                        items={menuItems}
                    />
                </div>

                <div
                    style={{
                        padding: '12px 16px',
                        marginTop: '220px',
                        borderTop: '1px solid #f0f0f0',
                        flexShrink: 0,
                    }}
                >
                    <button
                        className="flex items-center justify-center gap-2 text-red-600 w-full py-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                        onClick={() => setLogoutModal(true)}
                    >
                        <LogoutOutlined />
                        {menuOpen && <span>Logout</span>}
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
                        <Hamburger
                            isOpen={menuOpen}
                            toggle={() => setMenuOpen(!menuOpen)}
                        />

                        {pathname !== '/dashboard' && (
                            <button
                                onClick={() => router.back()}
                                className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 hover:bg-gray-100 transition cursor-pointer"
                                aria-label="Go back"
                            >
                                <ArrowLeftOutlined />
                            </button>
                        )}

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