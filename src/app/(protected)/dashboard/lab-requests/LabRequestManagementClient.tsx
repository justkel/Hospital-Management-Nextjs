'use client';

import { useState } from 'react';
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
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <LabRequestSearchSection onCreated={triggerRefresh} />

        <LabRequestHistorySection
          key={refreshKey}
          paginated={paginated}
          catalogs={catalogs}
        />
      </div>
    </div>
  );
}