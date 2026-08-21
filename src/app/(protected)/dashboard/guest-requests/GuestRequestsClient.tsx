'use client';

import { useMemo, useState } from 'react';
import { Modal, Input, message } from 'antd';
import {
    Users,
    UserCheck,
    Clock,
    ShieldAlert,
    RefreshCw,
    Search,
    Inbox,
    AlertTriangle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import RequestCard, { type GuestRequestRow } from './components/RequestCard';
import ActiveGuestCard, { type ActiveGuestRow } from './components/ActiveGuestCard';
import GuestDetailDrawer from './components/GuestDetailDrawer';

const STATUS_PILLS = [
    { value: undefined, label: 'All' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'REVOKED', label: 'Revoked' },
];

export default function GuestAccessClient({
    initialRequests,
    initialActiveGuests,
}: {
    initialRequests: GuestRequestRow[];
    initialActiveGuests: ActiveGuestRow[];
}) {
    const [tab, setTab] = useState<'requests' | 'active'>('requests');
    const [requests, setRequests] = useState<GuestRequestRow[]>(initialRequests);
    const [activeGuests, setActiveGuests] = useState<ActiveGuestRow[]>(initialActiveGuests);
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const [rejectTarget, setRejectTarget] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
    const [detailId, setDetailId] = useState<string | null>(null);

    async function fetchRequests(status?: string) {
        const params = status ? `?status=${status}` : '';
        const res = await clientFetch(`/api/guest-requests/list${params}`, { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.guestRequests) {
            setRequests(json.guestRequests);
        }
    }

    async function fetchActiveGuests() {
        const res = await clientFetch('/api/guest-requests/active-guests', { cache: 'no-store' });
        const json = await res.json();
        if (res.ok && json.activeGuests) {
            setActiveGuests(json.activeGuests);
        }
    }

    async function refreshAll() {
        setRefreshing(true);
        try {
            await Promise.all([fetchRequests(statusFilter), fetchActiveGuests()]);
        } finally {
            setRefreshing(false);
        }
    }

    async function handleStatusFilter(value?: string) {
        setStatusFilter(value);
        setRefreshing(true);
        try {
            await fetchRequests(value);
        } finally {
            setRefreshing(false);
        }
    }

    async function handleApprove(id: string) {
        setActionLoadingId(id);
        try {
            const res = await clientFetch('/api/guest-requests/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (!res.ok) {
                message.error(json.error || 'Failed to approve request');
                return;
            }
            message.success('Guest access approved');
            await refreshAll();
        } finally {
            setActionLoadingId(null);
        }
    }

    async function submitReject() {
        if (!rejectTarget) return;
        if (!rejectReason.trim()) {
            message.error('A reason is required to reject');
            return;
        }
        setActionLoadingId(rejectTarget);
        try {
            const res = await clientFetch('/api/guest-requests/reject', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: rejectTarget, rejectionReason: rejectReason.trim() }),
            });
            const json = await res.json();
            if (!res.ok) {
                message.error(json.error || 'Failed to reject request');
                return;
            }
            message.success('Request rejected');
            setRejectTarget(null);
            setRejectReason('');
            await refreshAll();
        } finally {
            setActionLoadingId(null);
        }
    }

    async function submitRevoke() {
        if (!revokeTarget) return;
        setActionLoadingId(revokeTarget);
        try {
            const res = await clientFetch('/api/guest-requests/revoke', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: revokeTarget }),
            });
            const json = await res.json();
            if (!res.ok) {
                message.error(json.error || 'Failed to revoke access');
                return;
            }
            message.success('Guest access revoked');
            setRevokeTarget(null);
            await refreshAll();
        } finally {
            setActionLoadingId(null);
        }
    }

    async function handleRestore(id: string) {
        setActionLoadingId(id);
        try {
            const res = await clientFetch('/api/guest-requests/restore', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (!res.ok) {
                message.error(json.error || 'Failed to restore guest access');
                return;
            }
            message.success('Guest access restored');
            await refreshAll();
        } finally {
            setActionLoadingId(null);
        }
    }

    const filteredRequests = useMemo(() => {
        if (!search.trim()) return requests;
        const q = search.trim().toLowerCase();
        return requests.filter((r) => {
            const guest = r.guest;
            const name = `${guest?.firstName ?? ''} ${guest?.lastName ?? ''}`.toLowerCase();
            return name.includes(q) || guest?.email?.toLowerCase().includes(q);
        });
    }, [requests, search]);

    const filteredActiveGuests = useMemo(() => {
        if (!search.trim()) return activeGuests;
        const q = search.trim().toLowerCase();
        return activeGuests.filter((a) => {
            const guest = a.guest;
            const name = `${guest?.firstName ?? ''} ${guest?.lastName ?? ''}`.toLowerCase();
            return name.includes(q) || guest?.email?.toLowerCase().includes(q);
        });
    }, [activeGuests, search]);

    const stats = useMemo(() => {
        const pending = requests.filter((r) => r.status === 'PENDING').length;
        const now = Date.now();
        const expiringSoon = activeGuests.filter((a) => {
            if (!a.expiresAt) return false;
            const diff = new Date(a.expiresAt).getTime() - now;
            return diff > 0 && diff <= 60 * 60 * 1000;
        }).length;

        return {
            total: requests.length,
            pending,
            active: activeGuests.length,
            expiringSoon,
        };
    }, [requests, activeGuests]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
                            <ShieldAlert size={13} />
                            Guest access
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight !text-slate-900 sm:text-3xl">
                            Guest access requests
                        </h1>
                        <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-slate-500">
                            Review demo access requests, approve or reject them, and manage active guest sessions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={refreshAll}
                        disabled={refreshing}
                        className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl border !border-slate-200 !bg-white px-3.5 py-2 text-xs font-bold !text-slate-600 shadow-sm transition hover:!bg-slate-50 disabled:opacity-60 sm:self-auto"
                    >
                        <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard icon={Users} label="Total requests" value={stats.total} tone="slate" />
                    <StatCard
                        icon={Clock}
                        label="Pending review"
                        value={stats.pending}
                        tone={stats.pending > 0 ? 'amber' : 'slate'}
                        pulse={stats.pending > 0}
                    />
                    <StatCard icon={UserCheck} label="Active guests" value={stats.active} tone="emerald" />
                    <StatCard
                        icon={AlertTriangle}
                        label="Expiring < 1hr"
                        value={stats.expiringSoon}
                        tone={stats.expiringSoon > 0 ? 'red' : 'slate'}
                        pulse={stats.expiringSoon > 0}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2 border-b !border-slate-200 pb-px">
                    <TabButton active={tab === 'requests'} onClick={() => setTab('requests')}>
                        Requests
                    </TabButton>
                    <TabButton active={tab === 'active'} onClick={() => setTab('active')}>
                        Active guests {stats.active > 0 && `(${stats.active})`}
                    </TabButton>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {tab === 'requests' ? (
                        <div className="flex flex-wrap gap-1.5">
                            {STATUS_PILLS.map((pill) => (
                                <button
                                    key={pill.label}
                                    type="button"
                                    onClick={() => handleStatusFilter(pill.value)}
                                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${statusFilter === pill.value
                                        ? '!bg-slate-900 !text-white'
                                        : 'border !border-slate-200 !bg-white !text-slate-500 hover:!bg-slate-50'
                                        }`}
                                >
                                    {pill.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div />
                    )}

                    <div className="relative w-full sm:w-64">
                        <Search size={13} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 !text-slate-400" />
                        <Input
                            placeholder="Search by name or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="!pl-8"
                        />
                    </div>
                </div>

                <div className={`space-y-3 transition-opacity ${refreshing ? 'opacity-60' : 'opacity-100'}`}>
                    {tab === 'requests' ? (
                        filteredRequests.length === 0 ? (
                            <EmptyState
                                text={search ? 'No requests match your search' : 'No guest requests yet'}
                            />
                        ) : (
                            filteredRequests.map((r) => (
                                <RequestCard
                                    key={r.id}
                                    request={r}
                                    actionLoading={actionLoadingId === r.id}
                                    onApprove={handleApprove}
                                    onReject={(id) => setRejectTarget(id)}
                                    onRevoke={(id) => setRevokeTarget(id)}
                                    onRestore={handleRestore}
                                    onViewDetail={(id) => setDetailId(id)}
                                />
                            ))
                        )
                    ) : filteredActiveGuests.length === 0 ? (
                        <EmptyState text={search ? 'No active guests match your search' : 'No active guests right now'} />
                    ) : (
                        filteredActiveGuests.map((a) => (
                            <ActiveGuestCard
                                key={a.requestId}
                                entry={a}
                                actionLoading={actionLoadingId === a.requestId}
                                onRevoke={(id) => setRevokeTarget(id)}
                            />
                        ))
                    )}
                </div>
            </div>

            <Modal
                title="Reject guest request"
                open={!!rejectTarget}
                onCancel={() => {
                    setRejectTarget(null);
                    setRejectReason('');
                }}
                onOk={submitReject}
                okText="Reject"
                okButtonProps={{ danger: true }}
            >
                <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
                    Reason
                </label>
                <Input.TextArea
                    rows={2}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Why is this request being rejected?"
                />
            </Modal>

            <Modal
                title="Revoke guest access"
                open={!!revokeTarget}
                onCancel={() => setRevokeTarget(null)}
                onOk={submitRevoke}
                okText="Revoke access"
                okButtonProps={{ danger: true }}
            >
                <div className="flex items-start gap-2.5 rounded-lg border !border-red-200 !bg-red-50 px-3.5 py-3">
                    <AlertTriangle size={15} className="mt-0.5 shrink-0 !text-red-600" />
                    <p className="text-xs !text-red-800">
                        This immediately ends the guest&apos;s session — their next request will be rejected, even
                        with a valid token.
                    </p>
                </div>
            </Modal>

            <GuestDetailDrawer requestId={detailId} onClose={() => setDetailId(null)} />
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`relative -mb-px px-1 pb-3 text-sm font-bold transition ${active ? '!text-slate-900' : '!text-slate-400 hover:!text-slate-600'
                }`}
        >
            {children}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full !bg-slate-900" />}
        </button>
    );
}

function StatCard({
    icon: Icon,
    label,
    value,
    tone,
    pulse,
}: {
    icon: typeof Users;
    label: string;
    value: number;
    tone: 'slate' | 'amber' | 'emerald' | 'red';
    pulse?: boolean;
}) {
    const toneClasses: Record<string, string> = {
        slate: '!bg-slate-100 !text-slate-600',
        amber: '!bg-amber-100 !text-amber-700',
        emerald: '!bg-emerald-100 !text-emerald-700',
        red: '!bg-red-100 !text-red-700',
    };

    return (
        <div className="relative overflow-hidden rounded-2xl border !border-slate-200/70 !bg-white/90 p-4 shadow-sm">
            {pulse && (
                <span className="absolute right-3 top-3 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full !bg-red-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full !bg-red-500" />
                </span>
            )}
            <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
                <Icon size={16} />
            </div>
            <p className="text-2xl font-bold !text-slate-900">{value}</p>
            <p className="text-xs font-medium !text-slate-500">{label}</p>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
            <Inbox size={32} className="!text-slate-300" />
            <h3 className="mt-4 text-base font-bold !text-slate-700">{text}</h3>
        </div>
    );
}