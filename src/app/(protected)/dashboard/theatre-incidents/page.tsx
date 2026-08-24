import SessionGuard from '@/components/SessionGuard';

import {
  GetTheatreIncidentsDocument,
  GetTheatreIncidentsQuery,
  GetTheatreIncidentsQueryVariables,
  GetTheatresDocument,
  GetTheatresQuery,
  GetTheatresQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import TheatreIncidentManagementClient from './TheatreIncidentManagementClient';

export default async function TheatreIncidentsPage() {
  const [incidentData, theatresData] = await Promise.all([
    graphqlFetch<
      GetTheatreIncidentsQuery,
      GetTheatreIncidentsQueryVariables
    >(GetTheatreIncidentsDocument, {
      pagination: {
        page: 1,
        limit: 20,
      },
    }),

    graphqlFetch<GetTheatresQuery, GetTheatresQueryVariables>(
      GetTheatresDocument,
      {
        pagination: {
          page: 1,
          limit: 200,
        },
      }
    ),
  ]);

  if (
    incidentData.authOutcome === 'logout' ||
    theatresData.authOutcome === 'logout'
  ) {
    const reason = incidentData.message || theatresData.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    incidentData.authOutcome === 'refresh' ||
    theatresData.authOutcome === 'refresh' ||
    !incidentData.data?.theatreIncidents ||
    !theatresData.data?.theatres
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <TheatreIncidentManagementClient
        paginated={incidentData.data.theatreIncidents}
        theatres={theatresData.data.theatres.items}
      />
    </SessionGuard>
  );
}