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
import VisitDiagnosisSection from '../components/visit-diagnoses/VisitDiagnosisSection';
import VisitPrescriptionsSection from '../components/visit-prescriptions/VisitPrescriptionsSection';
import Link from 'next/link';
import { ClipboardList } from 'lucide-react';

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                Visit Workspace
              </h2>
              <p className="text-lg font-bold text-slate-900">
                Manage everything related to this visit
              </p>
            </div>

            <Link
              href={`/dashboard/visits/${visit.id}/procedures`}
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold !text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/20 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/15 group-hover:bg-white/20 transition">
                <ClipboardList size={16} />
              </span>

              View Procedures
              <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition" />
            </Link>

          </div>
          <VisitHeaderCard visit={visit} />

          <CollapsibleSection title="Visit Records" defaultOpen={false}>

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
          <VisitDiagnosisSection visitId={visit.id} />
          <VisitPrescriptionsSection visitId={visit.id} />

        </div>
      </div>
    </SessionGuard>
  );
}