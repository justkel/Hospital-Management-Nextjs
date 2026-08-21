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

  if (requestsRes.authOutcome === 'logout' || activeGuestsRes.authOutcome === 'logout') {
    const reason = requestsRes.message || activeGuestsRes.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (requestsRes.authOutcome === 'refresh' || activeGuestsRes.authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <GuestAccessClient
        initialRequests={requestsRes.data!.guestRequests}
        initialActiveGuests={activeGuestsRes.data!.activeGuests ?? []}
      />
    </SessionGuard>
  );
}