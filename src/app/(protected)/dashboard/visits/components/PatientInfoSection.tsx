/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';
import { User } from 'lucide-react';

function Info({ label, value }: any) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">{label}</p>
      <p className={`text-[13px] font-medium ${value ? 'text-[#2C2C2A]' : 'text-[#B4B2A9]'}`}>{value ?? '—'}</p>
    </div>
  );
}

export default function PatientInfoSection({ patient }: any) {
  return (
    <CollapsibleSection
      title="Patient information"
      icon={<User size={14} />}
      iconColor="teal"
    >
      <div className="flex flex-col gap-3">
        <Info label="Full name"  value={patient?.fullName} />
        <div className="h-px bg-[#F0F0EC]" />
        <Info label="Email"      value={patient?.email} />
        <div className="h-px bg-[#F0F0EC]" />
        <Info label="Phone"      value={patient?.phoneNumber} />
      </div>
    </CollapsibleSection>
  );
}