/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { VisitStatus } from '@/shared/graphql/generated/graphql';

function VisitHeaderCard({ visit }: any) {
  const patient = visit.patient;
  const isClosed = !!visit.closedAt;

  return (
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
  );
}

export default VisitHeaderCard;