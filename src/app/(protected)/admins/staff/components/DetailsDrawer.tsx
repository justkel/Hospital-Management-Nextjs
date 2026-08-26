'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GetAllStaffQuery } from '@/shared/graphql/generated/graphql';
import { Meta, Avatar, DetailsSkeleton } from '@/components/DetailsParts';
import { ROLE_STYLES, Roles } from '@/shared/utils/enums/roles';
import { STATUS_LABELS, STATUS_COLORS } from '@/shared/utils/enums/staff';
import { StaffStatus } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import { HasRoles } from '@/components/auth/HasRoles';

type StaffItem = GetAllStaffQuery['staffs']['items'][number];

interface Props {
  staff: StaffItem | null;
  loading: boolean;
  onClose: () => void;
  onStatusUpdated?: (staff: StaffItem) => void;
}

export default function DetailsDrawer({
  staff,
  loading,
  onClose,
  onStatusUpdated,
}: Props) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StaffStatus | null>(
    staff?.status ?? null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStatus(staff?.status ?? null);
    setError(null);
  }, [staff]);

  async function handleStatusChange(newStatus: StaffStatus) {
    if (!staff || currentStatus === newStatus) return;

    setUpdatingStatus(true);
    setError(null);

    try {
      const res = await clientFetch('/api/staff/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ staffId: staff.id, status: newStatus }),
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to update status');

      setCurrentStatus(json.staff.status);
      onStatusUpdated?.(json.staff);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setUpdatingStatus(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end sm:items-stretch items-end"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full mt-14 sm:max-w-md h-[92vh] sm:h-full !bg-[#FAFAF8] p-5 sm:p-6 rounded-t-2xl sm:rounded-none animate-drawer-in relative"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border !border-[#E8E6E0] !bg-white !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
        >
          <X size={18} />
        </button>

        {error && (
          <div className="mb-4 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3 text-sm font-medium !text-[#DC2626]">
            {error}
          </div>
        )}

        {loading ? (
          <DetailsSkeleton />
        ) : staff ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar name={staff.fullName} />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold tracking-tight !text-[#16211B] sm:text-xl">
                  {staff.fullName}
                </h2>
                <p className="mt-0.5 truncate text-sm !text-[#767570]">
                  {staff.email}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl border !border-[#E8E6E0] !bg-white p-4">
              <Meta label="User Code" value={staff.userCode} />
              <Meta label="Phone" value={staff.phoneNumber ?? '—'} />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Assigned roles
              </p>
              <div className="flex flex-wrap gap-1.5">
                {staff.roles.map((role) => {
                  const style = ROLE_STYLES[role];
                  return (
                    <span
                      key={role}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${style.bg} ${style.text}`}
                    >
                      {role}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border !border-[#E8E6E0] !bg-white p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Status
                </p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${STATUS_COLORS[currentStatus ?? StaffStatus.Active]}`}
                >
                  {STATUS_LABELS[currentStatus ?? StaffStatus.Active]}
                </span>
              </div>

              <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                <div className="rounded-xl border !border-[#E8E6E0] !bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                    Update status
                  </p>
                  <p className="mt-0.5 text-xs !text-[#767570]">
                    Click a status to update
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Object.values(StaffStatus).map((status: StaffStatus) => (
                      <button
                        key={status}
                        disabled={updatingStatus}
                        onClick={() => handleStatusChange(status)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide transition ${
                          currentStatus === status
                            ? `ring-2 ring-[#1D9E75] ${STATUS_COLORS[status]}`
                            : `${STATUS_COLORS[status]} opacity-70 hover:opacity-100`
                        }`}
                      >
                        {STATUS_LABELS[status]}
                      </button>
                    ))}
                  </div>
                </div>
              </HasRoles>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm font-medium !text-[#B4B2A9]">
              Staff not found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}