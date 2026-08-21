import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatreIncidentByIdDocument,
  GetTheatreIncidentByIdQuery,
  GetTheatreIncidentByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import CollapsibleSection from '../../visits/components/CollapsibleSection';

import TheatreIncidentInfoSection from '../components/TheatreIncidentInfoSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TheatreIncidentDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const { data, authOutcome, message } = await graphqlFetch<
    GetTheatreIncidentByIdQuery,
    GetTheatreIncidentByIdQueryVariables
  >(GetTheatreIncidentByIdDocument, {
    id,
  });

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <CollapsibleSection title="Incident Information">
            <TheatreIncidentInfoSection
              incident={data!.theatreIncidentById}
            />
          </CollapsibleSection>
        </div>
      </div>
    </SessionGuard>
  );
}