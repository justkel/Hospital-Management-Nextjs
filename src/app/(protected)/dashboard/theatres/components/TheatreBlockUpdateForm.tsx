'use client';

import { useCallback, useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Save,
  Shield,
  Sparkles,
  Thermometer,
  TriangleAlert,
  Wrench,
  Zap,
} from 'lucide-react';

import {
  ActiveBlocksForTheatreQuery,
  TheatreBlockType,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type Block = ActiveBlocksForTheatreQuery['activeBlocksForTheatre'][number];

interface Props {
  block: Block;
  onSuccess: () => void;
  onCancel: () => void;
}

const TYPE_OPTIONS: {
  value: TheatreBlockType;
  label: string;
  icon: React.ElementType;
  pill: string;
  ring: string;
}[] = [
  {
    value: TheatreBlockType.Maintenance,
    label: 'Maintenance',
    icon: Wrench,
    pill: 'bg-amber-50 border-amber-300 text-amber-700',
    ring: 'ring-amber-400',
  },
  {
    value: TheatreBlockType.Cleaning,
    label: 'Cleaning',
    icon: Sparkles,
    pill: 'bg-cyan-50 border-cyan-300 text-cyan-700',
    ring: 'ring-cyan-400',
  },
  {
    value: TheatreBlockType.EquipmentFailure,
    label: 'Equipment Failure',
    icon: TriangleAlert,
    pill: 'bg-orange-50 border-orange-300 text-orange-700',
    ring: 'ring-orange-400',
  },
  {
    value: TheatreBlockType.InfectionControl,
    label: 'Infection Control',
    icon: Shield,
    pill: 'bg-red-50 border-red-300 text-red-700',
    ring: 'ring-red-400',
  },
  {
    value: TheatreBlockType.Sterilization,
    label: 'Sterilization',
    icon: Thermometer,
    pill: 'bg-violet-50 border-violet-300 text-violet-700',
    ring: 'ring-violet-400',
  },
  {
    value: TheatreBlockType.Reserved,
    label: 'Reserved',
    icon: Droplets,
    pill: 'bg-blue-50 border-blue-300 text-blue-700',
    ring: 'ring-blue-400',
  },
  {
    value: TheatreBlockType.Other,
    label: 'Other',
    icon: Zap,
    pill: 'bg-slate-50 border-slate-300 text-slate-600',
    ring: 'ring-slate-400',
  },
];

function toLocalDatetime(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export default function TheatreBlockUpdateForm({
  block,
  onSuccess,
  onCancel,
}: Props) {
  const [type, setType] = useState<TheatreBlockType>(
    block.type as TheatreBlockType,
  );
  const [startTime, setStartTime] = useState(toLocalDatetime(block.startTime));
  const [endTime, setEndTime] = useState(toLocalDatetime(block.endTime));
  const [reason, setReason] = useState(block.reason ?? '');

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setError(null);

    if (new Date(startTime) >= new Date(endTime)) {
      setError('Start time must be before end time.');
      return;
    }

    setSaving(true);
    try {
      const res = await clientFetch('/api/theatre/block/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theatreBlockId: block.id,
          startTime,
          endTime,
          type,
          reason: reason || undefined,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Failed to update theatre block');
      }

      setSaved(true);
      setTimeout(() => onSuccess(), 800);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSaving(false);
    }
  }, [block.id, startTime, endTime, type, reason, onSuccess]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-amber-50/60 to-white px-6 py-5">
        <h3 className="text-base font-bold text-slate-900">Edit Block</h3>
        <p className="text-xs text-slate-500">
          Updating block{' '}
          <span className="font-mono font-bold text-slate-700">
            {block.id.slice(0, 8)}…
          </span>
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-500">
            Block Type
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPE_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const selected = type === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setType(opt.value)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-bold transition ${
                    selected
                      ? `${opt.pill} ring-2 ${opt.ring}`
                      : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Icon size={11} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-900 shadow-sm transition focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
            Reason{' '}
            <span className="font-normal normal-case text-slate-400">
              (optional)
            </span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Reason for the block…"
            className="resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-100"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
            <AlertTriangle
              size={16}
              className="mt-0.5 shrink-0 text-rose-600"
            />
            <p className="text-sm font-medium text-rose-800">{error}</p>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
            <p className="text-sm font-medium text-emerald-800">
              Block updated successfully!
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
            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-amber-600 disabled:opacity-60 active:scale-95"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving…
              </>
            ) : (
              <>
                <Save size={13} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}