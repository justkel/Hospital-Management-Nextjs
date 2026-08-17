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
import VisitBedAllocationSection from '../components/visit-bed-allocation/VisitBedAllocationsSection';
import VisitTasksSection from '../components/visit-tasks/VisitTasksSection';
import VisitNoteBoard from '../components/visit-note-positions/VisitNoteBoard';
import Link from 'next/link';
import { ClipboardList, FlaskConical, Receipt } from 'lucide-react';
import VisitOtherChargeSection from '../components/VisitOtherChargeSection';
import CloseVisitButton from '../components/CloseVisitButton';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

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
      <div className="relative min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E8E6E0] bg-white px-5 py-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#B4B2A9]">
                Visit workspace
              </p>
              <p className="mt-0.5 text-[14px] font-medium text-[#2C2C2A]">
                Manage everything related to this visit
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR, Roles.NURSE]}>
                <CloseVisitButton visitId={visit.id} status={visit.status} />
              </HasRoles>

              <Link
                href={`/dashboard/visits/${visit.id}/procedures`}
                className="inline-flex h-[38px] items-center gap-2.5 rounded-[9px] bg-[#0c1a12] px-4 text-[13px] font-medium text-white transition hover:bg-[#1D9E75]"
              >
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-white/12">
                  <ClipboardList size={13} />
                </div>
                View procedures
              </Link>

              <Link
                href={`/dashboard/visits/${visit.id}/lab-requests`}
                className="inline-flex h-[38px] items-center gap-2.5 rounded-[9px] border border-[#E8E6E0] bg-white px-4 text-[13px] font-medium text-[#2C2C2A] transition hover:border-[#1D9E75]/30 hover:bg-[#F0FAF5] hover:text-[#1D9E75]"
              >
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#F0FAF5] text-[#1D9E75]">
                  <FlaskConical size={13} />
                </div>
                View lab requests
              </Link>

              <Link
                href={`/dashboard/visits/${visit.id}/billing`}
                className="inline-flex h-[38px] items-center gap-2.5 rounded-[9px] border border-[#E8E6E0] bg-white px-4 text-[13px] font-medium text-[#2C2C2A] transition hover:border-[#1D9E75]/30 hover:bg-[#F0FAF5] hover:text-[#1D9E75]"
              >
                <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#F0FAF5] text-[#1D9E75]">
                  <Receipt size={13} />
                </div>
                View billing
              </Link>
            </div>
          </div>
          <VisitHeaderCard visit={visit} />

          <CollapsibleSection
            title="Visit records"
            icon={<ClipboardList size={14} />}
            iconColor="teal"
            defaultOpen={false}
          >
            <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3">
              <div className="flex flex-col gap-3 lg:col-span-2">
                <VisitInfoSection visit={visit} />
                <VisitTimelineSection visit={visit} />
              </div>
              <div className="flex flex-col gap-3">
                <PatientInfoSection patient={visit.patient} />
                <VisitSummarySection visit={visit} />
              </div>
            </div>
          </CollapsibleSection>

          <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR, Roles.NURSE]}>
            <VisitVitalsSection visitId={visit.id} />
            <VisitComplaintsSection visitId={visit.id} />
            <VisitDiagnosisSection visitId={visit.id} />
            <VisitPrescriptionsSection visitId={visit.id} />
            <VisitBedAllocationSection visitId={visit.id} />
            <VisitTasksSection visitId={visit.id} />
          </HasRoles>

          <VisitOtherChargeSection visitId={visit.id} />

        </div>

        <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR, Roles.NURSE]}>
          <VisitNoteBoard visitId={visit.id} />
        </HasRoles>
      </div>
    </SessionGuard>
  );
}