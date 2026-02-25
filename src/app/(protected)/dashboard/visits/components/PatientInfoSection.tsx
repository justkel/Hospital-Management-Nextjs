/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';

function Info({ label, value }: any) {
  return (
    <div className="text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

export default function PatientInfoSection({ patient }: any) {
  return (
    <CollapsibleSection title="Patient Information">
      <Info label="Full Name" value={patient?.fullName} />
      <Info label="Email" value={patient?.email} />
      <Info label="Phone" value={patient?.phoneNumber} />
    </CollapsibleSection>
  );
}