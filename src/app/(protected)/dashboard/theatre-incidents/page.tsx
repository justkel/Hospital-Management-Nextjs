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
  const [incidentData, theatresData] =
    await Promise.all([
      graphqlFetch<
        GetTheatreIncidentsQuery,
        GetTheatreIncidentsQueryVariables
      >(GetTheatreIncidentsDocument, {
        pagination: {
          page: 1,
          limit: 20,
        },
      }),

      graphqlFetch<
        GetTheatresQuery,
        GetTheatresQueryVariables
      >(GetTheatresDocument, {
        pagination: {
          page: 1,
          limit: 200,
        },
      }),
    ]);

  if (!incidentData?.theatreIncidents) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <TheatreIncidentManagementClient
        paginated={
          incidentData.theatreIncidents
        }
        theatres={
          theatresData?.theatres?.items || []
        }
      />
    </SessionGuard>
  );
}