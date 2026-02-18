import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
  VisitStatus,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import Link from 'next/link';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date?: string | null) {
  if (!date) return '—';
  return new Date(date).toLocaleString();
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
  const patient = visit.patient;

  const isClosed = !!visit.closedAt;

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                {patient?.fullName?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Visit Details
                </h1>

                <div className="flex flex-wrap gap-2 mt-3">

                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {visit.visitType}
                  </span>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      visit.status === VisitStatus.Open
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {visit.status}
                  </span>

                  {isClosed && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      CLOSED
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/patients/${patient?.id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              View Patient
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Visit Information
                </h2>

                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <Info label="Visit Type" value={visit.visitType} />
                  <Info label="Status" value={visit.status} />
                  <Info
                    label="Visit Date & Time"
                    value={formatDate(visit.visitDateTime)}
                  />
                  <Info
                    label="Closed At"
                    value={formatDate(visit.closedAt)}
                  />
                  <Info
                    label="Attending Staff ID"
                    value={visit.attendingStaffId}
                  />
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">
                  Visit Timeline
                </h2>

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
              </div>
            </div>

            <div className="space-y-6">

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Patient Information
                </h2>

                <Info label="Full Name" value={patient?.fullName} />
                <Info label="Email" value={patient?.email} />
                <Info label="Phone" value={patient?.phoneNumber} />
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                <h2 className="text-lg font-semibold text-indigo-700 mb-2">
                  Visit Summary
                </h2>

                <p className="text-sm text-indigo-900">
                  This visit is currently{' '}
                  <span className="font-semibold">{visit.status}</span>.
                </p>

                {isClosed && (
                  <p className="text-sm text-indigo-900 mt-2">
                    Closed on {formatDate(visit.closedAt)}.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SessionGuard>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Info({ label, value }: { label: string; value?: any }) {
  return (
    <div className="text-sm">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  );
}

function TimelineItem({
  title,
  time,
}: {
  title: string;
  time: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -left-6.25 top-1.5 md:top-0.5 h-2 w-2 md:w-4 md:h-4 rounded-full bg-indigo-600"></div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  );
}
