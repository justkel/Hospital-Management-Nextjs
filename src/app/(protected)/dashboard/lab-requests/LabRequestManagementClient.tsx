'use client';

import {
  FindAllLabRequestsQuery,
} from '@/shared/graphql/generated/graphql';
import LabRequestSearchSection from './components/LabRequestSearchSection';
import LabRequestHistorySection from './components/LabRequestHistorySection';
import { ChargeCatalogOption } from '@/hooks/billing/useBilling';

export default function LabRequestManagementClient({
  paginated,
  catalogs,
}: {
  paginated: FindAllLabRequestsQuery['labRequests'];
  catalogs: ChargeCatalogOption[];
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <LabRequestSearchSection />

        <LabRequestHistorySection paginated={paginated} catalogs={catalogs} />
      </div>
    </div>
  );
}