'use client';

import {
    AlertTriangle,
    ShieldAlert,
    Hospital,
    Clock3,
    ClipboardList,
    FileText,
    Activity,
} from 'lucide-react';

import { GetWardIncidentByIdQuery } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';

type Incident = GetWardIncidentByIdQuery['wardIncidentById'];

export default function WardIncidentInfoSection({
    incident,
}: {
    incident: Incident;
}) {
    const severityColor = getSeverityStyle(incident.severity);
    const statusColor = getStatusStyle(incident.status);

    return (
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
                <div className={`p-6 sm:p-8 ${severityColor.bgSoft}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                Ward Incident Report
                            </h1>

                            <p className="text-sm text-slate-600 mt-1">
                                Clinical safety incident documentation
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColor.badge}`}>
                                    {incident.severity}
                                </span>

                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.badge}`}>
                                    {incident.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Card title="Clinical Overview">
                <Row
                    icon={AlertTriangle}
                    label="Incident Type"
                    value={incident.type}
                />

                <Row
                    icon={Hospital}
                    label="Ward"
                    value={incident.ward?.name}
                />

                <Row
                    icon={ClipboardList}
                    label="Department"
                    value={incident.ward?.department?.replace(/_/g, ' ')}
                />

                <Row
                    icon={Clock3}
                    label="Reported At"
                    value={
                        incident.reportedAt
                            ? formatDateTime(incident.reportedAt)
                            : '—'
                    }
                />

                <Row
                    icon={Clock3}
                    label="Resolved At"
                    value={
                        incident.resolvedAt
                            ? formatDateTime(incident.resolvedAt)
                            : '—'
                    }
                />
            </Card>

            <div className="bg-white border rounded-3xl shadow-sm">
                <div className="px-6 py-4 border-b flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <h2 className="font-semibold text-slate-900">
                        Clinical Notes
                    </h2>
                </div>

                <div className="p-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                        <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap leading-6">
                            {incident.notes || 'No clinical notes recorded for this incident.'}
                        </p>
                    </div>
                </div>
            </div>

            <Card title="System Metadata">
                <Row icon={Activity} label="Status Flow" value={incident.status} />
                <Row icon={ShieldAlert} label="Severity Level" value={incident.severity} />
            </Card>
        </div>
    );
}

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white border rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50">
                <h2 className="font-semibold text-slate-900">
                    {title}
                </h2>
            </div>
            <div className="divide-y divide-slate-100">
                {children}
            </div>
        </div>
    );
}

function Row({
    icon: Icon,
    label,
    value,
}: {
    icon: any;
    label: string;
    value?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-4 px-6 py-4">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-slate-600" />
            </div>

            <div className="flex-1">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">
                    {value || '—'}
                </p>
            </div>
        </div>
    );
}

function getSeverityStyle(severity: string) {
    switch (severity) {
        case 'CRITICAL':
            return {
                bgSoft: 'bg-red-50',
                badge: 'bg-red-100 text-red-700',
            };
        case 'HIGH':
            return {
                bgSoft: 'bg-orange-50',
                badge: 'bg-orange-100 text-orange-700',
            };
        case 'MEDIUM':
            return {
                bgSoft: 'bg-yellow-50',
                badge: 'bg-yellow-100 text-yellow-700',
            };
        default:
            return {
                bgSoft: 'bg-green-50',
                badge: 'bg-green-100 text-green-700',
            };
    }
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'ACTIVE':
            return {
                badge: 'bg-red-100 text-red-700',
            };
        case 'RESOLVED':
            return {
                badge: 'bg-green-100 text-green-700',
            };
        default:
            return {
                badge: 'bg-slate-100 text-slate-700',
            };
    }
}