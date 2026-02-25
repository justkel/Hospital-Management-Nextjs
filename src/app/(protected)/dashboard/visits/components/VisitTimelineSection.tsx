/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString();
}

function TimelineItem({ title, time }: any) {
  return (
    <div className="relative">
      <div className="absolute -left-6.25 top-1.5 md:top-0.5 h-2 w-2 md:w-4 md:h-4 rounded-full bg-indigo-600"></div>

      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  );
}

export default function VisitTimelineSection({ visit }: any) {
  return (
    <CollapsibleSection title="Visit Timeline">
      <div className="relative pl-6 space-y-6">

        <TimelineItem
          title="Visit Created"
          time={formatDate(visit.visitDateTime)}
        />

        {visit.closedAt && (
          <TimelineItem
            title="Visit Closed"
            time={formatDate(visit.closedAt)}
          />
        )}

      </div>
    </CollapsibleSection>
  );
}