'use client';

import { useState } from 'react';

import {
  GetTheatreIncidentsQuery,
  GetTheatresQuery,
} from '@/shared/graphql/generated/graphql';

import CreateTheatreIncidentSection from './components/CreateTheatreIncidentSection';

import TheatreIncidentHistorySection from './components/TheatreIncidentHistorySection';

type Theatre =
  GetTheatresQuery['theatres']['items'][number];

export default function TheatreIncidentManagementClient({
  paginated,
  theatres,
}: {
  paginated: GetTheatreIncidentsQuery['theatreIncidents'];
  theatres: Theatre[];
}) {
  const [refreshKey, setRefreshKey] =
    useState(0);

  const triggerRefresh = () =>
    setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <CreateTheatreIncidentSection
          theatres={theatres}
          onCreated={triggerRefresh}
        />

        <TheatreIncidentHistorySection
          key={refreshKey}
          paginated={paginated}
          theatres={theatres}
        />
      </div>
    </div>
  );
}