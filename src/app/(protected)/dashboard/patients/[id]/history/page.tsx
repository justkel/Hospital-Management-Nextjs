import {
  GetPatientByIdDocument,
  GetPatientByIdQuery,
  GetPatientByIdQueryVariables,
  GetPatientVisitHistoryDocument,
  GetPatientVisitHistoryQuery,
  GetPatientVisitHistoryQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarClock,
  Stethoscope,
  Inbox,
  ChevronRight,
} from 'lucide-react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

type Visit = NonNullable<
  GetPatientVisitHistoryQuery['patientVisitHistory']
>[number];

function formatDateTime(value?: string | null) {
  if (!value) return { date: '—', time: '' };

  const d = new Date(value);

  if (Number.isNaN(d.getTime())) {
    return { date: '—', time: '' };
  }

  return {
    date: d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: 'border-[#1D9E75]/30 bg-[#F0FAF5] text-[#1D9E75]',
  SCHEDULED: 'border-[#2563EB]/25 bg-[#EFF6FF] text-[#2563EB]',
  IN_PROGRESS: 'border-[#D97706]/25 bg-[#FFFBEB] text-[#D97706]',
  CANCELLED: 'border-[#DC2626]/25 bg-[#FEF2F2] text-[#DC2626]',
  NO_SHOW: 'border-[#8ba0b8]/25 bg-[#F7F7F5] text-[#5a7a6a]',
};

function StatusBadge({ status }: { status?: string | null }) {
  const key = (status ?? '').toString().toUpperCase();

  const style =
    STATUS_STYLES[key] ??
    'border-[#E8E6E0] bg-[#F7F7F5] text-[#5F5E5A]';

  return (
    <span
      className={`inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] ${style}`}
    >
      <span className="h-1 w-1 rounded-full bg-current" />
      {status ? status.toString().replace(/_/g, ' ') : 'Unknown'}
    </span>
  );
}

function VisitTypeBadge({ type }: { type?: string | null }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-[#E8E6E0] bg-white px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[#5F5E5A]">
      {type ? type.toString().replace(/_/g, ' ') : '—'}
    </span>
  );
}

export default async function PatientVisitHistoryPage({ params }: Props) {
  const { id } = await params;

  const [patientRes, visitsRes] = await Promise.all([
    graphqlFetch<GetPatientByIdQuery, GetPatientByIdQueryVariables>(
      GetPatientByIdDocument,
      { id }
    ),

    graphqlFetch<
      GetPatientVisitHistoryQuery,
      GetPatientVisitHistoryQueryVariables
    >(GetPatientVisitHistoryDocument, {
      patientId: id,
    }),
  ]);

  if (
    patientRes.authOutcome === 'logout' ||
    visitsRes.authOutcome === 'logout'
  ) {
    const reason = patientRes.message || visitsRes.message;
    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    patientRes.authOutcome === 'refresh' ||
    visitsRes.authOutcome === 'refresh' ||
    !patientRes.data?.patientById ||
    !visitsRes.data?.patientVisitHistory
  ) {
    return <SessionGuard mode="refresh" />;
  }

  const patient = patientRes.data!.patientById;

  const visits = (visitsRes.data!.patientVisitHistory ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b?.visitDateTime ?? 0).getTime() -
        new Date(a?.visitDateTime ?? 0).getTime()
    );

  return (
    <SessionGuard mode="none">
      <div className="flex flex-col gap-4">
        <div>
          <Link
            href={`/dashboard/patients/${id}`}
            className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium !text-[#5F5E5A] transition-colors hover:text-[#2C2C2A]"
          >
            <ArrowLeft size={14} />
            Back to patient
          </Link>

          <div className="relative overflow-hidden rounded-xl bg-[#0c1a12] px-6 py-6 sm:px-8">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#1D9E75]/15 blur-[50px]" />

            <div className="relative z-10 flex flex-wrap items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[12px] border border-[#5DCAA5]/30 bg-[#1D9E75]/18 text-[22px] font-medium text-[#5DCAA5]">
                {patient.fullName?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h1 className="mb-1 text-[18px] font-medium tracking-[-0.02em] !text-white">
                  {patient.fullName}
                </h1>
                <p className="text-[12px] text-[#5a7a6a]">
                  Visit history&nbsp;&nbsp;·&nbsp;&nbsp;{patient.patientNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white">
          <div className="flex items-center justify-between gap-2.5 border-b border-[#E8E6E0] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#F0FAF5] text-[#1D9E75]">
                <CalendarClock size={14} />
              </div>

              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#B4B2A9]">
                All visits
              </span>
            </div>

            <span className="text-[11px] font-medium text-[#B4B2A9]">
              {visits.length} {visits.length === 1 ? 'visit' : 'visits'}
            </span>
          </div>

          {visits.length ? (
            <div className="divide-y divide-[#F0F0EC]">
              {visits.map((visit) => (
                <VisitRow key={visit?.id} visit={visit as Visit} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F7F5] text-[#B4B2A9]">
                <Inbox size={18} />
              </div>

              <p className="text-[13px] font-medium text-[#5F5E5A]">
                No visits recorded yet
              </p>

              <p className="text-[12px] text-[#B4B2A9]">
                Visits created for this patient will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </SessionGuard>
  );
}

function VisitRow({ visit }: { visit: Visit }) {
  const { date, time } = formatDateTime(visit?.visitDateTime);

  return (
    <Link
      href={`/dashboard/visits/${visit?.id}`}
      className="flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-[#FAFAF8] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] border border-[#E8E6E0] bg-[#F7F7F5]">
          <CalendarClock size={14} className="text-[#5F5E5A]" />
        </div>

        <div>
          <p className="text-[13px] font-medium text-[#2C2C2A]">{date}</p>
          <p className="text-[11px] text-[#B4B2A9]">{time}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <VisitTypeBadge type={visit?.visitType} />
        <StatusBadge status={visit?.status} />

        {visit?.attendingStaffId && (
          <span className="inline-flex w-fit items-center gap-1 rounded-full border border-[#E8E6E0] bg-[#F7F7F5] px-2.5 py-0.5 text-[10px] font-medium text-[#5F5E5A]">
            <Stethoscope size={11} />
            Staff #{visit.attendingStaffId.slice(0, 8)}
          </span>
        )}

        <ChevronRight
          size={14}
          className="ml-0.5 hidden text-[#B4B2A9] sm:block"
        />
      </div>
    </Link>
  );
}