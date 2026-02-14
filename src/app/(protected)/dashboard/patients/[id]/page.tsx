import {
  GetPatientByIdDocument,
  GetPatientByIdQuery,
  GetPatientByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';

interface Props {
  params: {
    id: string;
  };
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  const data = await graphqlFetch<
    GetPatientByIdQuery,
    GetPatientByIdQueryVariables
  >(GetPatientByIdDocument, {
    id,
  });

  if (!data?.patientById) {
    return <SessionGuard needsRefresh />;
  }

  const patient = data.patientById;

  return (
    <SessionGuard needsRefresh={false}>
      <div className="p-6 md:p-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{patient.fullName}</h1>
          <p className="text-gray-500 mt-1">
            Patient No: {patient.patientNumber}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6 space-y-3">
            <h2 className="font-semibold text-lg">Basic Info</h2>
            <p><strong>Email:</strong> {patient.email ?? '—'}</p>
            <p><strong>Phone:</strong> {patient.phoneNumber ?? '—'}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Status:</strong> {patient.status}</p>
            <p><strong>Emergency:</strong> {patient.emergency ? 'Yes' : 'No'}</p>
          </div>

          <div className="rounded-2xl border p-6 space-y-3">
            <h2 className="font-semibold text-lg">Next of Kin</h2>
            <p><strong>Name:</strong> {patient.nextOfKinName ?? '—'}</p>
            <p><strong>Phone:</strong> {patient.nextOfKinPhone ?? '—'}</p>
          </div>
        </div>

        <div className="rounded-2xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Addresses</h2>

          {patient.addresses?.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {patient.addresses.map((addr, i) => (
                <div key={i} className="border rounded-xl p-4">
                  <p>{addr?.addressLine1}</p>
                  <p>{addr?.city}</p>
                  <p>{addr?.state}</p>
                  <p>{addr?.country}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No addresses recorded.</p>
          )}
        </div>

        {patient.extraDetails && (
          <div className="rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-2">Additional Details</h2>
            <p>{patient.extraDetails}</p>
          </div>
        )}
      </div>
    </SessionGuard>
  );
}
