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

  const { data, authOutcome, message } = await graphqlFetch<
    GetWardIncidentByIdQuery,
    GetWardIncidentByIdQueryVariables
  >(GetWardIncidentByIdDocument, {
    id,
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (!data?.wardIncidentById) {
    return <SessionGuard mode="none" />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <CollapsibleSection title="Incident Information">
            <WardIncidentInfoSection
              incident={data.wardIncidentById}
            />
          </CollapsibleSection>
        </div>
      </div>
    </SessionGuard>
  );
}