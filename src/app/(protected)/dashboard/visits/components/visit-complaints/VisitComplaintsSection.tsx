'use client';

import { useState } from 'react';
import VisitComplaintBilling from './VisitComplaintBilling';
import VisitComplaintCreate from './VisitComplaintCreate';
import VisitComplaintList from './VisitComplaintList';

interface Props {
  visitId: string;
}

export default function VisitComplaintsSection({ visitId }: Props) {
  const [chargeEnabled, setChargeEnabled] = useState(false);
  const [chargeCatalogId, setChargeCatalogId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshComplaints = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Visit Complaints
        </h2>
      </div>

      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <VisitComplaintBilling
          visitId={visitId}
          chargeEnabled={chargeEnabled}
          chargeCatalogId={chargeCatalogId}
          setChargeEnabled={setChargeEnabled}
          setChargeCatalogId={setChargeCatalogId}
        />
      </div>

      <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-6">

        <VisitComplaintCreate
          visitId={visitId}
          onCreated={refreshComplaints}
        />

        <VisitComplaintList
          visitId={visitId}
          refreshKey={refreshKey}
        />

      </div>

    </div>
  );
}