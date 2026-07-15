'use client';

import { useMemo, useState } from 'react';
import { Skeleton } from 'antd';
import { ClipboardCheck, Plus } from 'lucide-react';
import { VisitTaskStatus } from '@/shared/graphql/generated/graphql';
import { useVisitTasks, VisitTaskItem } from './useVisitTasks';
import VisitTaskForm from './VisitTaskForm';
import VisitTaskCard from './VisitTaskCard';

interface Props {
  visitId: string;
}

export default function VisitTasksSection({ visitId }: Props) {
  const {
    tasks,
    loading,
    submitting,
    updatingId,
    createTask,
    updateTask,
    updateStatus,
  } = useVisitTasks(visitId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<VisitTaskItem | null>(null);

  const openCreate = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEdit = (task: VisitTaskItem) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const { pending, resolved } = useMemo(() => {
    const pending = tasks.filter(t => t.status === VisitTaskStatus.Pending);
    const resolved = tasks.filter(t => t.status !== VisitTaskStatus.Pending);
    return { pending, resolved };
  }, [tasks]);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ClipboardCheck size={16} />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Follow-up &amp; Tasks
            </h2>
            {pending.length > 0 && (
              <p className="text-xs text-slate-500">
                {pending.length} outstanding
              </p>
            )}
          </div>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white! shadow-sm shadow-amber-200 transition hover:bg-amber-700 cursor-pointer"
        >
          <Plus size={16} /> Add task
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
          <p className="text-sm font-medium text-slate-600">
            No tasks for this visit yet
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Follow-ups, referrals, labs, and imaging orders show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...pending, ...resolved].map(task => (
            <VisitTaskCard
              key={task.id}
              task={task}
              updating={updatingId === task.id}
              onEdit={() => openEdit(task)}
              onMarkDone={() => updateStatus(task.id, VisitTaskStatus.Done)}
              onCancel={() => updateStatus(task.id, VisitTaskStatus.Cancelled)}
            />
          ))}
        </div>
      )}

      <VisitTaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        submitting={submitting}
        initial={editingTask}
        onCreate={createTask}
        onUpdate={updateTask}
      />
    </section>
  );
}