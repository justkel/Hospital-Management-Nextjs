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
  active: string;
  iconActive: string;
  buttonBg: string;
}[] = [
    {
      value: TheatreBlockStatus.Released,
      label: 'Release',
      description: 'Unblock the theatre immediately — end time will be set to now',
      icon: Unlock,
      active: '!border-[#CFF0E1] !bg-[#ECFBF5]',
      iconActive: '!bg-white !text-[#1D9E75]',
      buttonBg: '!bg-[#1D9E75] hover:!bg-[#188A66]',
    },
    {
      value: TheatreBlockStatus.Completed,
      label: 'Mark completed',
      description: 'Block ran its course and is now finished',
      icon: CheckSquare,
      active: '!border-[#D6E4FB] !bg-[#EFF5FF]',
      iconActive: '!bg-white !text-[#1D6FE0]',
      buttonBg: '!bg-[#1D6FE0] hover:!bg-[#1A5FC4]',
    },
    {
      value: TheatreBlockStatus.Cancelled,
      label: 'Cancel',
      description: 'Block is voided — it no longer applies',
      icon: Trash2,
      active: '!border-[#16211B] !bg-[#F7F7F5]',
      iconActive: '!bg-white !text-[#16211B]',
      buttonBg: '!bg-[#0c1a12] hover:!bg-[#16211B]',
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
    <div className="fixed inset-0 z-50 flex items-end justify-center !bg-black/40 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl !bg-white sm:rounded-2xl">
        <div className="sticky top-0 z-10 border-b !border-[#E8E6E0] !bg-white px-5 py-4 sm:px-6 sm:py-5">
          <h3 className="text-base font-semibold !text-[#16211B]">
            Resolve theatre block
          </h3>
          <p className="text-xs !text-[#767570]">
            Block{' '}
            <span className="font-mono font-semibold !text-[#5F5E5A]">
              {block.id.slice(0, 8)}…
            </span>
          </p>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border !border-[#E8E6E0] !text-[#B4B2A9] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B] sm:right-5 sm:top-5"
          >
            <X size={14} />
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            {RESOLUTION_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const sel = status === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setStatus(opt.value)}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition sm:p-4 ${sel
                      ? opt.active
                      : '!border-[#E8E6E0] !bg-white hover:!bg-[#FAFAF8]'
                    }`}
                >
                  <div
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${sel ? opt.iconActive : '!bg-[#F7F7F5] !text-[#B4B2A9]'
                      }`}
                  >
                    <Icon size={15} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold !text-[#16211B]">
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed !text-[#767570]">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
              Resolution note{' '}
              <span className="font-normal normal-case !text-[#D3D1C7]">
                (optional)
              </span>
            </label>
            <textarea
              value={resolutionReason}
              onChange={(e) => setResolutionReason(e.target.value)}
              rows={2}
              placeholder="e.g. Maintenance completed ahead of schedule"
              className="resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75]"
            />
          </div>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3.5">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 !text-[#DC2626]"
              />
              <p className="text-sm font-medium !text-[#DC2626]">{error}</p>
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-3 rounded-xl border !border-[#CFF0E1] !bg-[#ECFBF5] px-4 py-3.5">
              <CheckCircle2 size={14} className="shrink-0 !text-[#1D9E75]" />
              <p className="text-sm font-medium !text-[#1D9E75]">
                Block resolved.
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t !border-[#E8E6E0] pt-4 xs:flex-row xs:items-center xs:justify-end">
            <button
              onClick={onCancel}
              disabled={saving}
              className="h-10 rounded-xl border !border-[#E8E6E0] px-4 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={saving || saved}
              className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl px-5 text-xs font-semibold !text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${selected.buttonBg}`}
            >
              {saving ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
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