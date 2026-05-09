'use client';

import { useState } from 'react';

import { GetWardsQuery } from '@/shared/graphql/generated/graphql';

import CreateWardSection from './components/CreateWardSection';
import WardHistorySection from './components/WardHistorySection';

export default function WardManagementClient({
  paginated,
}: {
  paginated: GetWardsQuery['wards'];
}) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <CreateWardSection onCreated={triggerRefresh} />

        <WardHistorySection
          key={refreshKey}
          paginated={paginated}
        />
      </div>
    </div>
  );
}