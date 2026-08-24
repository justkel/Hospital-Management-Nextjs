import SessionGuard from '@/components/SessionGuard';
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

  if (
    mappingData.authOutcome === 'logout' ||
    catalogData.authOutcome === 'logout'
  ) {
    const reason = mappingData.message || catalogData.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    mappingData.authOutcome === 'refresh' ||
    catalogData.authOutcome === 'refresh' ||
    !mappingData.data?.chargeDomainMappings ||
    !catalogData.data?.organizationChargeCatalogs
  ) {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <ChargeDomainMappingClient
        mappings={mappingData.data.chargeDomainMappings}
        catalogs={catalogData.data.organizationChargeCatalogs.items}
      />
    </SessionGuard>
  );
}