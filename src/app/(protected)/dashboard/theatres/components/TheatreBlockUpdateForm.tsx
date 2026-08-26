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
  color: string;
  bg: string;
  border: string;
  ring: string;
}[] = [
  {
    value: TheatreBlockType.Maintenance,
    label: 'Maintenance',
    icon: Wrench,
    color: '!text-amber-700',
    bg: '!bg-amber-50',
    border: '!border-amber-200',
    ring: 'focus:ring-amber-500/20',
  },
  {
    value: TheatreBlockType.Cleaning,
    label: 'Cleaning',
    icon: Sparkles,
    color: '!text-cyan-700',
    bg: '!bg-cyan-50',
    border: '!border-cyan-200',
    ring: 'focus:ring-cyan-500/20',
  },
  {
    value: TheatreBlockType.EquipmentFailure,
    label: 'Equipment Failure',
    icon: TriangleAlert,
    color: '!text-orange-700',
    bg: '!bg-orange-50',
    border: '!border-orange-200',
    ring: 'focus:ring-orange-500/20',
  },
  {
    value: TheatreBlockType.InfectionControl,
    label: 'Infection Control',
    icon: Shield,
    color: '!text-red-700',
    bg: '!bg-red-50',
    border: '!border-red-200',
    ring: 'focus:ring-red-500/20',
  },
  {
    value: TheatreBlockType.Sterilization,
    label: 'Sterilization',
    icon: Thermometer,
    color: '!text-violet-700',
    bg: '!bg-violet-50',
    border: '!border-violet-200',
    ring: 'focus:ring-violet-500/20',
  },
  {
    value: TheatreBlockType.Reserved,
    label: 'Reserved',
    icon: Droplets,
    color: '!text-blue-700',
    bg: '!bg-blue-50',
    border: '!border-blue-200',
    ring: 'focus:ring-blue-500/20',
  },
  {
    value: TheatreBlockType.Other,
    label: 'Other',
    icon: Zap,
    color: '!text-slate-600',
    bg: '!bg-slate-50',
    border: '!border-slate-200',
    ring: 'focus:ring-slate-500/20',
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
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong'
      );
    } finally {
      setSaving(false);
    }
  }, [block.id, startTime, endTime, type, reason, onSuccess]);

  const selectedTypeConfig = TYPE_OPTIONS.find(opt => opt.value === type) || TYPE_OPTIONS[0];

  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold !text-[#16211B]">
              Edit block
            </h3>
            <p className="mt-0.5 text-xs !text-[#767570]">
              Update block{' '}
              <span className="font-mono font-semibold !text-[#16211B]">
                {block.id.slice(0, 8)}…
              </span>
            </p>
          </div>
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${selectedTypeConfig.bg} ${selectedTypeConfig.color}`}>
            <selectedTypeConfig.icon size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
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
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                    selected
                      ? `${opt.bg} ${opt.color} ${opt.border} ring-2 ${opt.ring}`
                      : '!border-[#E8E6E0] !bg-white !text-[#B4B2A9] hover:!border-[#D3D1C7] hover:!text-[#5F5E5A]'
                  }`}
                >
                  <Icon size={10} />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
              End Date & Time
            </label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm font-semibold !text-[#16211B] outline-none transition focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
            Reason <span className="font-normal normal-case !text-[#B4B2A9]">(optional)</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Reason for the block…"
            className="w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 !text-[#DC2626]" />
            <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3.5">
            <CheckCircle2 size={15} className="shrink-0 !text-[#1D9E75]" />
            <p className="text-sm font-medium !text-[#1D9E75]">
              Block updated successfully!
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end border-t !border-[#E8E6E0] pt-4">
          <button
            onClick={onCancel}
            disabled={saving}
            className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40 order-2 sm:order-1"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={saving || saved}
            className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#0c1a12] px-4 sm:px-5 text-xs sm:text-sm font-semibold !text-white transition hover:!bg-[#16211B] disabled:cursor-not-allowed disabled:opacity-50 order-1 sm:order-2"
          >
            {saving ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                <span className="sm:hidden">Saving…</span>
                <span className="hidden sm:inline">Saving…</span>
              </>
            ) : (
              <>
                <Save size={14} className="sm:hidden" />
                <Save size={13} className="hidden sm:inline" />
                <span className="sm:hidden">Save</span>
                <span className="hidden sm:inline">Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}