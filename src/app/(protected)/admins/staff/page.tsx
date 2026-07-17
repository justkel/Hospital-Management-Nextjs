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

  const [data] = await Promise.all([
    graphqlFetch<GetAllStaffQuery, GetAllStaffQueryVariables>(
      GetAllStaffDocument,
      {
        pagination: {
          page,
          limit,
          ...(search && { search }),
        },
      }
    ),
  ]);

  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <StaffManagementClient paginated={data.staffs} />
    </SessionGuard>
  );
}