import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatreByIdDocument,
  GetTheatreByIdQuery,
  GetTheatreByIdQueryVariables,
  TheatreAvailabilitiesDocument,
  TheatreAvailabilitiesQuery,
  TheatreAvailabilitiesQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreAvailabilityWorkspace from '../../components/TheatreAvailabilityWorkspace';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function TheatreAvailabilityPage({
  params,
}: Props) {
  const { id } = await params;

  const theatreData = await graphqlFetch<
    GetTheatreByIdQuery,
    GetTheatreByIdQueryVariables
  >(GetTheatreByIdDocument, { id });

  if (!theatreData?.theatreById) {
    return <SessionGuard needsRefresh />;
  }

  const availabilityData = await graphqlFetch<
    TheatreAvailabilitiesQuery,
    TheatreAvailabilitiesQueryVariables
  >(TheatreAvailabilitiesDocument, {
    theatreId: id,
  });

  const theatre = theatreData.theatreById;
  const availabilities =
    availabilityData?.theatreAvailabilities ?? [];

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <TheatreAvailabilityWorkspace
            theatre={theatre}
            initialAvailabilities={availabilities}
          />
        </div>
      </div>
    </SessionGuard>
  );
}