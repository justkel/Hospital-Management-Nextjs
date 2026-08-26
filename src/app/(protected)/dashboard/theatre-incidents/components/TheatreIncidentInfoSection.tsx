'use client';

import {
    AlertTriangle,
    ShieldAlert,
    Clock3,
    ClipboardList,
    FileText,
    Activity,
    User2,
    BadgeCheck,
    Pencil,
    Building2,
    ShieldCheck,
    CalendarClock,
} from 'lucide-react';

import { useState } from 'react';

import UpdateTheatreIncidentDrawer from './UpdateTheatreIncidentDrawer';

import { GetTheatreIncidentByIdQuery } from '@/shared/graphql/generated/graphql';

import { formatDateTime } from '@/utils/formatDateTime';

type Incident = GetTheatreIncidentByIdQuery['theatreIncidentById'];

const SEVERITY_CONFIG: Record<string, {
    label: string;
    badge: string;
    accent: string;
    iconBg: string;
    iconColor: string;
}> = {
    LOW: {
        label: 'Low',
        badge: '!bg-[#ECFBF5] !text-[#1D9E75]',
        accent: '!bg-[#1D9E75]',
        iconBg: '!bg-[#ECFBF5]',
        iconColor: '!text-[#1D9E75]',
    },
    MEDIUM: {
        label: 'Medium',
        badge: '!bg-[#FFF8EC] !text-[#B9770E]',
        accent: '!bg-[#D08A2E]',
        iconBg: '!bg-[#FFF8EC]',
        iconColor: '!text-[#B9770E]',
    },
    HIGH: {
        label: 'High',
        badge: '!bg-[#FFF1E9] !text-[#C2571C]',
        accent: '!bg-[#EA6C2E]',
        iconBg: '!bg-[#FFF1E9]',
        iconColor: '!text-[#C2571C]',
    },
    CRITICAL: {
        label: 'Critical',
        badge: '!bg-[#FEF2F2] !text-[#DC2626]',
        accent: '!bg-[#DC2626]',
        iconBg: '!bg-[#FEF2F2]',
        iconColor: '!text-[#DC2626]',
    },
};

const STATUS_CONFIG: Record<string, {
    badge: string;
    dot: string;
    icon: React.ElementType;
}> = {
    ACTIVE: {
        badge: '!bg-[#EFF5FF] !text-[#1D6FE0]',
        dot: '!bg-[#1D6FE0]',
        icon: ShieldAlert,
    },
    RESOLVED: {
        badge: '!bg-[#ECFBF5] !text-[#1D9E75]',
        dot: '!bg-[#1D9E75]',
        icon: ShieldCheck,
    },
    ESCALATED: {
        badge: '!bg-[#FEF2F2] !text-[#DC2626]',
        dot: '!bg-[#DC2626]',
        icon: Activity,
    },
};

