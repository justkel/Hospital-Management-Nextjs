'use client';

import { useState } from 'react';

import {
  GetWardIncidentsQuery,
  GetWardsQuery,
} from '@/shared/graphql/generated/graphql';

import CreateWardIncidentSection from './components/CreateWardIncidentSection';

import WardIncidentHistorySection from './components/WardIncidentHistorySection';

type Ward =
  GetWardsQuery['wards']['items'][number];

export default function WardIncidentManagementClient({
  paginated,
  wards,
}: {
  paginated: GetWardIncidentsQuery['wardIncidents'];
  wards: Ward[];
}) {
  const [refreshKey, setRefreshKey] =
    useState(0);

  const triggerRefresh = () =>
    setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <CreateWardIncidentSection
          wards={wards}
          onCreated={triggerRefresh}
        />

        <WardIncidentHistorySection
          key={refreshKey}
          paginated={paginated}
          wards={wards}
        />
      </div>
    </div>
  );
}