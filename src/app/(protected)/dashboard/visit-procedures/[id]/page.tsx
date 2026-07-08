import Link from 'next/link';

import SessionGuard from '@/components/SessionGuard';

import {
  GetVisitProcedureByIdDocument,
  GetVisitProcedureByIdQuery,
  GetVisitProcedureByIdQueryVariables,

  GetVisitProcedureStaffDocument,
  GetVisitProcedureStaffQuery,
  GetVisitProcedureStaffQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import ProcedureInfoSection from '../components/ProcedureInfoSection';
import ProcedureStaffSection from '../components/ProcedureStaffSection';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProcedureDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const [procedureData, staffData] =
    await Promise.all([
      graphqlFetch<
        GetVisitProcedureByIdQuery,
        GetVisitProcedureByIdQueryVariables
      >(GetVisitProcedureByIdDocument, { id }),

      graphqlFetch<
        GetVisitProcedureStaffQuery,
        GetVisitProcedureStaffQueryVariables
      >(GetVisitProcedureStaffDocument, {
        procedureId: id,
      }),
    ]);

  if (!procedureData?.visitProcedureById) {
    return <SessionGuard needsRefresh />;
  }

  const procedure =
    procedureData.visitProcedureById;

  const assignedStaff =
    staffData?.visitProcedureStaff || [];

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">

          <CollapsibleSection
            title="Theatre Bookings"
            defaultOpen={false}
          >
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Manage Theatre Bookings
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Manage theatre bookings for this procedure.
                </p>
              </div>

              <Link
                href={`/dashboard/visit-procedures/${procedure.id}/bookings`}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Open Theatre Bookings
              </Link>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Manage Procedure Staff"
            defaultOpen={false}
          >
            <ProcedureStaffSection
              procedureId={procedure.id}
              assignedStaff={assignedStaff}
              status={procedure.status}
            />
          </CollapsibleSection>
          <CollapsibleSection title="Procedure Information">
            <ProcedureInfoSection
              procedure={procedure}
            />
          </CollapsibleSection>
        </div>
      </div>
    </SessionGuard>
  );
}