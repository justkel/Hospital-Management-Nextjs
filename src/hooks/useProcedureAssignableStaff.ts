'use client';

import { useEffect, useMemo, useState } from 'react';

import {
    StaffRole,
} from '@/shared/graphql/generated/graphql';

type StaffOption = {
    id: string;
    label: string;
    role: string;
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
                        fetch(
                            `/api/staff/by-role?role=${StaffRole.Nurse}`
                        ),

                        fetch(
                            `/api/staff/by-role?role=${StaffRole.Doctor}`
                        ),
                    ]);

                const [
                    nursesJson,
                    doctorsJson,
                ] = await Promise.all([
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
                                item: any
                            ) => [
                                item.id,
                                item,
                            ]
                        )
                    ).values()
                );

                setStaff(
                    deduped.map(
                        (item: any) => ({
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