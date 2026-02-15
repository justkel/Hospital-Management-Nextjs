import {
  GetPatientByIdDocument,
  GetPatientByIdQuery,
  GetPatientByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import SystemInformation from '@/app/(protected)/admins/staff/components/SystemInformation';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function calculateAge(dateOfBirth?: string | null) {
  if (!dateOfBirth) return null;

  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
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
  const age = calculateAge(patient.dateOfBirth);

  const duplicatePatients =
    patient.likelyDuplicatePatientIds?.length
      ? (
        await Promise.all(
          patient.likelyDuplicatePatientIds.map(async (dupId) => {
            const res = await graphqlFetch<
              GetPatientByIdQuery,
              GetPatientByIdQueryVariables
            >(GetPatientByIdDocument, { id: dupId });

            return res?.patientById ?? null;
          })
        )
      ).filter(
        (p): p is NonNullable<GetPatientByIdQuery['patientById']> =>
          p !== null
      )
      : [];

  return (
    <SessionGuard needsRefresh={false}>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
                {patient.fullName?.charAt(0)?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {patient.fullName}
                </h1>

                <p className="text-gray-500 mt-1">
                  Patient No: {patient.patientNumber} • Code: {patient.userCode}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {patient.emergency && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      EMERGENCY
                    </span>
                  )}

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${patient.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {patient.status}
                  </span>

                  <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                    {patient.gender}
                  </span>

                  {patient.bloodGroup && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700">
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

                <div className="grid sm:grid-cols-2 gap-6 text-sm">
                  <Info label="Date of Birth" value={patient.dateOfBirth} />
                  <Info label="Age" value={age ? `${age} years` : '—'} />
                  <Info label="Email" value={patient.email} />
                  <Info label="Phone" value={patient.phoneNumber} />
                  <Info label="Secondary Phone" value={patient.secondaryPhoneNumber} />
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Medical Information</h2>

                {patient.allergies?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 font-medium"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No recorded allergies.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Addresses</h2>

                {patient.addresses?.length ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {patient.addresses.map((addr, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-gray-50 p-4 text-sm"
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
                <Info label="Name" value={patient.nextOfKinName} />
                <Info label="Phone" value={patient.nextOfKinPhone} />
              </div>

              <SystemInformation staffId={patient.createdByStaffId} />

              {duplicatePatients.length ? (
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6">
                  <h2 className="text-lg font-semibold text-red-700 mb-3">
                    Possible Duplicates
                  </h2>
                  <ul className="text-sm text-red-800 space-y-1">
                    {duplicatePatients.map((dup, i) => (
                      <li key={i}>
                        {dup?.fullName} • Code: {dup?.userCode}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

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