export default function TheatreIncidentInfoSection({
    incident,
}: {
    incident: Incident;
}) {
    const [editOpen, setEditOpen] = useState(false);

    const sev = SEVERITY_CONFIG[incident.severity] ?? SEVERITY_CONFIG.LOW;
    const stat = STATUS_CONFIG[incident.status] ?? STATUS_CONFIG.ACTIVE;
    const StatusIcon = stat.icon;

    return (
        <div className="mx-auto max-w-5xl space-y-5 py-2">
            <div className="relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="p-6 pl-7 sm:p-8 sm:pl-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="space-y-3.5">
                            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] !text-[#B4B2A9]">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{incident.theatre?.name ?? 'Theatre'}</span>
                                <span className="!text-[#D3D1C7]">/</span>
                                <span>Incident report</span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight !text-[#16211B] sm:text-[28px]">
                                    {incident.type.replace(/_/g, ' ')}
                                </h1>
                                <p className="mt-1.5 text-sm !text-[#767570]">
                                    Surgical safety and operational incident documentation
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${sev.badge}`}>
                                    <AlertTriangle className="h-3 w-3" />
                                    {sev.label} severity
                                </span>

                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stat.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                                    {incident.status.replace(/_/g, ' ')}
                                </span>

                                {incident.reportedAt && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full !bg-[#F7F7F5] px-3 py-1 text-xs font-medium !text-[#767570]">
                                        <Clock3 className="h-3 w-3" />
                                        {formatDateTime(incident.reportedAt)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setEditOpen(true)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-xl !bg-[#0c1a12] px-4 py-2.5 text-sm font-semibold !text-white transition hover:!bg-[#16211B]"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit incident
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile
                    label="Severity"
                    value={sev.label}
                    icon={<ShieldAlert className="h-4 w-4" />}
                    iconBg={sev.iconBg}
                    iconColor={sev.iconColor}
                />
                <StatTile
                    label="Status"
                    value={incident.status.replace(/_/g, ' ')}
                    icon={<StatusIcon className="h-4 w-4" />}
                    iconBg={stat.badge.split(' ')[0]}
                    iconColor={stat.badge.split(' ')[1]}
                />
                <StatTile
                    label="Reported by"
                    value={incident.reportedBy?.userCode ?? '—'}
                    icon={<BadgeCheck className="h-4 w-4" />}
                    iconBg="!bg-[#F7F7F5]"
                    iconColor="!text-[#767570]"
                />
                <StatTile
                    label="Theatre"
                    value={incident.theatre?.name ?? '—'}
                    icon={<Building2 className="h-4 w-4" />}
                    iconBg="!bg-[#F7F7F5]"
                    iconColor="!text-[#767570]"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                <DetailCard
                    title="Reporter"
                    icon={<User2 className="h-4 w-4" />}
                >
                    <div className="flex items-center gap-4 p-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl !bg-[#EFF5FF] !text-[#1D6FE0]">
                            <User2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-semibold !text-[#16211B]">
                                {incident.reportedBy?.fullName ?? '—'}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                                {incident.reportedBy?.userCode ?? ''}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y !divide-[#E8E6E0] border-t !border-[#E8E6E0]">
                        <FieldRow
                            icon={<ClipboardList className="h-3.5 w-3.5" />}
                            label="Type"
                            value={incident.type.replace(/_/g, ' ')}
                        />
                        <FieldRow
                            icon={<Building2 className="h-3.5 w-3.5" />}
                            label="Theatre"
                            value={incident.theatre?.name}
                        />
                    </div>
                </DetailCard>

                <DetailCard
                    title="Timeline"
                    icon={<CalendarClock className="h-4 w-4" />}
                >
                    <div className="space-y-4 p-5">
                        <TimelineItem
                            label="Reported at"
                            value={incident.reportedAt ? formatDateTime(incident.reportedAt) : null}
                            dot="!bg-[#DC2626]"
                            isFirst
                        />
                        <TimelineItem
                            label="Resolved at"
                            value={incident.resolvedAt ? formatDateTime(incident.resolvedAt) : null}
                            dot="!bg-[#1D9E75]"
                        />
                    </div>
                </DetailCard>
            </div>

            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="flex items-center gap-2.5 border-b !border-[#E8E6E0] !bg-[#FAFAF8] px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-[#F7F7F5] !text-[#767570]">
                        <FileText className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold !text-[#16211B]">
                        Surgical notes
                    </h2>
                </div>

                <div className="p-6">
                    {incident.notes ? (
                        <p className="whitespace-pre-wrap text-sm leading-7 !text-[#5F5E5A]">
                            {incident.notes}
                        </p>
                    ) : (
                        <div className="flex items-center gap-3 rounded-xl border border-dashed !border-[#E8E6E0] !bg-[#FAFAF8] px-5 py-6 text-sm !text-[#B4B2A9]">
                            <FileText className="h-4 w-4 shrink-0" />
                            No surgical notes recorded for this incident.
                        </div>
                    )}
                </div>
            </div>

            <DetailCard
                title="System metadata"
                icon={<Activity className="h-4 w-4" />}
            >
                <div className="divide-y !divide-[#E8E6E0]">
                    <FieldRow
                        icon={<Activity className="h-3.5 w-3.5" />}
                        label="Status flow"
                        value={incident.status.replace(/_/g, ' ')}
                    />
                    <FieldRow
                        icon={<ShieldAlert className="h-3.5 w-3.5" />}
                        label="Severity level"
                        value={incident.severity}
                    />
                </div>
            </DetailCard>

            <UpdateTheatreIncidentDrawer
                open={editOpen}
                incident={incident}
                onClose={() => setEditOpen(false)}
                onUpdated={() => {
                    setEditOpen(false);
                    window.location.reload();
                }}
            />
        </div>
    );
}

function StatTile({
    label,
    value,
    icon,
    iconBg,
    iconColor,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}) {
    return (
        <div className="rounded-xl border !border-[#E8E6E0] !bg-white p-4">
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
                {icon}
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">{label}</p>
            <p className="mt-1 truncate text-sm font-semibold leading-snug !text-[#16211B]">{value}</p>
        </div>
    );
}

function DetailCard({
    title,
    icon,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
            <div className="flex items-center gap-2.5 border-b !border-[#E8E6E0] !bg-[#FAFAF8] px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-[#F7F7F5] !text-[#767570]">
                    {icon}
                </div>
                <h2 className="text-sm font-semibold !text-[#16211B]">{title}</h2>
            </div>
            {children}
        </div>
    );
}

function FieldRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 px-4 sm:px-5 py-3 sm:py-3.5">
            <span className="text-gray-400 shrink-0 mt-0.5">{icon}</span>
            <span className="text-xs font-medium text-gray-400 min-w-[60px] sm:min-w-[80px] shrink-0">
                {label}
            </span>
            <span className="text-sm font-semibold text-gray-900 break-words flex-1 min-w-0">
                {value ?? '—'}
            </span>
        </div>
    );
}

function TimelineItem({
    label,
    value,
    dot,
    isFirst,
}: {
    label: string;
    value: string | null;
    dot: string;
    isFirst?: boolean;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex flex-col items-center pt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                {isFirst && <span className="mt-1 w-px flex-1 !bg-[#E8E6E0]" style={{ minHeight: 28 }} />}
            </div>
            <div>
                <p className="text-xs font-medium !text-[#B4B2A9]">{label}</p>
                <p className="mt-0.5 text-sm font-semibold !text-[#16211B]">
                    {value ?? <span className="font-normal !text-[#B4B2A9]">Not yet resolved</span>}
                </p>
            </div>
        </div>
    );
}