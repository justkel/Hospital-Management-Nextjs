'use client';

import { useEffect, useMemo, useState } from 'react';

import {
    StaffRole,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type StaffOption = {
    id: string;
    label: string;
    role: string;
};

type RawStaffMember = {
    id: string;
    fullName: string;
    userCode: string;
    roles?: string[];
};

type StaffByRoleResponse = {
    staff?: RawStaffMember[];
};

export function useProcedureAssignableStaff() {
    const [loading, setLoading] =
        useState(true);

    const [staff, setStaff] = useState<
        StaffOption[]
    >([]);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);

                const [nursesRes, doctorsRes] =
                    await Promise.all([
                        clientFetch(
                            `/api/staff/by-role?role=${StaffRole.Nurse}`
                        ),

                        clientFetch(
                            `/api/staff/by-role?role=${StaffRole.Doctor}`
                        ),
                    ]);

                const [
                    nursesJson,
                    doctorsJson,
                ]: StaffByRoleResponse[] = await Promise.all([
                    nursesRes.json(),
                    doctorsRes.json(),
                ]);

                const merged = [
                    ...(nursesJson.staff || []),
                    ...(doctorsJson.staff || []),
                ];

                const deduped = Array.from(
                    new Map(
                        merged.map(
                            (
                                item: RawStaffMember
                            ) => [
                                item.id,
                                item,
                            ] as const
                        )
                    ).values()
                );

                setStaff(
                    deduped.map(
                        (item: RawStaffMember) => ({
                            id: item.id,

                            label: `${item.fullName} (${item.userCode})`,

                            role:
                                item.roles?.join(
                                    ', '
                                ) || '',
                        })
                    )
                );
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return useMemo(
        () => ({
            staff,
            loading,
        }),
        [staff, loading]
    );
}