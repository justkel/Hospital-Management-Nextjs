import SessionGuard from '@/components/SessionGuard';

import {
    GetWardByIdDocument,
    GetWardByIdQuery,
    GetWardByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import WardInfoSection from '../components/WardInfoSection';
import WardIncidentsSection from '../components/WardIncidentsSection';
import {
    GetWardIncidentsByWardDocument,
    GetWardIncidentsByWardQuery,
    GetWardIncidentsByWardQueryVariables,
} from '@/shared/graphql/generated/graphql';
import WardBedsSection from '../components/WardBedsSection';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function WardDetailPage({
    params,
}: Props) {
    const { id } = await params;

    const data = await graphqlFetch<
        GetWardByIdQuery,
        GetWardByIdQueryVariables
    >(GetWardByIdDocument, {
        id,
    });

    if (!data?.wardById) {
        return <SessionGuard needsRefresh />;
    }

    const incidentsData = await graphqlFetch<
        GetWardIncidentsByWardQuery,
        GetWardIncidentsByWardQueryVariables
    >(GetWardIncidentsByWardDocument, {
        wardId: id,
        pagination: {
            page: 1,
            limit: 20,
        },
    });

    const ward = data.wardById;

    return (
        <SessionGuard needsRefresh={false}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <CollapsibleSection title="Ward Information">
                        <WardInfoSection ward={ward} />
                    </CollapsibleSection>

                    {incidentsData?.wardIncidentsByWard && (
                        <WardIncidentsSection
                            wardId={id}
                            paginated={incidentsData.wardIncidentsByWard}
                        />
                    )}

                    <CollapsibleSection title="Ward Beds Layout">
                        <WardBedsSection wardId={id} />
                    </CollapsibleSection>
                </div>
            </div>
        </SessionGuard>
    );
}