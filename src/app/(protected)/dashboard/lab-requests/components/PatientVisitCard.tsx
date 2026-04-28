'use client';

import { useMemo, useState } from 'react';
import {
  UserOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import LabRequestSelector from './LabRequestSelector';
import { VisitStatus } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';

export default function PatientVisitCard({
  patient,
  visits,
  catalogs,
  onCreated,
}: any) {
  const [showSelector, setShowSelector] = useState(false);
  const [visible, setVisible] = useState(true);
  const [selectorKey, setSelectorKey] = useState(0);

  const openVisit = useMemo(
    () => visits.find((v: any) => v.status === VisitStatus.Open),
    [visits]
  );

  const canSelectLabRequest = !!openVisit;

  const handleClose = () => {
    setShowSelector(false);
    setSelectorKey(prev => prev + 1);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 animate-fade-in">
      <button
        onClick={handleClose}
        className="
          absolute top-0 right-0
          w-10 h-10 rounded-full
          bg-gray-100 hover:bg-red-50
          flex items-center justify-center
          transition group
        "
      >
        <CloseOutlined className="text-gray-500 group-hover:text-red-500 transition" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <UserOutlined className="text-2xl text-green-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{patient.fullName}</h2>
            <p className="text-gray-500">User Code: {patient.userCode}</p>
          </div>
        </div>

        <button
          disabled={!canSelectLabRequest}
          onClick={() => setShowSelector(prev => !prev)}
          className="
            px-6 py-3 rounded-xl bg-green-700 text-white! font-medium
            hover:bg-green-800 disabled:bg-gray-300 transition
          "
        >
          <ExperimentOutlined className="mr-2" />
          Select Lab Request
        </button>
      </div>

      {!canSelectLabRequest && (
        <p className="text-sm text-red-500 mt-3">
          No OPEN visit available for lab requests.
        </p>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Available Visits</h3>

        <div className="grid gap-4">
          {visits.map((v: any) => (
            <div
              key={v.id}
              className="border border-gray-200 rounded-2xl p-5 bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                  <p className="font-semibold text-lg">{v.visitType}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {v.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <CalendarOutlined />
                  {formatDateTime(v.visitDateTime)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showSelector && openVisit && (
        <LabRequestSelector
          key={selectorKey}
          catalogs={catalogs}
          visitId={openVisit.id}
          onCreated={onCreated}
        />
      )}
    </div>
  );
}