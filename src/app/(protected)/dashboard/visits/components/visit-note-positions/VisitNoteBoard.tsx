'use client';

import { useState } from 'react';
import { StickyNote, Plus, X } from 'lucide-react';
import { useVisitNotes } from './useVisitNotes';
import { useVisitNotePositions } from './useVisitNotePositions';
import VisitNoteCard from './VisitNoteCard';

interface Props {
  visitId: string;
}

const NOTE_WIDTH = 220;
const NOTE_HEIGHT = 140;

export default function VisitNoteBoard({ visitId }: Props) {
  const { notes, loading, creating, updatingId, createNote, updateNote } =
    useVisitNotes(visitId);

  const { getPosition, moveLocal, commitPosition, bringToFront } =
    useVisitNotePositions(visitId);

  const [boardOpen, setBoardOpen] = useState(true);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState('');

  const handleCreate = async () => {
    if (!draft.trim()) return;
    const ok = await createNote(draft.trim());
    if (ok) {
      setDraft('');
      setComposing(false);
    }
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-40">
        {boardOpen &&
          !loading &&
          notes.map((note, index) => {
            const fallback = {
              x: 24 + (index % 4) * (NOTE_WIDTH + 20),
              y: 24 + Math.floor(index / 4) * (NOTE_HEIGHT + 40),
              z: index + 1,
            };
            const pos = getPosition(note.id, fallback);

            return (
              <VisitNoteCard
                key={note.id}
                note={note}
                index={index}
                x={pos.x}
                y={pos.y}
                z={pos.z}
                saving={updatingId === note.id}
                onMove={(nx, ny) => moveLocal(note.id, nx, ny)}
                onDragEnd={(nx, ny) =>
                  commitPosition(note.id, nx, ny, pos.z)
                }
                onFocus={(nx, ny) => bringToFront(note.id, nx, ny)}
                onSave={text => updateNote(note.id, text)}
              />
            );
          })}
      </div>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {composing && (
          <div className="w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              New note
            </p>
            <textarea
              autoFocus
              rows={4}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Write a note…"
              className="w-full resize-none rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setComposing(false);
                  setDraft('');
                }}
                className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !draft.trim()}
                className="cursor-pointer rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white! disabled:opacity-50"
              >
                {creating ? 'Pinning…' : 'Pin note'}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          {boardOpen && (
            <button
              onClick={() => setComposing(v => !v)}
              title="New note"
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-teal-700 shadow-lg ring-1 ring-slate-200 transition hover:scale-105"
            >
              {composing ? <X size={18} /> : <Plus size={20} />}
            </button>
          )}

          <button
            onClick={() => setBoardOpen(v => !v)}
            title={boardOpen ? 'Hide notes' : 'Show notes'}
            className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-teal-600 text-white! shadow-xl transition hover:scale-105"
          >
            <StickyNote size={22} />
            {notes.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-amber-950">
                {notes.length}
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}