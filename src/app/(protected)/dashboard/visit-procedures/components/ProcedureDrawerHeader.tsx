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
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
            <p className="text-sm text-blue-100 uppercase tracking-wider">
                Procedure
            </p>

            <h3 className="mt-2 text-2xl font-black">
                {procedure?.procedureCatalog?.name ||
                    procedure?.customProcedureName ||
                    'Procedure'}
            </h3>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-blue-100">
                <Link
                    href={`/dashboard/visits/${procedure?.visitId}`}
                    className="
                        inline-flex items-center gap-2
                        rounded-full border border-white/20
                        bg-white/10 backdrop-blur-md
                        px-4 py-2
                        text-sm font-medium text-white
                        hover:bg-white/20
                        transition-all duration-200
                    "
                >
                    <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />

                    <span>Open Visit</span>
                </Link>

                {procedure?.orderedBy?.fullName && (
                    <span>
                        Ordered By:{' '}
                        {procedure.orderedBy.fullName}
                    </span>
                )}
            </div>
        </div>
    );
}