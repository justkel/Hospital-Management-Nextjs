import SessionGuard from '@/components/SessionGuard';
import {
  GetGuestRequestsDocument,
  GetGuestRequestsQuery,
  GetGuestRequestsQueryVariables,
  GetActiveGuestsDocument,
  GetActiveGuestsQuery,
  IsFeatureFlagEnabledDocument,
  IsFeatureFlagEnabledQuery,
  IsFeatureFlagEnabledQueryVariables,
  FeatureFlagKey,
} from '@/shared/graphql/generated/graphql';

import { graphqlFetch } from '@/shared/graphql/fetcher';
import GuestAccessClient from './GuestRequestsClient';

export default async function GuestAccessPage() {
  const [requestsRes, activeGuestsRes, guestAccessFlagRes] = await Promise.all([
    graphqlFetch<GetGuestRequestsQuery, GetGuestRequestsQueryVariables>(
      GetGuestRequestsDocument,
      { status: undefined }
    ),
    graphqlFetch<GetActiveGuestsQuery, Record<string, never>>(
      GetActiveGuestsDocument,
      {}
    ),
    graphqlFetch<
      IsFeatureFlagEnabledQuery,
      IsFeatureFlagEnabledQueryVariables
    >(IsFeatureFlagEnabledDocument, {
      flagKey: FeatureFlagKey.GuestAccess,
    }),
  ]);

  if (
    requestsRes.authOutcome === 'logout' ||
    activeGuestsRes.authOutcome === 'logout' ||
    guestAccessFlagRes.authOutcome === 'logout'
  ) {
    const reason =
      requestsRes.message ||
      activeGuestsRes.message ||
      guestAccessFlagRes.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    requestsRes.authOutcome === 'refresh' ||
    activeGuestsRes.authOutcome === 'refresh' ||
    guestAccessFlagRes.authOutcome === 'refresh' ||
    !requestsRes.data?.guestRequests ||
    !activeGuestsRes.data?.activeGuests ||
    !guestAccessFlagRes.data
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <GuestAccessClient
        initialRequests={requestsRes.data.guestRequests}
        initialActiveGuests={activeGuestsRes.data.activeGuests}
        initialGuestAccessEnabled={
          guestAccessFlagRes.data.isFeatureFlagEnabled ?? true
        }
      />
    </SessionGuard>
  );
}