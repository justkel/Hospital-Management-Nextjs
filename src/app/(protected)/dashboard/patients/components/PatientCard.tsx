import { PatientListItem } from "../PatientManagementClient";

export default function PatientCard({ patient }: { patient: PatientListItem }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-3xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-200 w-full max-w-md mx-auto sm:max-w-full">
      
      <div className="flex-1">
        {patient.fullName && (
          <h3 className="text-xl font-semibold text-gray-900">{patient.fullName}</h3>
        )}

        {patient.patientNumber && (
          <p className="text-sm text-gray-500 mt-1">{patient.patientNumber}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
          {patient.gender && (
            <p>Gender: <span className="font-medium text-gray-800">{patient.gender}</span></p>
          )}
          {patient.phoneNumber && <p>📞 {patient.phoneNumber}</p>}
          {patient.email && <p>✉️ {patient.email}</p>}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
        {patient.emergency && (
          <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
            EMERGENCY
          </span>
        )}

        {patient.status && (
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              patient.status === "ACTIVE"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {patient.status}
          </span>
        )}
      </div>
    </div>
  );
}
