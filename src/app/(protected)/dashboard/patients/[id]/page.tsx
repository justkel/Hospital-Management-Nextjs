import {
  GetPatientByIdDocument,
  GetPatientByIdQuery,
  GetPatientByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetPatientByIdQuery,
    GetPatientByIdQueryVariables
  >(GetPatientByIdDocument, { id });

  if (!data?.patientById) {
    return <SessionGuard needsRefresh />;
  }

  const patient = data.patientById;

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
                {patient.fullName?.charAt(0)}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {patient.fullName}
                </h1>
                <p className="text-gray-500 mt-1">
                  Patient No: {patient.patientNumber}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {patient.emergency && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      EMERGENCY
                    </span>
                  )}

                  {patient.status && (
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        patient.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {patient.status}
                    </span>
                  )}

                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {patient.gender}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {patient.email ?? '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {patient.phoneNumber ?? '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Addresses</h2>

                {patient.addresses?.length ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {patient.addresses.map((addr, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border bg-gray-50 p-4 text-sm"
                      >
                        <p className="font-medium">{addr?.addressLine1}</p>
                        <p className="text-gray-600">{addr?.city}</p>
                        <p className="text-gray-600">{addr?.state}</p>
                        <p className="text-gray-600">{addr?.country}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No addresses recorded.
                  </p>
                )}
              </div>

              {patient.extraDetails && (
                <div className="bg-white rounded-3xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-3">
                    Additional Details
                  </h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {patient.extraDetails}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Next of Kin</h2>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {patient.nextOfKinName ?? '—'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {patient.nextOfKinPhone ?? '—'}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </SessionGuard>
  );
}
