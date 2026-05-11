import SessionGuard from '@/components/SessionGuard';

import {
  GetWardIncidentByIdDocument,
  GetWardIncidentByIdQuery,
  GetWardIncidentByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import WardIncidentInfoSection from '../components/WardIncidentInfoSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WardIncidentDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetWardIncidentByIdQuery,
    GetWardIncidentByIdQueryVariables
  >(GetWardIncidentByIdDocument, {
    id,
  });

  if (!data?.wardIncidentById) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <CollapsibleSection title="Incident Information">
            <WardIncidentInfoSection
              incident={
                data.wardIncidentById
              }
            />
          </CollapsibleSection>
        </div>
      </div>
    </SessionGuard>
  );
}