import SessionGuard from '@/components/SessionGuard';
import DashboardLayout from '@/app/(protected)/dashboard/layout';
import ChargeDomainMappingClient from './ChargeDomainMappingClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';

import {
  ChargeDomainMappingsDocument,
  ChargeDomainMappingsQuery,
  ChargeDomainMappingsQueryVariables,
  OrganizationChargeCatalogsDocument,
  OrganizationChargeCatalogsQuery,
  OrganizationChargeCatalogsQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function ChargeDomainMappingPage() {
  const [mappingData, catalogData] = await Promise.all([
    graphqlFetch<
      ChargeDomainMappingsQuery,
      ChargeDomainMappingsQueryVariables
    >(ChargeDomainMappingsDocument, {}),

    graphqlFetch<
      OrganizationChargeCatalogsQuery,
      OrganizationChargeCatalogsQueryVariables
    >(OrganizationChargeCatalogsDocument, {
      pagination: { page: 1, limit: 1000 },
    }),
  ]);

  if (!mappingData || !catalogData) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <DashboardLayout>
        <ChargeDomainMappingClient
          mappings={mappingData.chargeDomainMappings}
          catalogs={catalogData.organizationChargeCatalogs.items}
        />
      </DashboardLayout>
    </SessionGuard>
  );
}