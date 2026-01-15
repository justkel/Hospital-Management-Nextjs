'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { StaffRole, GetAllStaffQuery } from '@/shared/graphql/generated/graphql';

type StaffItem = GetAllStaffQuery['staffs'][number];

interface RolesModalProps {
  staff: StaffItem | null;
  rolesToUpdate: StaffRole[];
  onClose: () => void;
  onSave: () => void;
  onToggleRole: (role: StaffRole) => void;
  updating: boolean;
  error: string | null;
}

export default function RolesModal({
  staff,
  rolesToUpdate,
  onClose,
  onSave,
  onToggleRole,
  updating,
  error,
}: RolesModalProps) {
  if (!staff) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl animate-fade-in"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Update Roles</h2>
          <button onClick={onClose}>
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <input
            value={staff.fullName}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm"
          />
          <input
            value={staff.email}
            disabled
            className="w-full px-3 py-2 rounded-lg bg-gray-100 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {Object.values(StaffRole).map(role => (
            <button
              key={role}
              onClick={() => onToggleRole(role)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                rolesToUpdate.includes(role)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
            {error}
          </p>
        )}

        <button
          onClick={onSave}
          disabled={updating}
          className="w-full py-2 rounded-2xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {updating ? 'Updating…' : 'Save Roles'}
        </button>
      </div>
    </div>
  );
}
