import SessionGuard from '@/components/SessionGuard';
import LabRequestManagementClient from './LabRequestManagementClient';
import {
  ChargeDomain,
  FindAllLabRequestsDocument,
  FindAllLabRequestsQuery,
  FindAllLabRequestsQueryVariables,
  CatalogsByChargeDomainDocument,
  CatalogsByChargeDomainQuery,
  CatalogsByChargeDomainQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';

export default async function LabRequestsPage() {
  const [labRequestsData, catalogsData] = await Promise.all([
    graphqlFetch<
      FindAllLabRequestsQuery,
      FindAllLabRequestsQueryVariables
    >(FindAllLabRequestsDocument, {
      pagination: {
        page: 1,
        limit: 20,
      },
    }),

    graphqlFetch<
      CatalogsByChargeDomainQuery,
      CatalogsByChargeDomainQueryVariables
    >(CatalogsByChargeDomainDocument, {
      chargeDomain: ChargeDomain.Lab,
    }),
  ]);

  if (!labRequestsData?.labRequests) {
    return <SessionGuard needsRefresh />;
  }

  return (
    <SessionGuard needsRefresh={false}>
      <LabRequestManagementClient
        paginated={labRequestsData.labRequests}
        catalogs={
          catalogsData?.catalogsByChargeDomain?.map(item => ({
            id: item.chargeCatalog.id,
            name: item.chargeCatalog.name,
            unitPrice: item.chargeCatalog.unitPrice,
            currency: item.chargeCatalog.currency,
          })) || []
        }
      />
    </SessionGuard>
  );
}