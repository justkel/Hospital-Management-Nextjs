export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
}

export const STATUS_LABELS: Record<StaffStatus, string> = {
  [StaffStatus.ACTIVE]: 'Active',
  [StaffStatus.INACTIVE]: 'Inactive',
  [StaffStatus.PENDING]: 'Pending',
  [StaffStatus.SUSPENDED]: 'Suspended',
};

export const STATUS_COLORS: Record<StaffStatus, string> = {
  [StaffStatus.ACTIVE]: 'bg-green-100 text-green-800',
  [StaffStatus.INACTIVE]: 'bg-gray-100 text-gray-700',
  [StaffStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [StaffStatus.SUSPENDED]: 'bg-red-100 text-red-800',
};