import CollapsibleSection from './CollapsibleSection';
import { GitBranch } from 'lucide-react';
import { GetVisitByIdQuery } from '@/shared/graphql/generated/graphql';

type Visit = GetVisitByIdQuery['visit'];

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  });
}

function TimelineItem({ title, time, variant = 'default' }: { title: string; time: string; variant?: 'default' | 'closed' }) {
  return (
    <div className="relative pb-4 last:pb-0">
      <span className={`absolute -left-[17px] top-1 flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 bg-white ${
        variant === 'closed' ? 'border-[#DC2626]' : 'border-[#1D9E75]'
      }`} />
      <p className="text-[13px] font-medium text-[#2C2C2A]">{title}</p>
      <p className="mt-0.5 text-[11px] text-[#B4B2A9]">{time}</p>
    </div>
  );
}

export default function VisitTimelineSection({ visit }: { visit: Visit }) {
  return (
    <CollapsibleSection
      title="Visit events"
      icon={<GitBranch size={14} />}
      iconColor="purple"
    >
      <div className="relative border-l border-[#E8E6E0] pl-5">
        <TimelineItem title="Visit created" time={formatDate(visit.visitDateTime)} />
        {visit.closedAt && (
          <TimelineItem title="Visit closed" time={formatDate(visit.closedAt)} variant="closed" />
        )}
      </div>
    </CollapsibleSection>
  );
}