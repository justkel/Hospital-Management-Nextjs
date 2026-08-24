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

  const [theatreData, availabilityData] = await Promise.all([
    graphqlFetch<GetTheatreByIdQuery, GetTheatreByIdQueryVariables>(
      GetTheatreByIdDocument,
      { id }
    ),
    graphqlFetch<
      TheatreAvailabilitiesQuery,
      TheatreAvailabilitiesQueryVariables
    >(TheatreAvailabilitiesDocument, {
      theatreId: id,
    }),
  ]);

  if (
    theatreData.authOutcome === 'logout' ||
    availabilityData.authOutcome === 'logout'
  ) {
    const reason = theatreData.message || availabilityData.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    theatreData.authOutcome === 'refresh' ||
    availabilityData.authOutcome === 'refresh' ||
    !theatreData.data?.theatreById ||
    !availabilityData.data?.theatreAvailabilities
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-7xl">
          <TheatreAvailabilityWorkspace
            theatre={theatreData.data.theatreById}
            initialAvailabilities={availabilityData.data.theatreAvailabilities}
          />
        </div>
      </div>
    </SessionGuard>
  );
}