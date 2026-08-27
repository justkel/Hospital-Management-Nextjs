import {
  WhoAmIDocument,
  WhoAmIQuery,
  WhoAmIQueryVariables,
  DashboardOverviewDocument,
  DashboardOverviewQuery,
  DashboardOverviewQueryVariables,
  DashboardPeriod,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import DashboardClient from './DashboardClient';
import SessionGuard from '@/components/SessionGuard';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const requestedPeriod = params.period as DashboardPeriod | undefined;
  const period = requestedPeriod && Object.values(DashboardPeriod).includes(requestedPeriod)
    ? requestedPeriod
    : DashboardPeriod.Today;

  const { data, authOutcome, message } = await graphqlFetch<WhoAmIQuery, WhoAmIQueryVariables>(
    WhoAmIDocument,
    {}
  );

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.whoAmI) {
    return <SessionGuard mode="refresh" />;
  }

  const whoAmI = data.whoAmI;
  const overviewResponse = await graphqlFetch<
    DashboardOverviewQuery,
    DashboardOverviewQueryVariables
  >(DashboardOverviewDocument, { input: { period, limit: 10 } });

  if (overviewResponse.authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={overviewResponse.message} />;
  }

  if (overviewResponse.authOutcome === 'refresh' || !overviewResponse.data?.dashboardOverview) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <DashboardClient
        email={whoAmI.email ?? 'Unknown'}
        fullName={whoAmI.fullName ?? ''}
        roles={Array.isArray(whoAmI.roles) ? whoAmI.roles : []}
        phoneNumber={whoAmI.phoneNumber}
        status={whoAmI.status}
        lastLoginAt={whoAmI.lastLoginAt}
        lastSeenAt={whoAmI.lastSeenAt}
        overview={overviewResponse.data.dashboardOverview}
        selectedPeriod={period}
      />
    </SessionGuard>
  );
}
