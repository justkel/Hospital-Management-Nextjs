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
  const [incidentData, wardsData] =
    await Promise.all([
      graphqlFetch<
        GetWardIncidentsQuery,
        GetWardIncidentsQueryVariables
      >(GetWardIncidentsDocument, {
        pagination: {
          page: 1,
          limit: 20,
        },
      }),

      graphqlFetch<
        GetWardsQuery,
        GetWardsQueryVariables
      >(GetWardsDocument, {
        pagination: {
          page: 1,
          limit: 200,
        },
      }),
    ]);

  if (!incidentData?.wardIncidents) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <WardIncidentManagementClient
        paginated={
          incidentData.wardIncidents
        }
        wards={
          wardsData?.wards?.items || []
        }
      />
    </SessionGuard>
  );
}