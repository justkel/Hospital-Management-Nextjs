import SessionGuard from '@/components/SessionGuard';

import {
  GetWardIncidentsDocument,
  GetWardIncidentsQuery,
  GetWardIncidentsQueryVariables,
  GetWardsDocument,
  GetWardsQuery,
  GetWardsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';

import WardIncidentManagementClient from './WardIncidentManagementClient';

export default async function WardIncidentsPage() {
  const [incidentResult, wardsResult] = await Promise.all([
    graphqlFetch<GetWardIncidentsQuery, GetWardIncidentsQueryVariables>(
      GetWardIncidentsDocument,
      {
        pagination: {
          page: 1,
          limit: 20,
        },
      }
    ),

    graphqlFetch<GetWardsQuery, GetWardsQueryVariables>(GetWardsDocument, {
      pagination: {
        page: 1,
        limit: 200,
      },
    }),
  ]);

  if (
    incidentResult.authOutcome === 'logout' ||
    wardsResult.authOutcome === 'logout'
  ) {
    const reason = incidentResult.message || wardsResult.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    incidentResult.authOutcome === 'refresh' ||
    wardsResult.authOutcome === 'refresh' ||
    !incidentResult.data?.wardIncidents ||
    !wardsResult.data?.wards
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <WardIncidentManagementClient
        paginated={incidentResult.data.wardIncidents}
        wards={wardsResult.data.wards.items || []}
      />
    </SessionGuard>
  );
}