import {
  GetAllStaffDocument,
  GetAllStaffQuery,
  GetAllStaffQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import StaffManagementClient from './StaffManagementClient';

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 25;
  const search =
    typeof params.search === 'string' ? params.search : undefined;

  const { data, authOutcome, message } = await graphqlFetch<
    GetAllStaffQuery,
    GetAllStaffQueryVariables
  >(GetAllStaffDocument, {
    pagination: {
      page,
      limit,
      ...(search && { search }),
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.staffs) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <StaffManagementClient paginated={data.staffs} />
    </SessionGuard>
  );
}