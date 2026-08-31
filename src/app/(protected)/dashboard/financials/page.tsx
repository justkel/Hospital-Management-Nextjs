import SessionGuard from '@/components/SessionGuard';
import {
  FinancialsDocument,
  FinancialsQuery,
  FinancialsQueryVariables,
  DashboardPeriod,
  FinancialTransactionDirection,
  FinancialTransactionType,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import FinancialsClient from './FinancialsClient';

export default async function FinancialsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    period?: string;
    from?: string;
    to?: string;
    type?: string;
    status?: string;
    direction?: string;
    paymentMethod?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const period = Object.values(DashboardPeriod).includes(params.period as DashboardPeriod)
    ? (params.period as DashboardPeriod)
    : undefined;
  const type = Object.values(FinancialTransactionType).includes(params.type as FinancialTransactionType)
    ? (params.type as FinancialTransactionType)
    : undefined;
  const direction = Object.values(FinancialTransactionDirection).includes(params.direction as FinancialTransactionDirection)
    ? (params.direction as FinancialTransactionDirection)
    : undefined;

  const { data, authOutcome, message } = await graphqlFetch<
    FinancialsQuery,
    FinancialsQueryVariables
  >(FinancialsDocument, {
    input: {
      page,
      limit: 25,
      period,
      from: params.from || undefined,
      to: params.to || undefined,
      types: type ? [type] : undefined,
      status: params.status || undefined,
      direction,
      paymentMethod: params.paymentMethod || undefined,
      search: params.search || undefined,
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.financials) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <FinancialsClient financials={data.financials} />
    </SessionGuard>
  );
}
