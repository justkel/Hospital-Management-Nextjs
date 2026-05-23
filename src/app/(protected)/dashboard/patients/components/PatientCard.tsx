'use client';

import { useRouter } from 'next/navigation';
import { PatientListItem } from '../PatientManagementClient';
import { Phone, Mail, Venus, Mars, CircleDot } from 'lucide-react';

const GENDER_ICON: Record<string, React.ReactNode> = {
  MALE: <Mars size={13} />,
  FEMALE: <Venus size={13} />,
};

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function PatientCard({ patient }: { patient: PatientListItem }) {
  const router = useRouter();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/dashboard/patients/${patient.id}`)}
      onKeyDown={e => e.key === 'Enter' && router.push(`/dashboard/patients/${patient.id}`)}
      className="flex cursor-pointer flex-col gap-2.5 rounded-xl border border-[#E8E6E0] bg-white p-4 transition hover:border-[#D3D1C7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.07)]"
    >
      <div className="flex items-start gap-2.5">
        <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[10px] bg-[#0c1a12] text-[13px] font-medium text-[#5DCAA5]">
          {patient.fullName ? getInitials(patient.fullName) : '?'}
        </div>

        <div className="min-w-0 flex-1">
          {patient.fullName && (
            <p className="truncate text-[14px] font-medium leading-snug text-[#2C2C2A]">
              {patient.fullName}
            </p>
          )}
          {patient.patientNumber && (
            <p className="text-[11px] tracking-[0.03em] text-[#B4B2A9]">
              {patient.patientNumber}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          {patient.emergency && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#DC2626]/25 bg-[#FEF2F2] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#DC2626]">
              <span className="h-1 w-1 rounded-full bg-[#DC2626]" />
              Emergency
            </span>
          )}
          {patient.status && (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${
              patient.status === 'ACTIVE'
                ? 'border-[#1D9E75]/25 bg-[#F0FAF5] text-[#1D9E75]'
                : 'border-[#E8E6E0] bg-[#F7F7F5] text-[#888780]'
            }`}>
              <span className="h-1 w-1 rounded-full bg-current" />
              {patient.status}
            </span>
          )}
        </div>
      </div>

      <div className="h-px bg-[#F0F0EC]" />

      <div className="flex flex-col gap-1.5">
        {patient.gender && (
          <div className="flex items-center gap-2 text-[12px] text-[#888780]">
            <span className="w-4 text-center text-[#B4B2A9]">
              {GENDER_ICON[patient.gender] ?? <CircleDot size={13} />}
            </span>
            {patient.gender.charAt(0) + patient.gender.slice(1).toLowerCase()}
          </div>
        )}
        {patient.phoneNumber && (
          <div className="flex items-center gap-2 text-[12px] text-[#888780]">
            <Phone size={12} className="w-4 flex-shrink-0 text-[#B4B2A9]" />
            <span className="truncate">{patient.phoneNumber}</span>
          </div>
        )}
        {patient.email && (
          <div className="flex items-center gap-2 text-[12px] text-[#888780]">
            <Mail size={12} className="w-4 flex-shrink-0 text-[#B4B2A9]" />
            <span className="truncate">{patient.email}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end border-t border-[#F0F0EC] pt-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-[7px] border border-[#1D9E75]/20 bg-[#F0FAF5] px-2.5 py-1.5 text-[12px] font-medium text-[#1D9E75]">
          View record →
        </span>
      </div>
    </div>
  );
}