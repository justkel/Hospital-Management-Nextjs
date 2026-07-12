'use client';

import { useEffect, useRef, useState } from 'react';
import { Caveat } from 'next/font/google';
import { Pin } from 'lucide-react';
import { VisitNoteItem } from './useVisitNotes';
import {
  paletteForNote,
  rotationForNote,
  formatRelativeTime,
} from './noteAppearance';

const caveat = Caveat({ subsets: ['latin'], weight: ['600'] });

const EDIT_WINDOW_MINUTES = 5;
const NOTE_WIDTH = 220;

interface Props {
  note: VisitNoteItem;
  index: number;
  x: number;
  y: number;
  z: number;
  saving: boolean;
  onMove: (x: number, y: number) => void;
  onDragEnd: (x: number, y: number) => void;
  onFocus: (x: number, y: number) => void;
  onSave: (text: string) => Promise<boolean>;
}

export default function VisitNoteCard({
  note,
  index,
  x,
  y,
  z,
  saving,
  onMove,
  onDragEnd,
  onFocus,
  onSave,
}: Props) {
  const palette = paletteForNote(note.id);
  const restRotation = rotationForNote(note.id);

  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.note);

  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const lastComputed = useRef({ x, y });

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), index * 40);
    return () => clearTimeout(timer);
  }, [index]);

  const minutesSinceCreation =
    (Date.now() - new Date(note.createdAt).getTime()) / (1000 * 60);
  const editable = minutesSinceCreation <= EDIT_WINDOW_MINUTES;
  const remainingEditSeconds = Math.max(
    0,
    Math.round(EDIT_WINDOW_MINUTES * 60 - minutesSinceCreation * 60)
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: x,
      originY: y,
    };
    lastComputed.current = { x, y };
    setDragging(true);
    onFocus(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;

    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;

    const maxX = Math.max(8, window.innerWidth - NOTE_WIDTH - 8);

    const nextX = Math.min(
      maxX,
      Math.max(8, dragState.current.originX + dx)
    );
    const nextY = Math.max(8, dragState.current.originY + dy);

    lastComputed.current = { x: nextX, y: nextY };
    onMove(nextX, nextY);
  };

  const handlePointerUp = () => {
    dragState.current = null;
    setDragging(false);
    onDragEnd(lastComputed.current.x, lastComputed.current.y);
  };

  const handleSave = async () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === note.note) {
      setEditing(false);
      return;
    }
    const ok = await onSave(trimmed);
    if (ok) setEditing(false);
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: z,
        width: NOTE_WIDTH,
        opacity: mounted ? 1 : 0,
        transition: 'opacity 240ms ease',
        pointerEvents: 'auto',
      }}
      onPointerDown={() => onFocus(x, y)}
    >
      <div
        style={{
          transform: `rotate(${dragging ? 0 : restRotation}deg) scale(${
            dragging ? 1.04 : 1
          })`,
          transition: dragging ? 'transform 120ms ease' : 'transform 200ms ease',
        }}
        className={`relative rounded-[3px] border border-black/5 ${palette.bg} p-4 shadow-[0_6px_16px_-6px_rgba(0,0,0,0.3)] ${
          dragging ? 'shadow-[0_18px_30px_-8px_rgba(0,0,0,0.4)]' : ''
        }`}
      >
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          title="Drag to move"
          className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 cursor-grab items-center justify-center rounded-full bg-white shadow-md active:cursor-grabbing"
        >
          <Pin size={13} className={palette.text} />
        </div>

        {editing ? (
          <textarea
            autoFocus
            rows={4}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className={`w-full resize-none bg-transparent text-[16px] leading-snug outline-none ${palette.text} ${caveat.className}`}
          />
        ) : (
          <p
            className={`whitespace-pre-wrap text-[16px] leading-snug ${palette.text} ${caveat.className}`}
          >
            {note.note}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between gap-2 text-[11px] font-medium opacity-70">
          <span className={palette.text}>
            {note.author?.fullName ?? 'Unknown'} ·{' '}
            {formatRelativeTime(note.createdAt)}
          </span>

          {editable && !editing && (
            <button
              onClick={() => setEditing(true)}
              className={`cursor-pointer underline decoration-dotted ${palette.text}`}
            >
              Edit
            </button>
          )}

          {editing && (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDraft(note.note);
                  setEditing(false);
                }}
                className={`cursor-pointer ${palette.text}`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`cursor-pointer font-semibold underline disabled:opacity-50 ${palette.text}`}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {editable && !editing && remainingEditSeconds > 0 && (
          <div className="mt-1 text-[10px] font-medium text-black/40">
            Editable for {Math.floor(remainingEditSeconds / 60)}:
            {(remainingEditSeconds % 60).toString().padStart(2, '0')}
          </div>
        )}
      </div>
    </div>
  );
}