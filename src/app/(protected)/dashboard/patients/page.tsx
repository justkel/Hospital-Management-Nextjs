import {
  GetAllPatientsDocument,
  GetAllPatientsQuery,
  GetAllPatientsQueryVariables,
  PatientStatus,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import PatientManagementClient from './PatientManagementClient';

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;

  const search =
    typeof params.search === 'string' ? params.search : undefined;

  const statusParam =
    typeof params.status === 'string' ? params.status : undefined;

  const status =
    statusParam &&
    Object.values(PatientStatus).includes(statusParam as PatientStatus)
      ? (statusParam as PatientStatus)
      : undefined;

  const { data, authOutcome, message } = await graphqlFetch<
    GetAllPatientsQuery,
    GetAllPatientsQueryVariables
  >(GetAllPatientsDocument, {
    pagination: {
      page,
      limit,
      ...(status && { status }),
      ...(search && { search }),
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <PatientManagementClient paginated={data!.patients} />
    </SessionGuard>
  );
}
