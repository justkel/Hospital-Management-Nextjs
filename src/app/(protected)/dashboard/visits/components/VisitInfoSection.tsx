/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';
import SystemInformation from '@/app/(protected)/admins/staff/components/SystemInformation';

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString();
}

function Info({ label, value }: any) {
  return (
    <div className="text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function VisitInfoSection({ visit }: any) {
  return (
    <CollapsibleSection title="Visit Information">
      <div className="grid sm:grid-cols-2 gap-6 text-sm">

        <Info label="Visit Type" value={visit.visitType} />
        <Info label="Status" value={visit.status} />
        <Info
          label="Visit Date & Time"
          value={formatDate(visit.visitDateTime)}
        />

        {visit.closedAt && (
          <Info label="Closed At" value={formatDate(visit.closedAt)} />
        )}

        <SystemInformation staffId={visit.attendingStaffId} />

      </div>
    </CollapsibleSection>
  );
}