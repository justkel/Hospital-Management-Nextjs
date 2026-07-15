import { CalendarClock, Send, ScanLine, FlaskConical, ListTodo } from 'lucide-react';
import { VisitTaskType } from '@/shared/graphql/generated/graphql';

export const TASK_TYPE_META: Record<
  VisitTaskType,
  {
    label: string;
    icon: typeof CalendarClock;
    iconWrap: string;
  }
> = {
  [VisitTaskType.FollowUp]: {
    label: 'Follow-up',
    icon: CalendarClock,
    iconWrap: 'bg-indigo-100 text-indigo-700',
  },
  [VisitTaskType.Referral]: {
    label: 'Referral',
    icon: Send,
    iconWrap: 'bg-violet-100 text-violet-700',
  },
  [VisitTaskType.Imaging]: {
    label: 'Imaging',
    icon: ScanLine,
    iconWrap: 'bg-sky-100 text-sky-700',
  },
  [VisitTaskType.Lab]: {
    label: 'Lab',
    icon: FlaskConical,
    iconWrap: 'bg-emerald-100 text-emerald-700',
  },
  [VisitTaskType.Other]: {
    label: 'Other',
    icon: ListTodo,
    iconWrap: 'bg-slate-100 text-slate-600',
  },
};

export function formatDueRelative(dueAt?: string | null): {
  label: string;
  overdue: boolean;
  dueSoon: boolean;
} {
  if (!dueAt) {
    return { label: 'No due date', overdue: false, dueSoon: false };
  }

  const diffMs = new Date(dueAt).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const days = Math.abs(diffDays);
    return {
      label: `Overdue by ${days} day${days === 1 ? '' : 's'}`,
      overdue: true,
      dueSoon: false,
    };
  }

  if (diffDays === 0) {
    return { label: 'Due today', overdue: false, dueSoon: true };
  }

  if (diffDays === 1) {
    return { label: 'Due tomorrow', overdue: false, dueSoon: true };
  }

  return {
    label: `Due in ${diffDays} days`,
    overdue: false,
    dueSoon: diffDays <= 3,
  };
}