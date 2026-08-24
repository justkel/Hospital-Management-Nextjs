import {
  FindAllVisitsDocument,
  FindAllVisitsQuery,
  FindAllVisitsQueryVariables,
  VisitStatus,
  VisitType,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import VisitManagementClient from './VisitManagementClient';

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;

  const statusParam =
    typeof params.status === 'string' ? params.status : undefined;

  const status =
    statusParam &&
      Object.values(VisitStatus).includes(statusParam as VisitStatus)
      ? (statusParam as VisitStatus)
      : undefined;

  const typeParam =
    typeof params.visitType === 'string' ? params.visitType : undefined;

  const visitType =
    typeParam && Object.values(VisitType).includes(typeParam as VisitType)
      ? (typeParam as VisitType)
      : undefined;

  const { data, authOutcome, message } = await graphqlFetch<
    FindAllVisitsQuery,
    FindAllVisitsQueryVariables
  >(FindAllVisitsDocument, {
    pagination: {
      page,
      limit,
      ...(status && { status }),
      ...(visitType && { visitType }),
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.visits) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <VisitManagementClient paginated={data.visits} />
    </SessionGuard>
  );
}