'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { GetAllStaffQuery } from '@/shared/graphql/generated/graphql';
import { Meta, Avatar, DetailsSkeleton } from '@/components/DetailsParts';
import { ROLE_STYLES } from '@/shared/utils/enums/roles';
import { STATUS_LABELS, STATUS_COLORS } from '@/shared/utils/enums/staff';
import { StaffStatus } from '@/shared/graphql/generated/graphql';

type StaffItem = GetAllStaffQuery['staffs']['items'][number];

interface Props {
  staff: StaffItem | null;
  loading: boolean;
  onClose: () => void;
  onStatusUpdated?: (staff: StaffItem) => void;
}

export default function DetailsDrawer({ staff, loading, onClose, onStatusUpdated }: Props) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<StaffStatus | null>(staff?.status ?? null);

  useEffect(() => {
    setCurrentStatus(staff?.status ?? null);
  }, [staff]);

  async function handleStatusChange(newStatus: StaffStatus) {
    if (!staff || currentStatus === newStatus) return;
    setUpdatingStatus(true);

    try {
      const res = await fetch('/api/staff/update-status', {
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
      alert((err as Error).message);
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
        onClick={e => e.stopPropagation()}
        className="w-full mt-14 sm:max-w-md h-[92vh] sm:h-full bg-white p-5 sm:p-8 rounded-t-3xl sm:rounded-none animate-drawer-in relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
        >
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>

        {loading ? (
          <DetailsSkeleton />
        ) : staff ? (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Avatar name={staff.fullName} />
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold">{staff.fullName}</h2>
                <p className="text-sm text-gray-500 break-all">{staff.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
              <Meta label="Staff ID" value={staff.id} />
              <Meta label="User Code" value={staff.userCode} />
              <Meta label="Phone" value={staff.phoneNumber ?? '—'} />
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Assigned roles</p>
              <div className="flex flex-wrap gap-2">
                {staff.roles.map(role => {
                  const style = ROLE_STYLES[role];
                  return (
                    <span
                      key={role}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
                    >
                      {role}
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Status</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(StaffStatus).map(status => (
                  <button
                    key={status}
                    disabled={updatingStatus}
                    onClick={() => handleStatusChange(status)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                      currentStatus === status ? 'ring-2 ring-indigo-500' : ''
                    } ${STATUS_COLORS[status]}`}
                  >
                    {STATUS_LABELS[status]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-12">Staff not found</p>
        )}
      </div>
    </div>
  );
}
