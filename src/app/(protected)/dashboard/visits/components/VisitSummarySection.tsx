/* eslint-disable @typescript-eslint/no-explicit-any */
import CollapsibleSection from './CollapsibleSection';

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString();
}

export default function VisitSummarySection({ visit }: any) {
  const isClosed = !!visit.closedAt;

  return (
    <CollapsibleSection title="Visit Summary" defaultOpen>
      <p className="text-sm text-gray-700">
        This visit is currently{' '}
        <span className="font-semibold">{visit.status}</span>.
      </p>

      {isClosed && (
        <p className="text-sm text-gray-700 mt-2">
          Closed on {formatDate(visit.closedAt)}.
        </p>
      )}
    </CollapsibleSection>
  );
}