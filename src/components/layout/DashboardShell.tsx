'use client';

import { ReactNode, useState, useEffect } from 'react';
import { Avatar, Dropdown, Modal } from 'antd';
import {
    DashboardOutlined, TeamOutlined, FileTextOutlined,
    SettingOutlined, LogoutOutlined, UserOutlined,
    MedicineBoxOutlined, FileSearchOutlined, SolutionOutlined,
    CreditCardOutlined, ExperimentOutlined, ApartmentOutlined,
    ArrowLeftOutlined, NodeIndexOutlined, BellOutlined,
} from '@ant-design/icons';
import { ShieldCheck, Theater } from 'lucide-react';
import { Roles } from '@/shared/utils/enums/roles';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
function Hamburger({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) {
    return (
        <button
            onClick={toggle}
            aria-label="Toggle menu"
            className="flex flex-col gap-[4.5px] cursor-pointer rounded-lg p-1.5 transition hover:bg-[#F7F7F5]"
        >
            <span className="block h-[1.5px] w-[18px] rounded bg-[#5F5E5A] transition-all duration-200" />
            <span className={`block h-[1.5px] rounded bg-[#5F5E5A] transition-all duration-200 ${isOpen ? 'w-[18px]' : 'w-[14px]'}`} />
            <span className={`block h-[1.5px] rounded bg-[#5F5E5A] transition-all duration-200 ${isOpen ? 'w-[18px]' : 'w-[10px]'}`} />
        </button>
    );
}

function NavItem({
    icon, label, href, active, badge, onClick,
}: {
    icon: React.ReactNode; label: React.ReactNode;
    href?: string; active?: boolean; badge?: number; onClick?: () => void;
}) {
    const base =
        'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer';
    const cls = active
        ? `${base} bg-[#F0FAF5] text-[#1D9E75]`
        : `${base} text-[#5F5E5A] hover:bg-[#F7F7F5] hover:text-[#2C2C2A]`;

    const inner = (
        <>
            <span className={`text-base w-5 text-center flex-shrink-0 ${active ? 'text-[#1D9E75]' : 'text-[#B4B2A9]'}`}>
                {icon}
            </span>
            <span className="flex-1 min-w-0 truncate">{label}</span>
            {badge !== undefined && (
                <span className="ml-auto rounded-full bg-[#1D9E75] px-1.5 py-px text-[10px] font-semibold text-white leading-tight">
                    {badge}
                </span>
            )}
        </>
    );

    return href ? (
        <Link href={href} className={cls} onClick={onClick}>{inner}</Link>
    ) : (
        <div className={cls} onClick={onClick}>{inner}</div>
    );
}

function NavSection({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="mb-1">
            <p className="px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#B4B2A9]">
                {label}
            </p>
            {children}
        </div>
    );
}

export default function DashboardShell({
    children,
    roles = [] as Roles[],
}: {
    children: ReactNode;
    roles?: Roles[];
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const hasClinicalAccess =
        roles.includes(Roles.ADMIN) || roles.includes(Roles.DOCTOR) || roles.includes(Roles.NURSE);
    const hasWardAccess =
        roles.includes(Roles.ADMIN) || roles.includes(Roles.NURSE);

    const selectedKey = (() => {
        if (pathname.startsWith('/admins/staff')) return 'staff';
        if (pathname.startsWith('/dashboard/patients')) return 'patients';
        if (pathname.startsWith('/dashboard/visits')) return 'visits';
        if (pathname.startsWith('/dashboard/visit-procedures')) return 'visit-procedures';
        if (pathname.startsWith('/dashboard/wards')) return 'wards';
        if (pathname.startsWith('/dashboard/lab-requests')) return 'lab-requests';
        if (pathname.startsWith('/dashboard/theatres')) return 'theatres';
        if (pathname.startsWith('/dashboard/audit')) return 'audit';
        if (pathname.startsWith('/records')) return 'records';
        if (pathname.startsWith('/admins/billing/global')) return 'billing-global';
        if (pathname.startsWith('/admins/billing/organization')) return 'billing-organization';
        if (pathname.startsWith('/settings')) return 'settings';
        if (pathname.startsWith('/dashboard')) return 'dashboard';
        return '';
    })();

    const defaultOpenKeys = selectedKey?.startsWith('billing') ? ['billing'] : [];
    const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys);

    useEffect(() => {
        setOpenKeys(menuOpen ? defaultOpenKeys : []);
    }, [menuOpen, selectedKey]);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
            const json = await res.json();
            if (json.success) window.location.href = '/login';
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    const close = () => setMenuOpen(false);

    const userMenuItems = [
        { key: 'profile', icon: <UserOutlined />, label: <Link href="/dashboard/profile">Profile</Link> },
        { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
        { type: 'divider' as const },
        { key: 'logout', icon: <LogoutOutlined />, label: 'Sign out', danger: true, onClick: () => setLogoutModal(true) },
    ];

    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-[#F7F7F5]">

            <header className="relative z-50 flex h-[52px] flex-shrink-0 items-center justify-between border-b border-[#E8E6E0] bg-white px-4">
                <div className="flex items-center gap-2">
                    <Hamburger isOpen={menuOpen} toggle={() => setMenuOpen(v => !v)} />

                    {pathname !== '/dashboard' && (
                        <button
                            onClick={() => router.back()}
                            aria-label="Go back"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E6E0] bg-white text-[#5F5E5A] transition hover:bg-[#F7F7F5]"
                        >
                            <ArrowLeftOutlined style={{ fontSize: 13 }} />
                        </button>
                    )}

                    <span className="hidden text-[14px] font-medium tracking-[-0.01em] text-[#2C2C2A] sm:block">
                        Dashboard
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        aria-label="Notifications"
                        className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8E6E0] bg-white text-[#5F5E5A] transition hover:bg-[#F7F7F5]"
                    >
                        <BellOutlined style={{ fontSize: 14 }} />
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#1D9E75] ring-[1.5px] ring-white" />
                    </button>

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
                        <button
                            aria-label="User menu"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0c1a12] text-[12px] font-medium !text-[#5DCAA5] transition hover:opacity-80"
                        >
                            <Avatar icon={<UserOutlined />} />
                        </button>
                    </Dropdown>
                </div>
            </header>

            <div className="relative flex flex-1 overflow-hidden">

                <aside
                    className={`
            absolute inset-y-0 left-0 z-40 flex w-[240px] flex-col
            border-r border-[#E8E6E0] bg-white
            transition-transform duration-300 ease-in-out
            ${menuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
                >
                    <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-[#E8E6E0] px-4 py-3.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[#0c1a12]">
                            <ShieldCheck size={15} className="text-[#5DCAA5]" />
                        </div>
                        <div>
                            <p className="text-[13px] font-medium leading-none text-[#2C2C2A]">HMS Pro</p>
                            <p className="mt-0.5 text-[11px] text-[#B4B2A9]">Clinical platform</p>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-2 py-2.5 scrollbar-hide" aria-label="Main navigation">

                        <NavSection label="Overview">
                            <NavItem icon={<DashboardOutlined />} label="Dashboard"
                                href="/dashboard" active={selectedKey === 'dashboard'} onClick={close} />
                        </NavSection>

                        {hasClinicalAccess && (
                            <NavSection label="Clinical">
                                <NavItem icon={<MedicineBoxOutlined />} label="Patients"
                                    href="/dashboard/patients" active={selectedKey === 'patients'} onClick={close} />
                                <NavItem icon={<SolutionOutlined />} label="Visits"
                                    href="/dashboard/visits" active={selectedKey === 'visits'} onClick={close} />
                                <NavItem icon={<NodeIndexOutlined />} label="Procedures"
                                    href="/dashboard/visit-procedures" active={selectedKey === 'visit-procedures'} onClick={close} />
                                <NavItem icon={<ExperimentOutlined />} label="Lab Requests"
                                    href="/dashboard/lab-requests" active={selectedKey === 'lab-requests'} onClick={close} />
                                {hasWardAccess && (
                                    <NavItem icon={<ApartmentOutlined />} label="Wards"
                                        href="/dashboard/wards" active={selectedKey === 'wards'} onClick={close} />
                                )}
                                <NavItem
                                    icon={<Theater size={15} />}
                                    label="Theatres"
                                    href="/dashboard/theatres"
                                    active={selectedKey === 'theatres'}
                                    onClick={close}
                                />
                            </NavSection>
                        )}

                        {roles.includes(Roles.ADMIN) && (
                            <NavSection label="Admin">
                                <NavItem icon={<TeamOutlined />} label="Staff"
                                    href="/admins/staff" active={selectedKey === 'staff'} onClick={close} />

                                <NavItem icon={<CreditCardOutlined />} label="Billing" />
                                <div className="ml-3 mt-0.5 border-l border-[#E8E6E0] pl-3">
                                    <NavItem icon={<span className="h-1 w-1 rounded-full bg-[#D3D1C7]" />} label="Global"
                                        href="/admins/billing/global" active={selectedKey === 'billing-global'} onClick={close} />
                                    <NavItem icon={<span className="h-1 w-1 rounded-full bg-[#D3D1C7]" />} label="Organization"
                                        href="/admins/billing/organization" active={selectedKey === 'billing-organization'} onClick={close} />
                                </div>

                                <NavItem icon={<FileSearchOutlined />} label="Audits"
                                    href="/dashboard/audit" active={selectedKey === 'audit'} onClick={close} />
                            </NavSection>
                        )}

                        <NavSection label="System">
                            <NavItem icon={<FileTextOutlined />} label="Medical Records"
                                active={selectedKey === 'records'} onClick={close} />
                            <NavItem icon={<SettingOutlined />} label="Settings"
                                href="/settings" active={selectedKey === 'settings'} onClick={close} />
                        </NavSection>
                    </nav>

                    <div className="flex-shrink-0 border-t border-[#E8E6E0] p-2">
                        <button
                            onClick={() => setLogoutModal(true)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#888780] transition hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                        >
                            <LogoutOutlined style={{ fontSize: 15 }} />
                            Sign out
                        </button>
                    </div>
                </aside>

                {menuOpen && (
                    <div
                        onClick={() => setMenuOpen(false)}
                        className="absolute inset-0 z-30 bg-[#0c1a12]/30 backdrop-blur-[2px]"
                    />
                )}

                <main className="flex-1 overflow-auto p-3 sm:p-4">
                    <div className="min-h-full rounded-xl border border-[#E8E6E0] bg-white p-4 sm:p-6">
                        {children}
                    </div>
                </main>
            </div>

            <Modal
                title="Confirm sign out"
                open={logoutModal}
                onOk={handleLogout}
                onCancel={() => setLogoutModal(false)}
                okText="Sign out"
                okButtonProps={{ danger: true }}
            >
                <p>Are you sure you want to sign out of your clinical workspace?</p>
            </Modal>
        </div>
    );
}