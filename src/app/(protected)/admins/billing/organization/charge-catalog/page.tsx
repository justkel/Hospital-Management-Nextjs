import SessionGuard from '@/components/SessionGuard';
import ChargeCatalogClient from './ChargeCatalogClient';
import { graphqlFetch } from '@/shared/graphql/fetcher';

import {
  OrganizationChargeItemsDocument,
  OrganizationChargeItemsQuery,
  OrganizationChargeItemsQueryVariables,
  OrganizationChargeCatalogsDocument,
  OrganizationChargeCatalogsQuery,
  OrganizationChargeCatalogsQueryVariables,
} from '@/shared/graphql/generated/graphql';

export default async function ChargeCatalogPage() {
  const [itemsData, catalogData] = await Promise.all([
    graphqlFetch<
      OrganizationChargeItemsQuery,
      OrganizationChargeItemsQueryVariables
    >(OrganizationChargeItemsDocument, {}),

    graphqlFetch<
      OrganizationChargeCatalogsQuery,
      OrganizationChargeCatalogsQueryVariables
    >(OrganizationChargeCatalogsDocument, {
      pagination: { page: 1, limit: 10 },
    }),
  ]);

  if (!itemsData || !catalogData) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <ChargeCatalogClient
        items={itemsData.organizationChargeItems}
        initialCatalogs={catalogData.organizationChargeCatalogs}
      />
    </SessionGuard>
  );
}