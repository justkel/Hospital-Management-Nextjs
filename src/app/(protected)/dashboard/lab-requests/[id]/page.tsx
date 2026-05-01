import {
    FindLabRequestByIdDocument,
    FindLabRequestByIdQuery,
    FindLabRequestByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';

import CollapsibleSection from '../../visits/components/CollapsibleSection';
import LabRequestInfoSection from '../components/LabRequestInfoSection';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function LabRequestDetailPage({ params }: Props) {
    const { id } = await params;

    const data = await graphqlFetch<
        FindLabRequestByIdQuery,
        FindLabRequestByIdQueryVariables
    >(FindLabRequestByIdDocument, { id });

    if (!data?.labRequestById) {
        return <SessionGuard needsRefresh />;
    }

    const labRequest = data.labRequestById;

    return (
        <SessionGuard needsRefresh={false}>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
                <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                    <CollapsibleSection title="Request Information">
                        <LabRequestInfoSection labRequest={labRequest} />
                    </CollapsibleSection>
                </div>
            </div>
        </SessionGuard>
    );
}