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
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 shadow-xl backdrop-blur-xl">
                <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                                <Users className="h-6 w-6" />
                            </div>

                            <div>
                                <h2 className="text-lg font-black text-slate-900 sm:text-xl">
                                    Procedure Staff
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Manage clinicians assigned to this procedure
                                </p>
                            </div>
                        </div>

                        <button
                            disabled={
                                disabled ||
                                !hasChanges ||
                                saving
                            }
                            onClick={
                                handleSave
                            }
                            className="
                                inline-flex h-12 items-center justify-center gap-2
                                rounded-2xl
                                bg-gradient-to-r from-blue-600 to-indigo-600
                                px-5
                                font-bold
                                !text-white
                                shadow-lg shadow-blue-600/20
                                transition-all
                                hover:scale-[1.01]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            <Save className="h-4 w-4" />

                            {saving
                                ? 'Saving Changes...'
                                : 'Save Team Changes'}
                        </button>
                    </div>
                </div>

                <div className="space-y-6 p-4 sm:p-6">
                    <UpdateProcedureStaffCard
                        team={team}
                        setTeam={setTeam}
                        disabled={
                            disabled
                        }
                    />

                    <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                        <AssignProcedureStaffCard
                            team={team}
                            setTeam={setTeam}
                            disabled={
                                disabled
                            }
                        />
                    </HasRoles>

                </div>
            </div>
        </div>
    );
}