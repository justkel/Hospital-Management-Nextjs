import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';

import VisitHeaderCard from '../components/VisitHeaderCard';
import VisitInfoSection from '../components/VisitInfoSection';
import VisitTimelineSection from '../components/VisitTimelineSection';
import PatientInfoSection from '../components/PatientInfoSection';
import VisitSummarySection from '../components/VisitSummarySection';

import CollapsibleSection from '../components/CollapsibleSection';
import VisitVitalsSection from '../components/vitals/VisitVitalsSection';
import VisitComplaintsSection from '../components/visit-complaints/VisitComplaintsSection';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VisitDetailPage({ params }: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetVisitByIdQuery,
    GetVisitByIdQueryVariables
  >(GetVisitByIdDocument, { id });

  if (!data?.visit) {
    return <SessionGuard needsRefresh />;
  }

  const visit = data.visit;

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">

          <VisitHeaderCard visit={visit} />

          <CollapsibleSection title="Visit Records">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="lg:col-span-2 space-y-6">
                <VisitInfoSection visit={visit} />
                <VisitTimelineSection visit={visit} />
              </div>

              <div className="space-y-6">
                <PatientInfoSection patient={visit.patient} />
                <VisitSummarySection visit={visit} />
              </div>

            </div>

          </CollapsibleSection>

          <VisitVitalsSection visitId={visit.id} />
          <VisitComplaintsSection visitId={visit.id} />

        </div>
      </div>
    </SessionGuard>
  );
}