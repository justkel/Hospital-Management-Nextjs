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
    Stethoscope,
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
        <div className="w-full max-w-5xl mx-auto space-y-5 py-2 sm:py-4">
            <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-5 sm:p-7 text-white shadow-2xl">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-blue-100">
                            Procedure
                        </p>

                        <h1 className="mt-2 text-2xl sm:text-3xl font-black leading-tight break-words">
                            {procedure.procedureCatalog
                                ?.name ||
                                procedure.customProcedureName ||
                                'Procedure'}
                        </h1>

                        {procedure.procedureCatalog
                            ?.code && (
                                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-blue-50 backdrop-blur">
                                    <Hash className="h-4 w-4" />

                                    {
                                        procedure
                                            .procedureCatalog
                                            .code
                                    }
                                </div>
                            )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {status && (
                            <StatusPill
                                label={status.label}
                                dotClass={
                                    status.dot
                                }
                                badge={
                                    status.badge
                                }
                            />
                        )}

                        {priority && (
                            <StatusPill
                                label={
                                    priority.label
                                }
                                dotClass={
                                    priority.dot
                                }
                                badge={
                                    priority.badge
                                }
                            />
                        )}

                        {outcome && (
                            <StatusPill
                                label={
                                    outcome.label
                                }
                                dotClass={
                                    outcome.dot
                                }
                                badge={
                                    outcome.badge
                                }
                            />
                        )}
                    </div>
                </div>
            </div>

            <div>
                <div
                    className="
                        grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3
                        gap-3
                        rounded-[1.5rem]
                        border border-white/40
                        bg-white/80
                        backdrop-blur-xl
                        p-3 sm:p-4
                        shadow-xl
                    "
                >
                    {!isCancelled && (
                        <button
                            onClick={() => setShowDrawer(true)}
                            className="
                                group
                                w-full
                                min-h-[56px]
                                inline-flex items-center justify-center gap-2
                                rounded-2xl
                                bg-gradient-to-r from-blue-600 to-indigo-600
                                px-4 py-3
                                text-sm sm:text-base
                                font-bold
                                !text-white
                                shadow-lg shadow-blue-600/20
                                transition-all duration-200
                                hover:-translate-y-0.5
                                hover:shadow-xl
                                active:scale-[0.98]
                            "
                        >
                            <Activity className="h-4 w-4 shrink-0" />

                            <span className="truncate">
                                Update Procedure
                            </span>
                        </button>
                    )}

                    <button
                        onClick={() => {
                            if (!disableCancellation) {
                                setShowCancelModal(true);
                            }
                        }}
                        disabled={disableCancellation}
                        className={`
                            group
                            w-full
                            min-h-[56px]
                            inline-flex items-center justify-center gap-2
                            rounded-2xl
                            px-4 py-3
                            text-sm sm:text-base
                            font-bold
                            transition-all duration-200
                            active:scale-[0.98]

                            ${disableCancellation
                                                    ? `
                                cursor-not-allowed
                                border border-slate-200
                                bg-slate-50
                                text-slate-500
                                shadow-sm
                            `
                                                    : `
                                bg-gradient-to-r from-red-600 to-rose-600
                                !text-white
                                shadow-lg shadow-red-600/20
                                hover:-translate-y-0.5
                                hover:shadow-xl
                            `
                                                }
                        `}
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
                                ? 'Procedure Cancelled'
                                : isCompleted
                                    ? 'Procedure Completed'
                                    : 'Cancel Procedure'}
                        </span>
                    </button>
                </div>
            </div>

            <CollapsibleSection title="Procedure Details" defaultOpen={false}>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    <ProcedureCard title="">
                        <DetailRow
                            icon={ClipboardList}
                            label="Procedure Name"
                            value={
                                procedure
                                    .procedureCatalog
                                    ?.name ||
                                procedure.customProcedureName
                            }
                        />

                        <DetailRow
                            icon={Hash}
                            label="Procedure Code"
                            value={
                                procedure
                                    .procedureCatalog
                                    ?.code ||
                                procedure.customProcedureCode
                            }
                        />

                        <DetailRow
                            icon={ShieldAlert}
                            label="Priority"
                            value={
                                procedure.priority
                            }
                        />

                        <DetailRow
                            icon={Activity}
                            label="Status"
                            value={
                                procedure.status
                            }
                        />

                        <DetailRow
                            icon={CheckCircle2}
                            label="Outcome"
                            value={
                                procedure.outcome
                            }
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
                            value={formatDateTime(
                                procedure.orderedAt
                            )}
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
                            value={
                                procedure.orderedBy
                                    ?.fullName
                            }
                        />

                        <DetailRow
                            icon={ClipboardList}
                            label="Bed Allocation"
                            value={
                                procedure
                                    .bedAllocation?.id
                            }
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
                            value={
                                procedure.cancellationReason
                            }
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

            <div className="space-y-6 pt-2">
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
                onClose={() =>
                    setShowCancelModal(false)
                }
                procedureId={procedure.id}
            />
        </div>
    );
}