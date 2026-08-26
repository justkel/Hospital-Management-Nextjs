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
        React.SetStateAction<EditableProcedureStaff[]>
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
        <div className="rounded-2xl border !border-[#E8E6E0] !bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F5F2FF]">
                    <BadgeCheck className="h-4.5 w-4.5 !text-[#7C5CFC]" />
                </div>

                <div>
                    <h3 className="text-base font-semibold !text-[#16211B]">
                        Assigned team
                    </h3>

                    <p className="text-sm !text-[#767570]">
                        Update clinician roles or remove staff
                    </p>
                </div>
            </div>

            {team.length === 0 ? (
                <div className="mt-5 rounded-xl border border-dashed !border-[#E8E6E0] !bg-[#FAFAF8] py-10 text-center">
                    <p className="text-sm font-medium !text-[#767570]">
                        No staff assigned yet
                    </p>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {team.map(member => (
                        <div
                            key={member.staffId}
                            className="rounded-xl border !border-[#E8E6E0] !bg-white p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A]">
                                        <UserRound className="h-4.5 w-4.5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold !text-[#16211B]">
                                            {member.staffName}
                                            {member.userCode ? ` (${member.userCode})` : ''}
                                        </p>

                                        <p className="text-xs !text-[#B4B2A9]">
                                            Assigned clinician
                                        </p>
                                    </div>
                                </div>

                                <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                                    <button
                                        disabled={disabled || !canInteract}
                                        onClick={() => handleRemove(member.staffId)}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border !border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626] transition hover:!bg-[#FDE4E4] disabled:opacity-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </HasRoles>
                            </div>

                            <div className="mt-3.5">
                                <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                                    Function in procedure
                                </label>

                                <select
                                    value={member.functionInProcedure}
                                    disabled={disabled}
                                    onChange={e =>
                                        handleRoleChange(
                                            member.staffId,
                                            e.target.value as StaffFunction
                                        )
                                    }
                                    className="h-10 w-full rounded-lg border !border-[#E8E6E0] !bg-white px-3 text-sm font-medium !text-[#16211B] outline-none transition focus:!border-[#1D9E75] disabled:!bg-[#F7F7F5] disabled:!text-[#B4B2A9]"
                                >
                                    {Object.values(StaffFunction).map(role => (
                                        <option key={role} value={role}>
                                            {formatFunctionLabel(role)}
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