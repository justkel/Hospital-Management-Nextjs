import {
  GetPatientByIdDocument,
  GetPatientByIdQuery,
  GetPatientByIdQueryVariables,
  GetPatientWalletBalanceDocument,
  GetPatientWalletBalanceQuery,
  GetPatientWalletBalanceQueryVariables,
  PatientStatus,
} from '@/shared/graphql/generated/graphql';
import { graphqlFetch } from '@/shared/graphql/fetcher';
import SessionGuard from '@/components/SessionGuard';
import SystemInformation from '@/app/(protected)/admins/staff/components/SystemInformation';
import EditPatientButton from '../components/EditPatientButton';
import CreateVisitModal from '../components/CreateVisitModal';
import Link from 'next/link';
import { AlertTriangle, UserX, History, Wallet } from 'lucide-react';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

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

function formatWalletBalance(amount: number) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export default async function PatientDetailPage({ params }: Props) {
  const { id } = await params;

  const [patientRes, walletBalanceRes] = await Promise.all([
    graphqlFetch<GetPatientByIdQuery, GetPatientByIdQueryVariables>(
      GetPatientByIdDocument,
      { id }
    ),
    graphqlFetch<
      GetPatientWalletBalanceQuery,
      GetPatientWalletBalanceQueryVariables
    >(GetPatientWalletBalanceDocument, { patientId: id }),
  ]);

  if (
    patientRes.authOutcome === 'logout' ||
    walletBalanceRes.authOutcome === 'logout'
  ) {
    const reason = patientRes.message || walletBalanceRes.message;

    return <SessionGuard mode="logout" reason={reason} />;
  }

  if (
    patientRes.authOutcome === 'refresh' ||
    walletBalanceRes.authOutcome === 'refresh' ||
    !patientRes.data?.patientById
  ) {
    return <SessionGuard mode="refresh" />;
  }

  if (!patientRes.data?.patientById) {
    return <SessionGuard mode="none" />;
  }

  const patient = patientRes.data.patientById;

  const age = calculateAge(patient.dateOfBirth);
  const walletBalance =
    walletBalanceRes.data?.patientWalletBalance ?? 0;

  const duplicatePatients =
    patient.likelyDuplicatePatientIds?.length
      ? (
        await Promise.all(
          patient.likelyDuplicatePatientIds.map(async (dupId) => {
            const res = await graphqlFetch<
              GetPatientByIdQuery,
              GetPatientByIdQueryVariables
            >(GetPatientByIdDocument, { id: dupId });

            return res.data?.patientById ?? null;
          })
        )
      ).filter(
        (p): p is NonNullable<GetPatientByIdQuery['patientById']> =>
          p !== null
      )
      : [];

  return (
    <SessionGuard mode="none">
      <div className="flex flex-col gap-4">
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

          <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border !border-[#5DCAA5]/30 !bg-[#1D9E75]/18 text-lg font-medium !text-[#5DCAA5] sm:h-14 sm:w-14 sm:text-[22px]">
                {patient.fullName?.charAt(0)?.toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="text-base font-medium tracking-[-0.02em] !text-white sm:text-[18px]">
                  {patient.fullName}
                </h1>

                <p className="text-[11px] !text-[#3B6D11] sm:text-[12px]">
                  {patient.patientNumber}
                  <span className="hidden sm:inline"> &nbsp;&nbsp;·&nbsp;&nbsp;</span>
                  <span className="sm:hidden"> · </span>
                  Code: {patient.userCode}
                </p>

                <div className="mt-1.5 flex flex-wrap gap-1.5 sm:mt-0">
                  {patient.emergency && (
                    <span className="inline-flex items-center gap-1 rounded-full border !border-[#DC2626]/30 !bg-[#DC2626]/15 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] !text-[#FDA9A9] sm:px-2.5 sm:text-[10px]">
                      <span className="h-1 w-1 rounded-full bg-current" />
                      Emergency
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] sm:px-2.5 sm:text-[10px] ${patient.status === PatientStatus.Active
                        ? '!border-[#1D9E75]/30 !bg-[#F0FAF5] !text-[#1D9E75]'
                        : '!border-white/10 !bg-white/[0.07] !text-[#5a7a6a]'
                      }`}
                  >
                    <span className="h-1 w-1 rounded-full bg-current" />
                    {patient.status}
                  </span>

                  {patient.gender && (
                    <span className="inline-flex rounded-full border !border-white/10 !bg-white/[0.07] px-2 py-0.5 text-[9px] uppercase tracking-[0.06em] !text-[#8ba0b8] sm:px-2.5 sm:text-[10px]">
                      {patient.gender}
                    </span>
                  )}

                  {patient.bloodGroup && (
                    <span className="inline-flex rounded-full border !border-[#DC2626]/25 !bg-[#DC2626]/12 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.06em] !text-[#FDA9A9] sm:px-2.5 sm:text-[10px]">
                      {patient.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <HasRoles
                roles={[
                  Roles.ADMIN,
                  Roles.DOCTOR,
                  Roles.NURSE,
                  Roles.GUEST,
                ]}
              >
                <Link
                  href={`/dashboard/patients/${id}/history`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border !border-white/15 !bg-white/[0.06] px-3 text-[11px] font-medium !text-white transition-colors hover:!bg-white/[0.12] sm:px-3.5 sm:text-[12px]"
                >
                  <History size={13} className="sm:size-[14px]" />
                  <span className="hidden xs:inline">Visit history</span>
                  <span className="xs:hidden">History</span>
                </Link>
              </HasRoles>

              <Link
                href={`/dashboard/patients/${id}/wallet`}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border !border-white/15 !bg-white/[0.06] px-3 text-[11px] font-medium !text-white transition-colors hover:!bg-white/[0.12] sm:px-3.5 sm:text-[12px]"
              >
                <Wallet size={13} className="sm:size-[14px]" />
                <span className="hidden xs:inline">Wallet</span>
                <span className="xs:hidden">Wallet</span>

                {walletBalance > 0.01 && (
                  <span className="ml-0.5 rounded-full border !border-[#5DCAA5]/30 !bg-[#1D9E75]/20 px-1.5 py-0.5 text-[9px] font-semibold !text-[#5DCAA5] sm:text-[10px]">
                    {formatWalletBalance(walletBalance)}
                  </span>
                )}
              </Link>

              <EditPatientButton patient={patient} />

              <HasRoles
                roles={[
                  Roles.ADMIN,
                  Roles.DOCTOR,
                  Roles.NURSE,
                  Roles.GUEST,
                ]}
              >
                <CreateVisitModal patientId={patient.id} />
              </HasRoles>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-4">
            <Section
              icon="user"
              iconColor="teal"
              title="Personal information"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Info label="Date of birth" value={patient.dateOfBirth} />
                <Info label="Age" value={age ? `${age} years` : undefined} />
                <Info label="Email" value={patient.email} />
                <Info label="Phone" value={patient.phoneNumber} />
                <Info
                  label="Secondary phone"
                  value={patient.secondaryPhoneNumber}
                />
              </div>
            </Section>

            <Section
              icon="heart-rate-monitor"
              iconColor="amber"
              title="Medical information"
            >
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
                Allergies
              </p>

              {patient.allergies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-full border border-[#D97706]/25 bg-[#FFFBEB] px-2.5 py-1 text-[11px] font-medium text-[#D97706]"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#B4B2A9]">
                  No recorded allergies.
                </p>
              )}
            </Section>

            <Section icon="map-pin" iconColor="blue" title="Addresses">
              {patient.addresses?.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {patient.addresses.map((addr, i) => (
                    <div
                      key={i}
                      className="rounded-[10px] border border-[#E8E6E0] bg-[#F7F7F5] p-3.5"
                    >
                      <p className="text-[13px] font-medium text-[#2C2C2A]">
                        {addr?.addressLine1}
                      </p>
                      <p className="mt-0.5 text-[12px] text-[#888780]">
                        {addr?.city}
                      </p>
                      <p className="text-[12px] text-[#888780]">
                        {addr?.state}
                      </p>
                      <p className="text-[12px] text-[#888780]">
                        {addr?.country}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#B4B2A9]">
                  No addresses recorded.
                </p>
              )}
            </Section>

            {patient.extraDetails && (
              <Section
                icon="notes"
                iconColor="teal"
                title="Additional details"
              >
                <p className="text-[13px] leading-relaxed text-[#5F5E5A]">
                  {patient.extraDetails}
                </p>
              </Section>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <Section icon="users" iconColor="teal" title="Next of kin">
              <div className="flex flex-col gap-3">
                <Info label="Name" value={patient.nextOfKinName} />
                <div className="h-px bg-[#F0F0EC]" />
                <Info label="Phone" value={patient.nextOfKinPhone} />
              </div>
            </Section>

            <SystemInformation staffId={patient.createdByStaffId} />

            {duplicatePatients.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-[#DC2626]/25 bg-[#FEF2F2]">
                <div className="flex items-center gap-2 border-b border-[#DC2626]/15 px-4 py-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#DC2626]/12">
                    <AlertTriangle size={13} className="text-[#DC2626]" />
                  </div>

                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#DC2626]">
                    Possible duplicates
                  </span>
                </div>

                <div className="divide-y divide-[#DC2626]/10 px-4">
                  {duplicatePatients.map((dup, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-2.5 text-[13px] text-[#991B1B]"
                    >
                      <UserX
                        size={13}
                        className="shrink-0 text-[#DC2626]"
                      />
                      {dup?.fullName}&nbsp;·&nbsp;Code: {dup?.userCode}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SessionGuard>
  );
}

const ICON_COLORS: Record<string, string> = {
  teal: 'bg-[#F0FAF5] text-[#1D9E75]',
  amber: 'bg-[#FFFBEB] text-[#D97706]',
  blue: 'bg-[#EFF6FF] text-[#2563EB]',
  red: 'bg-[#FEF2F2] text-[#DC2626]',
};

function Section({
  icon,
  iconColor = 'teal',
  title,
  children,
}: {
  icon: string;
  iconColor?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white">
      <div className="flex items-center gap-2.5 border-b border-[#E8E6E0] px-4 py-3">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-[7px] ${ICON_COLORS[iconColor]}`}
        >
          <span
            className={`ti ti-${icon} text-[14px]`}
            aria-hidden="true"
          />
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#B4B2A9]">
          {title}
        </span>
      </div>

      <div className="p-4">{children}</div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="mb-0.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#B4B2A9]">
        {label}
      </p>

      <p
        className={`text-[13px] font-medium ${value ? 'text-[#2C2C2A]' : 'text-[#B4B2A9]'
          }`}
      >
        {value ?? '—'}
      </p>
    </div>
  );
}
