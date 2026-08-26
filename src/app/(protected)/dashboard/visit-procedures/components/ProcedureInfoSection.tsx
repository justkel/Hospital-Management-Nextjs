'use client';

import {
    GetVisitProcedureByIdQuery,
    VisitProcedurePriority,
    VisitProcedureStatus,
    VisitProcedureOutcome,
} from '@/shared/graphql/generated/graphql';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UpdateVisitProcedureDrawer from '../../visit-procedures/components/UpdateVisitProcedureDrawer';
import { useBilling } from '@/hooks/billing/useBilling';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';

import { formatDateTime } from '@/utils/formatDateTime';
import VisitProcedureEventTimeline from './VisitProcedureEventTimeline';
import CreateVisitProcedureEventCard from './CreateVisitProcedureEventCard';

import {
    Activity,
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Clock3,
    ClipboardList,
    FileText,
    Hash,
    ShieldAlert,
    TimerReset,
    User2,
    XCircle,
} from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, OUTCOME_CONFIG, StatusPill, ProcedureCard, DetailRow } from './procedure-types';
import { formatDuration } from '../types/procedure-functions';
import CancelVisitProcedureModal from './CancelVisitProcedureModal';
import CollapsibleSection from '../../visits/components/CollapsibleSection';

type Procedure =
    GetVisitProcedureByIdQuery['visitProcedureById'];

type Props = {
    procedure: Procedure;
};

