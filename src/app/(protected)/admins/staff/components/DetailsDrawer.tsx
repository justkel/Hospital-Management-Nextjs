'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { GetAllStaffQuery } from '@/shared/graphql/generated/graphql';
import { Meta, Avatar, DetailsSkeleton } from '@/components/DetailsParts';
import { ROLE_STYLES } from '@/shared/utils/enums/roles';

type StaffItem = GetAllStaffQuery['staffs'][number];

interface Props {
  staff: StaffItem | null;
  loading: boolean;
  onClose: () => void;
}

export default function DetailsDrawer({ staff, loading, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex justify-end sm:items-stretch items-end"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full sm:max-w-md h-[92vh] sm:h-full bg-white p-5 sm:p-8 rounded-t-3xl sm:rounded-none animate-drawer-in relative"
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
          </div>
        ) : (
          <p className="text-gray-500 mt-12">Staff not found</p>
        )}
      </div>
    </div>
  );
}
