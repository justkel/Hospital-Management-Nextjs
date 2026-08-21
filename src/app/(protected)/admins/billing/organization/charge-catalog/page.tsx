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

  if (itemsData.authOutcome === 'logout' || catalogData.authOutcome === 'logout') {
    const reason = itemsData.message || catalogData.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (itemsData.authOutcome === 'refresh' || catalogData.authOutcome === 'refresh') {
    return <SessionGuard mode="refresh" />;
  }

  return (
    <SessionGuard mode="none">
      <ChargeCatalogClient
        items={itemsData.data!.organizationChargeItems}
        initialCatalogs={catalogData.data!.organizationChargeCatalogs}
      />
    </SessionGuard>
  );
}