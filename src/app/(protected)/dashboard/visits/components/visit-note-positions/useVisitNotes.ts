'use client';

import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import { clientFetch } from '@/lib/clientFetch';
import { GetVisitNotesByVisitQuery } from '@/shared/graphql/generated/graphql';

export type VisitNoteItem =
  GetVisitNotesByVisitQuery['visitNotesByVisit'][number];

export function useVisitNotes(visitId: string) {
  const [notes, setNotes] = useState<VisitNoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch(`/api/visit-note/list?visitId=${visitId}`);
      if (!res.ok) throw new Error('Failed to fetch notes');

      const json: { visitNotes: VisitNoteItem[] } = await res.json();
      setNotes(json.visitNotes ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(
    async (note: string): Promise<boolean> => {
      setCreating(true);
      try {
        const res = await clientFetch('/api/visit-note/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitId, note }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          message.error(json?.error || 'Failed to pin note');
          return false;
        }

        await fetchNotes();
        return true;
      } catch (err) {
        console.error(err);
        message.error('Failed to pin note');
        return false;
      } finally {
        setCreating(false);
      }
    },
    [visitId, fetchNotes]
  );

  const updateNote = useCallback(
    async (visitNoteId: string, note: string): Promise<boolean> => {
      setUpdatingId(visitNoteId);
      try {
        const res = await clientFetch('/api/visit-note/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visitNoteId, note }),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
          message.error(json?.error || 'Failed to update note');
          return false;
        }

        await fetchNotes();
        return true;
      } catch (err) {
        console.error(err);
        message.error('Failed to update note');
        return false;
      } finally {
        setUpdatingId(null);
      }
    },
    [fetchNotes]
  );

  return { notes, loading, creating, updatingId, createNote, updateNote };
}