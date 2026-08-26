'use client';

import {
    StaffFunction,
} from '@/shared/graphql/generated/graphql';

import {
    Plus,
    UserPlus2,
} from 'lucide-react';

import { useMemo, useState } from 'react';

import { useProcedureAssignableStaff } from '../../../../../hooks/useProcedureAssignableStaff';

import type { EditableProcedureStaff } from './ProcedureStaffSection';

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

export default function AssignProcedureStaffCard({
    team,
    setTeam,
    disabled,
}: Props) {
    const { staff } =
        useProcedureAssignableStaff();

    const [staffId, setStaffId] =
        useState('');

    const [functionInProcedure, setFunction] =
        useState<StaffFunction>(
            StaffFunction.Assistant
        );

    const assignedIds = useMemo(
        () =>
            team.map(member => member.staffId),
        [team]
    );

    const availableStaff = staff.filter(
        member =>
            !assignedIds.includes(member.id)
    );

    function handleAddStaff() {
        if (!staffId) return;

        const selected =
            staff.find(
                member =>
                    member.id === staffId
            );

        if (!selected) return;

        setTeam(prev => [
            ...prev,
            {
                staffId: selected.id,
                staffName: selected.label,
                functionInProcedure,
            },
        ]);

        setStaffId('');

        setFunction(
            StaffFunction.Assistant
        );
    }

    return (
        <div className="rounded-2xl border !border-[#E8E6E0] !bg-white p-4 sm:p-5">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#ECFBF5]">
                    <UserPlus2 className="h-4.5 w-4.5 !text-[#1D9E75]" />
                </div>

                <div>
                    <h3 className="text-base font-semibold !text-[#16211B]">
                        Assign staff
                    </h3>

                    <p className="text-sm !text-[#767570]">
                        Add clinicians to this procedure team
                    </p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-3">
                <select
                    value={staffId}
                    disabled={disabled}
                    onChange={e => setStaffId(e.target.value)}
                    className="h-11 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] disabled:!bg-[#F7F7F5] disabled:!text-[#B4B2A9]"
                >
                    <option value="">Select staff</option>

                    {availableStaff.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.label}
                        </option>
                    ))}
                </select>

                <select
                    value={functionInProcedure}
                    disabled={disabled}
                    onChange={e => setFunction(e.target.value as StaffFunction)}
                    className="h-11 rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#1D9E75] disabled:!bg-[#F7F7F5] disabled:!text-[#B4B2A9]"
                >
                    {Object.values(StaffFunction).map(role => (
                        <option key={role} value={role}>
                            {formatFunctionLabel(role)}
                        </option>
                    ))}
                </select>

                <button
                    disabled={disabled || !staffId}
                    onClick={handleAddStaff}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-5 text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus className="h-4 w-4" />
                    Add to team
                </button>
            </div>
        </div>
    );
}