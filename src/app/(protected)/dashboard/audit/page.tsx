import {
  GetAuditLogsDocument,
  GetAuditLogsQuery,
  GetAuditLogsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import AuditManagementClient from './AuditManagementClient';

export default async function AuditPage() {
  const data = await graphqlFetch<
    GetAuditLogsQuery,
    GetAuditLogsQueryVariables
  >(GetAuditLogsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (!data?.auditLogs) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <AuditManagementClient paginated={data.auditLogs} />
    </SessionGuard>
  );
}