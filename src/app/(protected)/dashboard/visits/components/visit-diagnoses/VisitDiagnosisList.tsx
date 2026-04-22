'use client';

import { Pencil } from 'lucide-react';
import { VisitDiagnosesQuery } from '@/shared/graphql/generated/graphql';

interface Props {
  diagnoses: VisitDiagnosesQuery['visitDiagnoses'];
  loading: boolean;
  onEdit: (d: VisitDiagnosesQuery['visitDiagnoses'][0]) => void;
}

export default function VisitDiagnosisList({
  diagnoses,
  loading,
  onEdit,
}: Props) {
  if (loading) return <p>Loading diagnoses...</p>;

  if (!diagnoses.length) {
    return <p className="text-gray-400">No diagnoses yet.</p>;
  }

  return (
    <div className="space-y-4">
      {diagnoses.map(d => (
        <div
          key={d.id}
          className="p-4 border rounded-xl flex justify-between"
        >
          <div>
            <p className="font-medium">{d.diagnosis}</p>
            <p className="text-sm text-gray-500">{d.diagnosisCode}</p>
            <p className="text-sm text-gray-400">{d.notes}</p>
          </div>

          <button onClick={() => onEdit(d)}>
            <Pencil size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}