export default function ProcedureInfoSection({
    procedure,
}: Props) {
    const router = useRouter();
    const [timelineRefreshKey, setTimelineRefreshKey] =
        useState(0);
    const status =
        STATUS_CONFIG[
        procedure.status as VisitProcedureStatus
        ];

    const priority =
        PRIORITY_CONFIG[
        procedure.priority as VisitProcedurePriority
        ];

    const outcome = procedure.outcome
        ? OUTCOME_CONFIG[
        procedure.outcome as VisitProcedureOutcome
        ]
        : null;

    const [showDrawer, setShowDrawer] =
        useState(false);

    const [showCancelModal, setShowCancelModal] =
        useState(false);

    const { catalogs } =
        useBilling(ChargeDomain.Procedure);

    const isCancelled =
        procedure.status ===
        VisitProcedureStatus.Cancelled;

    const isCompleted =
        procedure.status ===
        VisitProcedureStatus.Completed;

    const disableCancellation =
        isCancelled || isCompleted;

    return (
        <div className="mx-auto w-full max-w-5xl space-y-5 py-2 sm:py-4">
            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="p-5 sm:p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                                    Procedure
                                </p>
                            </div>

                            <h1 className="mt-2.5 break-words text-2xl font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[28px]">
                                {procedure.procedureCatalog?.name ||
                                    procedure.customProcedureName ||
                                    'Procedure'}
                            </h1>

                            {procedure.procedureCatalog?.code && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full !bg-[#F7F7F5] px-3 py-1.5 font-mono text-sm !text-[#5F5E5A]">
                                    <Hash className="h-3.5 w-3.5" />
                                    {procedure.procedureCatalog.code}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {status && (
                                <StatusPill
                                    label={status.label}
                                    dotClass={status.dot}
                                    badge={status.badge}
                                />
                            )}

                            {priority && (
                                <StatusPill
                                    label={priority.label}
                                    dotClass={priority.dot}
                                    badge={priority.badge}
                                />
                            )}

                            {outcome && (
                                <StatusPill
                                    label={outcome.label}
                                    dotClass={outcome.dot}
                                    badge={outcome.badge}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border !border-[#E8E6E0] !bg-white p-3 sm:grid-cols-2 sm:p-4 xl:grid-cols-3">
                {!isCancelled && (
                    <button
                        onClick={() => setShowDrawer(true)}
                        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 py-3 text-sm font-semibold !text-white transition hover:!bg-[#16211B] sm:text-base"
                    >
                        <Activity className="h-4 w-4 shrink-0" />
                        <span className="truncate">Update procedure</span>
                    </button>
                )}

                <button
                    onClick={() => {
                        if (!disableCancellation) {
                            setShowCancelModal(true);
                        }
                    }}
                    disabled={disableCancellation}
                    className={`inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition sm:text-base ${
                        disableCancellation
                            ? 'cursor-not-allowed border !border-[#E8E6E0] !bg-[#F7F7F5] !text-[#B4B2A9]'
                            : 'border !border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626] hover:!bg-[#FDE4E4]'
                    }`}
                >
                    {isCancelled ? (
                        <XCircle className="h-4 w-4 shrink-0" />
                    ) : isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}

                    <span className="truncate">
                        {isCancelled
                            ? 'Procedure cancelled'
                            : isCompleted
                                ? 'Procedure completed'
                                : 'Cancel procedure'}
                    </span>
                </button>
            </div>

            <CollapsibleSection title="Procedure Details" defaultOpen={false}>
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    <ProcedureCard title="">
                        <DetailRow
                            icon={ClipboardList}
                            label="Procedure Name"
                            value={
                                procedure.procedureCatalog?.name ||
                                procedure.customProcedureName
                            }
                        />

                        <DetailRow
                            icon={Hash}
                            label="Procedure Code"
                            value={
                                procedure.procedureCatalog?.code ||
                                procedure.customProcedureCode
                            }
                        />

                        <DetailRow
                            icon={ShieldAlert}
                            label="Priority"
                            value={procedure.priority}
                        />

                        <DetailRow
                            icon={Activity}
                            label="Status"
                            value={procedure.status}
                        />

                        <DetailRow
                            icon={CheckCircle2}
                            label="Outcome"
                            value={procedure.outcome}
                        />

                        <DetailRow
                            icon={TimerReset}
                            label="Estimated Duration"
                            value={
                                procedure.estimatedDuration
                                    ? `${formatDuration(procedure.estimatedDuration)}`
                                    : null
                            }
                        />
                    </ProcedureCard>

                    <ProcedureCard title="Timeline">
                        <DetailRow
                            icon={CalendarDays}
                            label="Ordered At"
                            value={formatDateTime(procedure.orderedAt)}
                        />

                        <DetailRow
                            icon={Clock3}
                            label="Started At"
                            value={
                                procedure.startedAt
                                    ? formatDateTime(procedure.startedAt)
                                    : '—'
                            }
                        />

                        <DetailRow
                            icon={CheckCircle2}
                            label="Completed At"
                            value={
                                procedure.completedAt
                                    ? formatDateTime(procedure.completedAt)
                                    : '—'
                            }
                        />

                        <DetailRow
                            icon={XCircle}
                            label="Cancelled At"
                            value={
                                procedure.cancelledAt
                                    ? formatDateTime(procedure.cancelledAt)
                                    : '—'
                            }
                        />
                    </ProcedureCard>

                    <ProcedureCard title="Clinical Information">
                        <DetailRow
                            icon={User2}
                            label="Ordered By"
                            value={procedure.orderedBy?.fullName}
                        />

                        <DetailRow
                            icon={ClipboardList}
                            label="Bed Allocation"
                            value={procedure.bedAllocation?.id}
                        />
                    </ProcedureCard>

                    <ProcedureCard title="Notes & Cancellation">
                        <DetailRow
                            icon={FileText}
                            label="Clinical Notes"
                            value={procedure.notes}
                        />

                        <DetailRow
                            icon={AlertTriangle}
                            label="Cancellation Reason"
                            value={procedure.cancellationReason}
                        />
                    </ProcedureCard>
                </div>
            </CollapsibleSection>

            <UpdateVisitProcedureDrawer
                open={showDrawer}
                onClose={() => setShowDrawer(false)}
                procedure={procedure}
                catalogs={catalogs ?? []}
                onUpdated={() => {
                    setShowDrawer(false);
                    router.refresh();
                }}
            />

            <div className="space-y-5 pt-2">
                <CreateVisitProcedureEventCard
                    procedureId={procedure.id}
                    status={procedure.status as VisitProcedureStatus}
                    onCreated={() => {
                        setTimelineRefreshKey(prev => prev + 1);
                        router.refresh();
                    }}
                />

                <VisitProcedureEventTimeline
                    procedureId={procedure.id}
                    refreshKey={timelineRefreshKey}
                />
            </div>

            <CancelVisitProcedureModal
                open={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                procedureId={procedure.id}
            />
        </div>
    );
}