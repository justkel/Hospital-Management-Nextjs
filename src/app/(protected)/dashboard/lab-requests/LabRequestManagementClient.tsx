'use client';

import {
  FindAllLabRequestsQuery,
} from '@/shared/graphql/generated/graphql';
import LabRequestSearchSection from './components/LabRequestSearchSection';
import LabRequestHistorySection from './components/LabRequestHistorySection';

export default function LabRequestManagementClient({
  paginated,
}: {
  paginated: FindAllLabRequestsQuery['labRequests'];
}) {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <LabRequestSearchSection />

        <LabRequestHistorySection paginated={paginated} />
      </div>
    </div>
  );
}