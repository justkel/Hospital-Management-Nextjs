'use client';

import { useEffect, useState } from 'react';
import { Drawer, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ClipboardCheck } from 'lucide-react';
import { VisitTaskType } from '@/shared/graphql/generated/graphql';
import { TASK_TYPE_META } from './taskAppearance';
import { VisitTaskItem } from './useVisitTasks';

interface Props {
  open: boolean;
  onClose: () => void;
  submitting: boolean;
  initial?: VisitTaskItem | null;
  onCreate: (payload: {
    taskType: VisitTaskType;
    description?: string;
    dueAt?: string;
  }) => Promise<boolean>;
  onUpdate: (
    visitTaskId: string,
    payload: { taskType?: VisitTaskType; description?: string; dueAt?: string }
  ) => Promise<boolean>;
}

export default function VisitTaskForm({
  open,
  onClose,
  submitting,
  initial,
  onCreate,
  onUpdate,
}: Props) {
  const isEditing = !!initial;

  const [taskType, setTaskType] = useState<VisitTaskType>(
    VisitTaskType.FollowUp
  );
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState<Dayjs | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setTaskType(initial?.taskType ?? VisitTaskType.FollowUp);
    setDescription(initial?.description ?? '');
    setDueAt(initial?.dueAt ? dayjs(initial.dueAt) : null);
    setError(null);
  }, [open, initial]);

  const handleSubmit = async () => {
    setError(null);

    const payload = {
      taskType,
      description: description.trim() || undefined,
      dueAt: dueAt ? dueAt.format('YYYY-MM-DD') : undefined,
    };

    const ok =
      isEditing && initial
        ? await onUpdate(initial.id, payload)
        : await onCreate(payload);

    if (ok) onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      size="default"
      title={null}
      closable={false}
      styles={{
        body: {
          padding: 0,
          background: 'linear-gradient(to bottom right, #fffbeb, #fff7ed)',
        },
      }}
    >
      <div className="flex h-full flex-col p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">
              {isEditing ? 'Edit task' : 'Add a task'}
            </h3>
            <p className="text-sm text-slate-500">
              {isEditing
                ? 'Update the details below.'
                : 'Follow-ups, referrals, labs, and more.'}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Task type
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Object.values(VisitTaskType).map(type => {
                const meta = TASK_TYPE_META[type];
                const Icon = meta.icon;
                const active = taskType === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTaskType(type)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition cursor-pointer ${
                      active
                        ? 'border-amber-400 bg-amber-50 text-amber-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Icon size={18} />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Due date (optional)
            </p>
            <DatePicker
              className="w-full"
              value={dueAt}
              onChange={setDueAt}
              format="MMM D, YYYY"
              disabledDate={current => !!current && current < dayjs().startOf('day')}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Description (optional)
            </p>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Any extra detail…"
              className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={handleSubmit}
            className="flex-1 rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white! shadow-md shadow-amber-200 transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Add task'}
          </button>
        </div>
      </div>
    </Drawer>
  );
}