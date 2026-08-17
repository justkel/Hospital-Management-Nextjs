'use client';

import {
    StaffFunction,
} from '@/shared/graphql/generated/graphql';

import {
    BadgeCheck,
    Trash2,
    UserRound,
} from 'lucide-react';

import type { EditableProcedureStaff } from './ProcedureStaffSection';
import { HasRoles, useHasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type Props = {
    team: EditableProcedureStaff[];

    setTeam: React.Dispatch<
        React.SetStateAction<
            EditableProcedureStaff[]
        >
    >;

    disabled?: boolean;
};

function formatFunctionLabel(
    value: string
) {
    return value
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
        );
}

export default function UpdateProcedureStaffCard({
    team,
    setTeam,
    disabled,
}: Props) {
    function handleRemove(
        staffId: string
    ) {
        setTeam(prev =>
            prev.filter(
                member =>
                    member.staffId !==
                    staffId
            )
        );
    }

    function handleRoleChange(
        staffId: string,
        role: StaffFunction
    ) {
        setTeam(prev =>
            prev.map(member =>
                member.staffId === staffId
                    ? {
                        ...member,
                        functionInProcedure:
                            role,
                    }
                    : member
            )
        );
    }

    const canInteract = useHasRoles([Roles.ADMIN, Roles.DOCTOR]);

    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    <BadgeCheck className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        Assigned Team
                    </h3>

                    <p className="text-sm text-slate-500">
                        Update clinician roles or remove staff
                    </p>
                </div>
            </div>

            {team.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                    <p className="text-sm font-medium text-slate-500">
                        No staff assigned yet
                    </p>
                </div>
            ) : (
                <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {team.map(member => (
                        <div
                            key={
                                member.staffId
                            }
                            className="
                                rounded-3xl
                                border border-slate-200
                                bg-gradient-to-br
                                from-white
                                to-slate-50
                                p-4
                                shadow-sm
                            "
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                                        <UserRound className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-bold text-slate-900">
                                            {
                                                member.staffName
                                            }
                                            {member.userCode
                                                ? ` (${member.userCode})`
                                                : ''}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            Assigned clinician
                                        </p>
                                    </div>
                                </div>

                                <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                                    <button
                                        disabled={
                                            disabled || !canInteract
                                        }
                                        onClick={() =>
                                            handleRemove(
                                                member.staffId
                                            )
                                        }
                                        className="
                                        flex h-10 w-10 items-center justify-center
                                        rounded-xl border border-red-100
                                        bg-red-50 text-red-600
                                        transition-all
                                        hover:bg-red-100
                                        disabled:opacity-50
                                    "
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </HasRoles>
                            </div>

                            <div className="mt-4">
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Function In Procedure
                                </label>

                                <select
                                    value={
                                        member.functionInProcedure
                                    }
                                    disabled={
                                        disabled
                                    }
                                    onChange={e =>
                                        handleRoleChange(
                                            member.staffId,
                                            e.target
                                                .value as StaffFunction
                                        )
                                    }
                                    className="
                                        h-12 w-full rounded-2xl
                                        border border-slate-200
                                        bg-white px-4
                                        text-sm font-semibold
                                    "
                                >
                                    {Object.values(
                                        StaffFunction
                                    ).map(role => (
                                        <option
                                            key={
                                                role
                                            }
                                            value={
                                                role
                                            }
                                        >
                                            {formatFunctionLabel(
                                                role
                                            )}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}