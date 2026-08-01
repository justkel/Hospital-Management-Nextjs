'use client';

import { useCallback, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';

import {
  ActiveBlocksForTheatreQuery,
  TheatreBlockStatus,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type Block = ActiveBlocksForTheatreQuery['activeBlocksForTheatre'][number];

interface Props {
  block: Block;
  onSuccess: () => void;
  onCancel: () => void;
}

const RESOLUTION_OPTIONS: {
  value: TheatreBlockStatus;
  label: string;
  description: string;
  icon: React.ElementType;
  pill: string;
  ring: string;
  bg: string;
}[] = [
    {
      value: TheatreBlockStatus.Released,
      label: 'Release',
      description: 'Unblock the theatre immediately — end time will be set to now',
      icon: Unlock,
      pill: 'border-emerald-300 text-emerald-700',
      ring: 'ring-emerald-400',
      bg: 'bg-emerald-50',
    },
    {
      value: TheatreBlockStatus.Completed,
      label: 'Mark Completed',
      description: 'Block ran its course and is now finished',
      icon: CheckSquare,
      pill: 'border-blue-300 text-blue-700',
      ring: 'ring-blue-400',
      bg: 'bg-blue-50',
    },
    {
      value: TheatreBlockStatus.Cancelled,
      label: 'Cancel',
      description: 'Block is voided — it no longer applies',
      icon: Trash2,
      pill: 'border-slate-300 text-slate-600',
      ring: 'ring-slate-400',
      bg: 'bg-slate-50',
    },
  ];

export default function TheatreBlockResolveModal({
  block,
  onSuccess,
  onCancel,
}: Props) {
  const [status, setStatus] = useState<TheatreBlockStatus>(
    TheatreBlockStatus.Released,
  );
  const [resolutionReason, setResolutionReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setSaving(true);

    try {
      const res = await clientFetch('/api/theatre/block/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theatreBlockId: block.id,
          status,
          resolutionReason: resolutionReason || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Failed to resolve theatre block');
      }

      setSaved(true);
      setTimeout(() => onSuccess(), 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setSaving(false);
    }
  }, [block.id, status, resolutionReason, onSuccess]);

  const selected = RESOLUTION_OPTIONS.find((o) => o.value === status)!;

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="relative border-b border-slate-100 bg-gradient-to-r from-rose-50/60 to-white px-6 py-5">
          <h3 className="text-base font-bold text-slate-900">
            Resolve Theatre Block
          </h3>
          <p className="text-xs text-slate-500">
            Block{' '}
            <span className="font-mono font-bold text-slate-700">
              {block.id.slice(0, 8)}…
            </span>
          </p>
          <button
            onClick={onCancel}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-800"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="space-y-2">
            {RESOLUTION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const sel = status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${sel
                      ? `${opt.bg} ${opt.pill} ring-2 ${opt.ring}`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${sel ? 'bg-white/60' : 'bg-slate-100'
                      }`}
                  >
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Resolution Note{' '}
              <span className="font-normal normal-case text-slate-400">
                (optional)
              </span>
            </label>
            <textarea
              value={resolutionReason}
              onChange={(e) => setResolutionReason(e.target.value)}
              rows={2}
              placeholder="e.g. Maintenance completed ahead of schedule"
              className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-rose-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
              <AlertTriangle
                size={15}
                className="mt-0.5 shrink-0 text-rose-600"
              />
              <p className="text-sm font-medium text-rose-800">{error}</p>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
              <p className="text-sm font-medium text-emerald-800">
                Block resolved!
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              onClick={onCancel}
              disabled={saving}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving || saved}
              className={`inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold !text-white shadow-sm transition disabled:opacity-60 active:scale-95 ${selected.value === TheatreBlockStatus.Released
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : selected.value === TheatreBlockStatus.Completed
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-slate-600 hover:bg-slate-700'
                }`}
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Resolving…
                </>
              ) : (
                <>
                  {selected && <selected.icon size={13} />}
                  {selected.label}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}