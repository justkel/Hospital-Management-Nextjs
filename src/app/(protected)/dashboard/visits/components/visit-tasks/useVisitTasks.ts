'use client';

import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { clientFetch } from '@/lib/clientFetch';
import {
  GetVisitTasksByVisitQuery,
  VisitTaskStatus,
  VisitTaskType,
} from '@/shared/graphql/generated/graphql';

export type VisitTaskItem =
  GetVisitTasksByVisitQuery['visitTasksByVisit'][number];

interface TaskPayload {
  taskType?: VisitTaskType;
  description?: string;
  dueAt?: string;
}

export function useVisitTasks(visitId: string) {
  const [tasks, setTasks] = useState<VisitTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch(`/api/visit-task/list?visitId=${visitId}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');

      const json: { visitTasks: VisitTaskItem[] } = await res.json();
      setTasks(json.visitTasks ?? []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(
    async (payload: TaskPayload): Promise<boolean> => {
      setSubmitting(true);
      try {
        const res = await clientFetch('/api/visit-task/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitId, ...payload }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          message.error(json?.error || 'Failed to add task');
          return false;
        }

        message.success('Task added');
        await fetchTasks();
        return true;
      } catch (err) {
        console.error(err);
        message.error('Failed to add task');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [visitId, fetchTasks]
  );

  const updateTask = useCallback(
    async (visitTaskId: string, payload: TaskPayload): Promise<boolean> => {
      setSubmitting(true);
      try {
        const res = await clientFetch('/api/visit-task/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitTaskId, ...payload }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          message.error(json?.error || 'Failed to update task');
          return false;
        }

        message.success('Task updated');
        await fetchTasks();
        return true;
      } catch (err) {
        console.error(err);
        message.error('Failed to update task');
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchTasks]
  );

  const updateStatus = useCallback(
    async (visitTaskId: string, status: VisitTaskStatus): Promise<boolean> => {
      setUpdatingId(visitTaskId);
      try {
        const res = await clientFetch('/api/visit-task/update-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitTaskId, status }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          message.error(json?.error || 'Failed to update task status');
          return false;
        }

        message.success(
          status === VisitTaskStatus.Done ? 'Task marked done' : 'Task cancelled'
        );
        await fetchTasks();
        return true;
      } catch (err) {
        console.error(err);
        message.error('Failed to update task status');
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchTasks]
  );

  return {
    tasks,
    loading,
    submitting,
    updatingId,
    createTask,
    updateTask,
    updateStatus,
  };
}