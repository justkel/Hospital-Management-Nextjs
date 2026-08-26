'use client';

import {
    ProcedureStaffResult,
    VisitProcedureStatus,
    StaffFunction,
} from '@/shared/graphql/generated/graphql';

import {
    Save,
    Users,
} from 'lucide-react';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { clientFetch } from '@/lib/clientFetch';

import AssignProcedureStaffCard from './AssignProcedureStaffCard';
import UpdateProcedureStaffCard from './UpdateProcedureStaffCard';
import { Roles } from '@/shared/utils/enums/roles';
import { HasRoles } from '@/components/auth/HasRoles';

export type EditableProcedureStaff = {
    id?: string;

    staffId: string;

    staffName: string;
    userCode?: string;

    functionInProcedure: StaffFunction;
};

type Props = {
    procedureId: string;

    assignedStaff?: ProcedureStaffResult[];

    status: VisitProcedureStatus;
};

export default function ProcedureStaffSection({
    procedureId,
    assignedStaff = [],
    status,
}: Props) {
    const router = useRouter();

    const [saving, setSaving] =
        useState(false);

    const [team, setTeam] = useState<
        EditableProcedureStaff[]
    >(
        assignedStaff.map(member => ({
            id: member.id,

            staffId: member.staffId,

            staffName: member.staffName,

            userCode:
                member.userCode ?? undefined,

            functionInProcedure:
                member.functionInProcedure,
        }))
    );

    const isCompleted =
        status ===
        VisitProcedureStatus.Completed;

    const isCancelled =
        status ===
        VisitProcedureStatus.Cancelled;

    const disabled =
        isCompleted || isCancelled;

    const hasChanges = useMemo(() => {
        const initial =
            JSON.stringify(
                assignedStaff.map(member => ({
                    staffId: member.staffId,
                    functionInProcedure:
                        member.functionInProcedure,
                }))
            );

        const current =
            JSON.stringify(
                team.map(member => ({
                    staffId: member.staffId,
                    functionInProcedure:
                        member.functionInProcedure,
                }))
            );

        return initial !== current;
    }, [assignedStaff, team]);

    async function handleSave() {
        try {
            setSaving(true);

            await clientFetch(
                '/api/visit-procedure/staff/update',
                {
                    method: 'PUT',

                    headers: {
                        'Content-Type':
                            'application/json',
                    },

                    body: JSON.stringify({
                        procedureId,

                        assignments: team.map(
                            member => ({
                                staffId:
                                    member.staffId,

                                functionInProcedure:
                                    member.functionInProcedure,
                            })
                        ),
                    }),
                }
            );

            router.refresh();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
                                <Users className="h-5 w-5 !text-[#1D9E75]" />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold !text-[#16211B] sm:text-base">
                                    Procedure staff
                                </h2>
                                <p className="text-xs !text-[#767570]">
                                    Manage clinicians assigned to this procedure
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={disabled || !hasChanges || saving}
                            onClick={handleSave}
                            className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 sm:px-5 text-xs sm:text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="sm:hidden">Save</span>
                            <span className="hidden sm:inline">{saving ? 'Saving...' : 'Save team changes'}</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-5 p-4 sm:p-6">
                    <UpdateProcedureStaffCard
                        team={team}
                        setTeam={setTeam}
                        disabled={disabled}
                    />

                    <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                        <AssignProcedureStaffCard
                            team={team}
                            setTeam={setTeam}
                            disabled={disabled}
                        />
                    </HasRoles>
                </div>
            </div>
        </div>
    );
}