import SessionGuard from '@/components/SessionGuard';

import {
    GetWardByIdDocument,
    GetWardByIdQuery,
    GetWardByIdQueryVariables,
    GetWardIncidentsByWardDocument,
    GetWardIncidentsByWardQuery,
    GetWardIncidentsByWardQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import WardInfoSection from '../components/WardInfoSection';
import WardIncidentsSection from '../components/WardIncidentsSection';
import WardBedsSection from '../components/WardBedsSection';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function WardDetailPage({ params }: Props) {
    const { id } = await params;

    const [wardRes, incidentsRes] = await Promise.all([
        graphqlFetch<GetWardByIdQuery, GetWardByIdQueryVariables>(
            GetWardByIdDocument,
            {
                id,
            }
        ),
        graphqlFetch<
            GetWardIncidentsByWardQuery,
            GetWardIncidentsByWardQueryVariables
        >(GetWardIncidentsByWardDocument, {
            wardId: id,
            pagination: {
                page: 1,
                limit: 20,
            },
        }),
    ]);

    if (
        wardRes.authOutcome === 'logout' ||
        incidentsRes.authOutcome === 'logout'
    ) {
        const reason = wardRes.message || incidentsRes.message;

        return <SessionGuard mode="logout" reason={reason} />;
    }

    if (
        wardRes.authOutcome === 'refresh' ||
        incidentsRes.authOutcome === 'refresh' ||
        !wardRes.data?.wardById
    ) {
        return <SessionGuard mode="refresh" />;
    }

    return (
        <SessionGuard mode="none">
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
                    <CollapsibleSection title="Ward Information">
                        <WardInfoSection ward={wardRes.data.wardById} />
                    </CollapsibleSection>

                    {incidentsRes.data?.wardIncidentsByWard && (
                        <WardIncidentsSection
                            wardId={id}
                            paginated={incidentsRes.data.wardIncidentsByWard}
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