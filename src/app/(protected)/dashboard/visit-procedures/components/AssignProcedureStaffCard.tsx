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
        <div className="rounded-[1.75rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <UserPlus2 className="h-5 w-5" />
                </div>

                <div>
                    <h3 className="text-lg font-black text-slate-900">
                        Assign Staff
                    </h3>

                    <p className="text-sm text-slate-500">
                        Add clinicians to this procedure team
                    </p>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
                <select
                    value={staffId}
                    disabled={disabled}
                    onChange={e =>
                        setStaffId(
                            e.target.value
                        )
                    }
                    className="
                        h-14 rounded-2xl
                        border border-slate-200
                        bg-white px-4
                        text-sm font-medium
                    "
                >
                    <option value="">
                        Select Staff
                    </option>

                    {availableStaff.map(
                        member => (
                            <option
                                key={member.id}
                                value={member.id}
                            >
                                {member.label}
                            </option>
                        )
                    )}
                </select>

                <select
                    value={
                        functionInProcedure
                    }
                    disabled={disabled}
                    onChange={e =>
                        setFunction(
                            e.target
                                .value as StaffFunction
                        )
                    }
                    className="
                        h-14 rounded-2xl
                        border border-slate-200
                        bg-white px-4
                        text-sm font-medium
                    "
                >
                    {Object.values(
                        StaffFunction
                    ).map(role => (
                        <option
                            key={role}
                            value={role}
                        >
                            {formatFunctionLabel(
                                role
                            )}
                        </option>
                    ))}
                </select>

                <button
                    disabled={
                        disabled || !staffId
                    }
                    onClick={handleAddStaff}
                    className="
                        h-14 rounded-2xl
                        bg-gradient-to-r
                        from-emerald-600
                        to-teal-600
                        px-5 font-bold !text-white
                        shadow-lg transition-all
                        hover:scale-[1.01]
                        disabled:opacity-50
                    "
                >
                    <span className="inline-flex items-center gap-2">
                        <Plus className="h-4 w-4" />

                        Add To Team
                    </span>
                </button>
            </div>
        </div>
    );
}