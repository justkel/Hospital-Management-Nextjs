import SessionGuard from '@/components/SessionGuard';
import {
  GetGuestRequestsDocument,
  GetGuestRequestsQuery,
  GetGuestRequestsQueryVariables,
  GetActiveGuestsDocument,
  GetActiveGuestsQuery,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import GuestAccessClient from './GuestRequestsClient';

export default async function GuestAccessPage() {
  const [requestsRes, activeGuestsRes] = await Promise.all([
    graphqlFetch<GetGuestRequestsQuery, GetGuestRequestsQueryVariables>(
      GetGuestRequestsDocument,
      { status: undefined }
    ),
    graphqlFetch<GetActiveGuestsQuery, Record<string, never>>(
      GetActiveGuestsDocument,
      {}
    ),
  ]);

  if (requestsRes?.guestRequests === undefined) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <GuestAccessClient
        initialRequests={requestsRes.guestRequests}
        initialActiveGuests={activeGuestsRes?.activeGuests ?? []}
      />
    </SessionGuard>
  );
}