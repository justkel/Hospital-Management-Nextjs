'use client';

import { Popconfirm } from 'antd';
import { CheckCircle2, XCircle, Pencil, Mail } from 'lucide-react';
import { VisitTaskStatus } from '@/shared/graphql/generated/graphql';
import { VisitTaskItem } from './useVisitTasks';
import { TASK_TYPE_META, formatDueRelative } from './taskAppearance';

interface Props {
  task: VisitTaskItem;
  updating: boolean;
  onEdit: () => void;
  onMarkDone: () => void;
  onCancel: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  DONE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-500 border-slate-200',
};

export default function VisitTaskCard({
  task,
  updating,
  onEdit,
  onMarkDone,
  onCancel,
}: Props) {
  const meta = TASK_TYPE_META[task.taskType];
  const Icon = meta.icon;

  const isPending = task.status === VisitTaskStatus.Pending;
  const isDone = task.status === VisitTaskStatus.Done;
  const isCancelled = task.status === VisitTaskStatus.Cancelled;
  const isClosed = isDone || isCancelled;

  const due = formatDueRelative(task.dueAt);

  return (
    <div
      className={`group relative flex gap-4 rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
        due.overdue && isPending ? 'border-red-200' : 'border-slate-200'
      }`}
    >
      <button
        onClick={isPending ? onMarkDone : undefined}
        disabled={!isPending || updating}
        title={isPending ? 'Mark done' : undefined}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
          isDone
            ? 'border-emerald-500 bg-emerald-500 !text-white'
            : isPending
              ? 'cursor-pointer border-slate-300 hover:border-emerald-400'
              : 'border-slate-200 bg-slate-100'
        }`}
      >
        {isDone && <CheckCircle2 size={14} />}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${meta.iconWrap}`}
            >
              <Icon size={15} />
            </span>

            <div className="min-w-0">
              <p
                className={`font-semibold text-slate-900 ${isClosed ? 'text-slate-400 line-through' : ''}`}
              >
                {meta.label}
              </p>
              {task.description && (
                <p
                  className={`text-sm text-slate-500 ${isClosed ? 'line-through' : ''}`}
                >
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap ${STATUS_STYLES[task.status]}`}
          >
            {task.status}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          {task.dueAt && (
            <span
              className={`font-medium ${
                due.overdue && isPending
                  ? 'text-red-600'
                  : due.dueSoon && isPending
                    ? 'text-amber-600'
                    : ''
              }`}
            >
              {due.label}
            </span>
          )}

          {task.createdBy && <span>Added by {task.createdBy.fullName}</span>}

          {isDone && task.completedBy && (
            <span>Completed by {task.completedBy.fullName}</span>
          )}

          {task.isEmailSent && (
            <span
              className="inline-flex items-center gap-1 text-slate-400"
              title="Reminder email already sent"
            >
              <Mail size={12} /> Reminder sent
            </span>
          )}
        </div>

        {isPending && (
          <div className="mt-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50 cursor-pointer"
            >
              <Pencil size={12} /> Edit
            </button>

            <Popconfirm
              title="Cancel this task?"
              okText="Cancel task"
              okButtonProps={{ danger: true }}
              onConfirm={onCancel}
            >
              <button className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer">
                <XCircle size={12} /> Cancel
              </button>
            </Popconfirm>
          </div>
        )}
      </div>
    </div>
  );
}