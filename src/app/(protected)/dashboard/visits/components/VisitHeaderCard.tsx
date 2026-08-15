import Link from 'next/link';
import { GetVisitByIdQuery } from '@/shared/graphql/generated/graphql';
import { User, Stethoscope, DoorClosedLockedIcon } from 'lucide-react';

type Visit = GetVisitByIdQuery['visit'];

const STATUS_DARK: Record<string, string> = {
  OPEN: 'bg-[#F0FAF5] text-[#1D9E75] border-[#1D9E75]/30',
  ADMITTED: 'bg-[#EFF6FF]/90 text-[#2563EB] border-[#2563EB]/25',
  DISCHARGED: 'bg-[#F5F3FF]/90 text-[#7C3AED] border-[#7C3AED]/25',
  CANCELLED: 'bg-[#DC2626]/15 text-[#FDA9A9] border-[#DC2626]/30',
  CLOSED: 'bg-white/[0.07] text-[#5a7a6a] border-white/10',
};

function DarkBadge({ label, styles }: { label: string; styles: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${styles}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function VisitHeaderCard({ visit }: { visit: Visit }) {
  const patient = visit.patient;
  const initial = patient?.fullName?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-6 sm:px-8">
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#1D9E75]/15 blur-[50px]" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-[12px] border border-[#5DCAA5]/30 bg-[#1D9E75]/18 text-[20px] font-medium text-[#5DCAA5]">
            {initial}
          </div>
          <div>
            <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-[#3B6D11]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D9E75]" />
              Visit details
            </div>
            <h1 className="mb-2.5 text-[18px] font-medium tracking-[-0.02em] text-white">
              {patient?.fullName ?? 'Visit Details'}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.07] px-2.5 py-0.5 text-[10px] uppercase tracking-[0.06em] text-[#8ba0b8]">
                <Stethoscope size={10} />
                {visit.visitType?.replace(/_/g, ' ')}
              </span>
              <DarkBadge
                label={visit.status}
                styles={STATUS_DARK[visit.status] ?? STATUS_DARK.CLOSED}
              />
            </div>
          </div>
        </div>

        <Link
          href={`/dashboard/patients/${patient?.id}`}
          className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-white/12 bg-white/[0.07] px-4 text-[13px] font-medium text-[#c8d8e8] transition hover:bg-white/[0.12]"
        >
          <User size={13} />
          View patient
        </Link>
      </div>
    </div>
  );
}