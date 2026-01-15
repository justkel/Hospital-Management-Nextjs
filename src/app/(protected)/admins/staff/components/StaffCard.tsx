'use client';

import { PencilIcon, EyeIcon } from '@heroicons/react/24/solid';
import { GetAllStaffQuery } from '@/shared/graphql/generated/graphql';
import { ROLE_STYLES } from '@/shared/utils/enums/roles';

type StaffItem = GetAllStaffQuery['staffs'][number];

interface Props {
  staff: StaffItem;
  onView: (id: string) => void;
  onEdit: (staff: StaffItem) => void;
}

export default function StaffCard({ staff, onView, onEdit }: Props) {
  return (
    <div className="relative bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition">
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          onClick={() => onView(staff.id)}
          className="p-2 rounded-full bg-gray-100 hover:bg-indigo-600 hover:text-white transition"
        >
          <EyeIcon className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(staff)}
          className="p-2 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </div>

      <h2 className="text-base sm:text-lg font-semibold">{staff.fullName}</h2>
      <p className="text-gray-500 text-xs sm:text-sm mt-1 break-all">{staff.email}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {staff.roles.map(role => {
          const style = ROLE_STYLES[role];
          return (
            <span key={role} className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
              {role}
            </span>
          );
        })}
      </div>
    </div>
  );
}
