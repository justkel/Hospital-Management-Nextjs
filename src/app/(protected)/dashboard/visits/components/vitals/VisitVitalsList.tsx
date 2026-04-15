'use client';

import { VisitVital } from "./VisitVitalsSection";
import { Pencil } from 'lucide-react';

interface Props {
  vitals: VisitVital[];
  loading: boolean;
  onEdit: (vital: VisitVital) => void;
}

export default function VisitVitalsList({
  vitals,
  loading,
  onEdit,
}: Props) {
  return (
    <div className="space-y-4">
      {loading && (
        <p className="text-sm text-gray-500">Loading vitals...</p>
      )}

      {!loading && vitals.length === 0 && (
        <p className="text-sm text-gray-400">
          No vitals recorded yet.
        </p>
      )}

      {vitals.map(vital => (
        <div
          key={vital.id}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
        >
          <div>Temp: {vital.temperature ?? '—'}</div>
          <div>BP: {vital.bloodPressure ?? '—'}</div>
          <div>HR: {vital.heartRate ?? '—'}</div>
          <div>RR: {vital.respiratoryRate ?? '—'}</div>
          <div>SpO2: {vital.spo2 ?? '—'}</div>
          <div>Weight: {vital.weight ?? '—'}</div>
          <div>Height: {vital.height ?? '—'}</div>

          <div className="col-span-2 md:col-span-4 flex justify-end">
            <button
              onClick={() => onEdit(vital)}
              className="text-sm text-indigo-600 hover:underline cursor-pointer"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}