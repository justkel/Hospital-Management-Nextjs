import { VisitBedAllocationStatus } from '@/shared/graphql/generated/graphql';

export const STATUS_STYLES: Record<
  VisitBedAllocationStatus,
  { badge: string; dot: string; solid: string }
> = {
  [VisitBedAllocationStatus.Reserved]: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    solid: 'bg-amber-500',
  },
  [VisitBedAllocationStatus.Occupied]: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot: 'bg-teal-500',
    solid: 'bg-teal-500',
  },
  [VisitBedAllocationStatus.Released]: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    solid: 'bg-emerald-500',
  },
  [VisitBedAllocationStatus.Transferred]: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    solid: 'bg-slate-400',
  },
};

export const ACTIVE_STATUSES = [
  VisitBedAllocationStatus.Reserved,
  VisitBedAllocationStatus.Occupied,
];

export const TERMINAL_STATUSES = [
  VisitBedAllocationStatus.Released,
  VisitBedAllocationStatus.Transferred,
];

export function formatStatusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}