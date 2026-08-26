'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';

export interface NotePosition {
  x: number;
  y: number;
  z: number;
}

type PositionMap = Record<string, NotePosition>; // keyed by visitNoteId

interface RawPosition {
  visitNoteId: string;
  positionX: number;
  positionY: number;
  zIndex: number;
}

export function useVisitNotePositions(visitId: string, enabled = true) {
  const [positions, setPositions] = useState<PositionMap>({});
  const [loaded, setLoaded] = useState(false);
  const [topZ, setTopZ] = useState(1);

  const fetchPositions = useCallback(async () => {
    try {
      const res = await clientFetch(
        `/api/visit-note/positions/list?visitId=${visitId}`
      );
      if (!res.ok) return;

      const json: { visitNotePositions: RawPosition[] } = await res.json();

      const map: PositionMap = {};
      let maxZ = 1;

      for (const p of json.visitNotePositions ?? []) {
        map[p.visitNoteId] = { x: p.positionX, y: p.positionY, z: p.zIndex };
        maxZ = Math.max(maxZ, p.zIndex);
      }

      setPositions(map);
      setTopZ(maxZ);
    } catch (err) {
      console.error(err);
    } finally {
      setLoaded(true);
    }
  }, [visitId]);

  useEffect(() => {
    if (!enabled) return;
    fetchPositions();
  }, [enabled, fetchPositions]);

  const moveLocal = useCallback((noteId: string, x: number, y: number) => {
    setPositions(prev => ({
      ...prev,
      [noteId]: { ...(prev[noteId] ?? { z: 1 }), x, y },
    }));
  }, []);

  const commitPosition = useCallback(
    async (noteId: string, x: number, y: number, z?: number) => {
      try {
        await clientFetch('/api/visit-note/positions/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitNoteId: noteId,
            positionX: x,
            positionY: y,
            ...(z !== undefined && { zIndex: z }),
          }),
        });
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const bringToFront = useCallback(
    (noteId: string, x: number, y: number) => {
      const nextZ = topZ + 1;
      setTopZ(nextZ);
      setPositions(prev => ({
        ...prev,
        [noteId]: { ...(prev[noteId] ?? { x, y }), z: nextZ },
      }));
      commitPosition(noteId, x, y, nextZ);
    },
    [topZ, commitPosition]
  );

  const getPosition = useCallback(
    (noteId: string, fallback: NotePosition) => positions[noteId] ?? fallback,
    [positions]
  );

  return {
    getPosition,
    moveLocal,
    commitPosition,
    bringToFront,
    loaded,
  };
}