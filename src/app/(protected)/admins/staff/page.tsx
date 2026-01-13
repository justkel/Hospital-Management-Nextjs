import {
  GetAllStaffDocument,
  GetAllStaffQuery,
  GetAllStaffQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import StaffManagementClient from './StaffManagementClient';

export default async function StaffPage() {
  const data = await graphqlFetch<GetAllStaffQuery, GetAllStaffQueryVariables>(
    GetAllStaffDocument,
    {}
  );

  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <StaffManagementClient staffs={data.staffs} />
    </SessionGuard>
  );
}
