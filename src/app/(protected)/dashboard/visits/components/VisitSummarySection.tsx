/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';
import { FileText } from 'lucide-react';

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

const STATUS_STYLES: Record<string, string> = {
  OPEN:       'bg-[#F0FAF5] text-[#1D9E75] border-[#1D9E75]/25',
  ADMITTED:   'bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/25',
  DISCHARGED: 'bg-[#F5F3FF] text-[#7C3AED] border-[#7C3AED]/25',
  CANCELLED:  'bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/25',
  CLOSED:     'bg-[#F7F7F5] text-[#888780] border-[#E8E6E0]',
};

export default function VisitSummarySection({ visit }: any) {
  const isClosed = !!visit.closedAt;

  return (
    <CollapsibleSection
      title="Visit summary"
      icon={<FileText size={14} />}
      iconColor="amber"
      defaultOpen
    >
      <p className="text-[13px] leading-relaxed text-[#5F5E5A]">
        This visit is currently{' '}
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-px text-[10px] font-medium uppercase tracking-[0.06em] ${STATUS_STYLES[visit.status] ?? STATUS_STYLES.CLOSED}`}>
          <span className="h-1 w-1 rounded-full bg-current" />
          {visit.status}
        </span>
        .
      </p>
      {isClosed && (
        <p className="mt-2 text-[13px] leading-relaxed text-[#5F5E5A]">
          Closed on <span className="font-medium text-[#2C2C2A]">{formatDate(visit.closedAt)}</span>.
        </p>
      )}
    </CollapsibleSection>
  );
}