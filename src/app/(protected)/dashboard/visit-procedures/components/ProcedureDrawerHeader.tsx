'use client';

import Link from 'next/link';

import {
    GetVisitProceduresQuery,
} from '@/shared/graphql/generated/graphql';

type ProcedureItem =
    GetVisitProceduresQuery['visitProcedures']['items'][number];

export default function ProcedureDrawerHeader({
    procedure,
}: {
    procedure: ProcedureItem | null;
}) {
    return (
        <div className="!bg-[#FAFAF8] border-b !border-[#E8E6E0] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                            Procedure
                        </p>
                    </div>

                    <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[28px]">
                        {procedure?.procedureCatalog?.name ||
                            procedure?.customProcedureName ||
                            'Procedure'}
                    </h3>

                    {procedure?.orderedBy?.fullName && (
                        <p className="mt-1.5 text-sm !text-[#767570]">
                            Ordered by: {procedure.orderedBy.fullName}
                        </p>
                    )}
                </div>

                <Link
                    href={`/dashboard/visits/${procedure?.visitId}`}
                    className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl !bg-[#0c1a12] px-4 text-xs font-semibold !text-white transition hover:!bg-[#16211B]"
                >
                    <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                    Open Visit
                </Link>
            </div>
        </div>
    );
}