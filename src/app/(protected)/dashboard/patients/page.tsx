import {
  GetAllPatientsDocument,
  GetAllPatientsQuery,
  GetAllPatientsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import PatientManagementClient from './PatientManagementClient';

export default async function PatientsPage() {
  const data = await graphqlFetch<
    GetAllPatientsQuery,
    GetAllPatientsQueryVariables
  >(GetAllPatientsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
        <PatientManagementClient paginated={data.patients} />
    </SessionGuard>
  );
}
