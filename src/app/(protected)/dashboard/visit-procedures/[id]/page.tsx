import SessionGuard from '@/components/SessionGuard';

import {
    GetVisitProcedureByIdDocument,
    GetVisitProcedureByIdQuery,
    GetVisitProcedureByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import ProcedureInfoSection from '../components/ProcedureInfoSection';

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProcedureDetailPage({
    params,
}: Props) {
    const { id } = await params;

    const data = await graphqlFetch<
        GetVisitProcedureByIdQuery,
        GetVisitProcedureByIdQueryVariables
    >(GetVisitProcedureByIdDocument, {
        id,
    });

    if (!data?.visitProcedureById) {
        return <SessionGuard needsRefresh />;
    }

    const procedure = data.visitProcedureById;

    return (
        <SessionGuard needsRefresh={false}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
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