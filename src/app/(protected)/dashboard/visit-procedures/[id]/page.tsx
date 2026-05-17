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
            >(
                GetVisitProcedureByIdDocument,
                { id }
            ),

            graphqlFetch<
                GetVisitProcedureStaffQuery,
                GetVisitProcedureStaffQueryVariables
            >(
                GetVisitProcedureStaffDocument,
                {
                    procedureId: id,
                }
            ),
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
                    <CollapsibleSection title="Manage Procedure Staff" defaultOpen={false}>
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