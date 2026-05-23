/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';
import SystemInformation from '@/app/(protected)/admins/staff/components/SystemInformation';
import { Info as InfoIcon } from 'lucide-react';

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">{label}</p>
      <p className={`text-[13px] font-medium ${value ? 'text-[#2C2C2A]' : 'text-[#B4B2A9]'}`}>{value ?? '—'}</p>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  OPEN:       'bg-[#F0FAF5] text-[#1D9E75] border-[#1D9E75]/25',
  ADMITTED:   'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/25',
  DISCHARGED: 'bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]/25',
  CANCELLED:  'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/25',
  CLOSED:     'bg-[#F7F7F5] text-[#888780] border-[#E8E6E0]',
};

export default function VisitInfoSection({ visit }: any) {
  return (
    <CollapsibleSection
      title="Visit information"
      icon={<InfoIcon size={14} />}
      iconColor="blue"
      defaultOpen={false}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Visit type" value={visit.visitType?.replace(/_/g, ' ')} />

        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">Status</p>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${STATUS_STYLES[visit.status] ?? STATUS_STYLES.CLOSED}`}>
            <span className="h-1 w-1 rounded-full bg-current" />
            {visit.status}
          </span>
        </div>

        <div className="h-px bg-[#F0F0EC] sm:col-span-2" />

        <Info label="Visit date & time" value={formatDate(visit.visitDateTime)} />
        {visit.closedAt && <Info label="Closed at" value={formatDate(visit.closedAt)} />}
      </div>

      <div className="mt-4 border-t border-[#F0F0EC] pt-4">
        <SystemInformation staffId={visit.attendingStaffId} />
      </div>
    </CollapsibleSection>
  );
}