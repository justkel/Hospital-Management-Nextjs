'use client';

import {
    AlertTriangle,
    ShieldAlert,
    Hospital,
    Clock3,
    ClipboardList,
    FileText,
    Activity,
    User2,
    BadgeCheck,
    Pencil,
    ShieldCheck,
    CalendarClock,
} from 'lucide-react';

import { useState } from 'react';

import UpdateWardIncidentDrawer from './UpdateWardIncidentDrawer';

import { GetWardIncidentByIdQuery } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';

type Incident = GetWardIncidentByIdQuery['wardIncidentById'];

const SEVERITY_CONFIG: Record<string, {
    label: string;
    headerBg: string;
    headerBorder: string;
    badge: string;
    iconBg: string;
    iconColor: string;
    accent: string;
}> = {
    HIGH: {
        label: 'High',
        headerBg: 'bg-orange-50',
        headerBorder: 'border-orange-100',
        badge: 'bg-orange-100 text-orange-800',
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        accent: 'bg-orange-500',
    },
    MEDIUM: {
        label: 'Medium',
        headerBg: 'bg-amber-50',
        headerBorder: 'border-amber-100',
        badge: 'bg-amber-100 text-amber-800',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        accent: 'bg-amber-500',
    },
    LOW: {
        label: 'Low',
        headerBg: 'bg-emerald-50',
        headerBorder: 'border-emerald-100',
        badge: 'bg-emerald-100 text-emerald-800',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        accent: 'bg-emerald-500',
    },
};

const STATUS_CONFIG: Record<string, {
    badge: string;
    dot: string;
    icon: React.ElementType;
}> = {
    ACTIVE: {
        badge: 'bg-rose-100 text-rose-800',
        dot: 'bg-rose-500',
        icon: ShieldAlert,
    },
    RESOLVED: {
        badge: 'bg-emerald-100 text-emerald-800',
        dot: 'bg-emerald-500',
        icon: ShieldCheck,
    },
    ESCALATED: {
        badge: 'bg-amber-100 text-amber-800',
        dot: 'bg-amber-500',
        icon: Activity,
    },
};

export default function WardIncidentInfoSection({
    incident,
}: {
    incident: Incident;
}) {
    const [editOpen, setEditOpen] = useState(false);

    const sev = SEVERITY_CONFIG[incident.severity];
    const stat = STATUS_CONFIG[incident.status];
    const StatusIcon = stat.icon;

    return (
        <div className="mx-auto max-w-5xl space-y-5 py-2">
            <div className={`relative overflow-hidden rounded-[2rem] border ${sev.headerBorder} ${sev.headerBg}`}>

                <div className={`absolute left-0 top-0 h-full w-1.5 rounded-l-[2rem] ${sev.accent}`} />

                <div className="px-7 py-7 sm:px-10 sm:py-8 pl-10 sm:pl-14">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                                <Hospital className="h-3.5 w-3.5" />
                                <span>{incident.ward?.name ?? 'Ward'}</span>
                                <span className="text-slate-300">/</span>
                                <span>Incident Report</span>
                            </div>

                            <div>
                                <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                                    {incident.type}
                                </h1>
                                <p className="mt-1.5 text-sm text-slate-500">
                                    Clinical safety and operational incident documentation
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${sev.badge}`}>
                                    <AlertTriangle className="h-3 w-3" />
                                    {sev.label} severity
                                </span>

                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${stat.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                                    {incident.status.replace(/_/g, ' ')}
                                </span>

                                {incident.reportedAt && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        <Clock3 className="h-3 w-3" />
                                        {formatDateTime(incident.reportedAt)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setEditOpen(true)}
                            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-slate-700 active:scale-95"
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
                    colorClass={sev.iconBg + ' ' + sev.iconColor}
                />
                <StatTile
                    label="Status"
                    value={incident.status.replace(/_/g, ' ')}
                    icon={<StatusIcon className="h-4 w-4" />}
                    colorClass={sev.iconBg + ' ' + sev.iconColor}
                />
                <StatTile
                    label="Reported by"
                    value={incident.reportedBy?.userCode ?? '—'}
                    icon={<BadgeCheck className="h-4 w-4" />}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <StatTile
                    label="Ward"
                    value={incident.ward?.name ?? '—'}
                    icon={<Hospital className="h-4 w-4" />}
                    colorClass="bg-cyan-50 text-cyan-700"
                />
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <DetailCard
                    title="Reporter"
                    icon={<User2 className="h-4 w-4" />}
                >
                    <div className="flex items-center gap-4 p-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                            <User2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">
                                {incident.reportedBy?.fullName ?? '—'}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                {incident.reportedBy?.userCode ?? ''}
                            </p>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-100 border-t border-slate-100">
                        <FieldRow
                            icon={<ClipboardList className="h-3.5 w-3.5" />}
                            label="Incident type"
                            value={incident.type}
                        />
                        <FieldRow
                            icon={<Hospital className="h-3.5 w-3.5" />}
                            label="Ward"
                            value={incident.ward?.name}
                        />
                        <FieldRow
                            icon={<ClipboardList className="h-3.5 w-3.5" />}
                            label="Department"
                            value={incident.ward?.department?.replace(/_/g, ' ')}
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
                            dot="bg-rose-400"
                            isFirst
                        />
                        <TimelineItem
                            label="Resolved at"
                            value={incident.resolvedAt ? formatDateTime(incident.resolvedAt) : null}
                            dot="bg-emerald-400"
                        />
                    </div>
                </DetailCard>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
                <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                        <FileText className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-900">
                        Clinical notes
                    </h2>
                </div>

                <div className="p-6">
                    {incident.notes ? (
                        <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                            {incident.notes}
                        </p>
                    ) : (
                        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-400">
                            <FileText className="h-4 w-4 shrink-0" />
                            No clinical notes recorded for this incident.
                        </div>
                    )}
                </div>
            </div>

            <DetailCard
                title="System metadata"
                icon={<Activity className="h-4 w-4" />}
            >
                <div className="divide-y divide-slate-100">
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

            <UpdateWardIncidentDrawer
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
    colorClass,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    colorClass: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-xl ${colorClass}`}>
                {icon}
            </div>
            <p className="text-xs font-medium text-slate-400">{label}</p>
            <p className="mt-0.5 text-sm font-bold leading-snug text-slate-900">{value}</p>
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
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white">
            <div className="flex items-center gap-2.5 border-b border-slate-100 bg-slate-50/70 px-6 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    {icon}
                </div>
                <h2 className="text-sm font-bold text-slate-900">{title}</h2>
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
        <div className="flex items-center gap-3 px-5 py-3.5">
            <span className="text-slate-400">{icon}</span>
            <span className="min-w-[110px] text-xs text-slate-400">{label}</span>
            <span className="text-sm font-semibold text-slate-900">{value ?? '—'}</span>
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
                {isFirst && (
                    <span className="mt-1 w-px flex-1 bg-slate-200" style={{ minHeight: 28 }} />
                )}
            </div>
            <div>
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900">
                    {value ?? <span className="font-normal text-slate-400">Not yet resolved</span>}
                </p>
            </div>
        </div>
    );
}