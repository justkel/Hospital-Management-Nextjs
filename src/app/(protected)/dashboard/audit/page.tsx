import {
  GetAuditLogsDocument,
  GetAuditLogsQuery,
  GetAuditLogsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import AuditManagementClient from './AuditManagementClient';

export default async function AuditPage() {
  const { data, authOutcome, message } = await graphqlFetch<
    GetAuditLogsQuery,
    GetAuditLogsQueryVariables
  >(GetAuditLogsDocument, {
    pagination: {
      page: 1,
      limit: 20,
    },
  });

  if (authOutcome === 'logout') {
    return <SessionGuard mode="logout" reason={message} />;
  }

  if (authOutcome === 'refresh' || !data?.auditLogs) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <AuditManagementClient paginated={data.auditLogs} />
    </SessionGuard>
  );
}