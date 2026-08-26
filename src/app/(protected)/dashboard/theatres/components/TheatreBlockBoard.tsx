'use client';

import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  ChevronRight,
  Clock,
  Droplets,
  Edit3,
  Lock,
  Sparkles,
  Shield,
  Thermometer,
  TriangleAlert,
  Unlock,
  Wrench,
  Zap,
} from 'lucide-react';

import {
  ActiveBlocksForTheatreQuery,
  TheatreBlockType,
} from '@/shared/graphql/generated/graphql';

type Block = ActiveBlocksForTheatreQuery['activeBlocksForTheatre'][number];

interface Props {
  blocks: Block[];
  onCreateRequest: () => void;
  onEditRequest: (block: Block) => void;
  onResolveRequest: (block: Block) => void;
}

const TYPE_CONFIG: Record<
  TheatreBlockType,
  {
    label: string;
    icon: React.ElementType;
    pill: string;
    bar: string;
  }
> = {
  [TheatreBlockType.Maintenance]: {
    label: 'Maintenance',
    icon: Wrench,
    pill: '!bg-[#FFF8EC] !border-[#F5E3C0] !text-[#B9770E]',
    bar: '!bg-[#D08A2E]',
  },
  [TheatreBlockType.Cleaning]: {
    label: 'Cleaning',
    icon: Sparkles,
    pill: '!bg-[#EFF5FF] !border-[#D6E4FB] !text-[#1D6FE0]',
    bar: '!bg-[#1D6FE0]',
  },
  [TheatreBlockType.EquipmentFailure]: {
    label: 'Equipment failure',
    icon: TriangleAlert,
    pill: '!bg-[#FFF1E9] !border-[#FAD9C4] !text-[#C2571C]',
    bar: '!bg-[#EA6C2E]',
  },
  [TheatreBlockType.InfectionControl]: {
    label: 'Infection control',
    icon: Shield,
    pill: '!bg-[#FEF2F2] !border-[#FBD5D5] !text-[#DC2626]',
    bar: '!bg-[#DC2626]',
  },
  [TheatreBlockType.Sterilization]: {
    label: 'Sterilization',
    icon: Thermometer,
    pill: '!bg-[#F5F2FF] !border-[#E5DCFC] !text-[#7C5CFC]',
    bar: '!bg-[#7C5CFC]',
  },
  [TheatreBlockType.Reserved]: {
    label: 'Reserved',
    icon: Droplets,
    pill: '!bg-[#ECFBF5] !border-[#CFF0E1] !text-[#1D9E75]',
    bar: '!bg-[#1D9E75]',
  },
  [TheatreBlockType.Other]: {
    label: 'Other',
    icon: Zap,
    pill: '!bg-[#F7F7F5] !border-[#E8E6E0] !text-[#767570]',
    bar: '!bg-[#B4B2A9]',
  },
};

function formatDateTime(dt: string): { date: string; time: string } {
  const d = new Date(dt);
  return {
    date: d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }),
    time: d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
    }),
  };
}

function durationLabel(start: string, end: string): string {
  const mins = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 60000,
  );
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function isOngoing(start: string, end: string): boolean {
  const now = Date.now();
  return new Date(start).getTime() <= now && new Date(end).getTime() >= now;
}

function isUpcoming(start: string): boolean {
  return new Date(start).getTime() > Date.now();
}

export default function TheatreBlockBoard({
  blocks,
  onCreateRequest,
  onEditRequest,
  onResolveRequest,
}: Props) {
  const ongoing = blocks.filter((b) => isOngoing(b.startTime, b.endTime));
  const upcoming = blocks.filter((b) => isUpcoming(b.startTime));
  const past = blocks.filter(
    (b) => !isOngoing(b.startTime, b.endTime) && !isUpcoming(b.startTime),
  );

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
        <p className="text-sm font-medium !text-[#767570]">
          {blocks.length === 0
            ? 'No active blocks'
            : `${blocks.length} active block${blocks.length !== 1 ? 's' : ''}`}
        </p>

        <button
          onClick={onCreateRequest}
          className="inline-flex items-center justify-center gap-2 rounded-xl !bg-[#DC2626] px-4 py-2.5 text-xs font-semibold !text-white transition hover:!bg-[#C11F1F]"
        >
          <Lock size={13} />
          New block
        </button>
      </div>

      {blocks.length === 0 ? (
        <EmptyState onCreateRequest={onCreateRequest} />
      ) : (
        <div className="space-y-7 sm:space-y-8">
          {ongoing.length > 0 && (
            <Section
              title="Ongoing"
              dot="!bg-[#DC2626]"
              badge={ongoing.length}
              blocks={ongoing}
              onEdit={onEditRequest}
              onResolve={onResolveRequest}
            />
          )}
          {upcoming.length > 0 && (
            <Section
              title="Upcoming"
              dot="!bg-[#D08A2E]"
              badge={upcoming.length}
              blocks={upcoming}
              onEdit={onEditRequest}
              onResolve={onResolveRequest}
            />
          )}
          {past.length > 0 && (
            <Section
              title="Recently started"
              dot="!bg-[#B4B2A9]"
              badge={past.length}
              blocks={past}
              onEdit={onEditRequest}
              onResolve={onResolveRequest}
            />
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  dot,
  badge,
  blocks,
  onEdit,
  onResolve,
}: {
  title: string;
  dot: string;
  badge: number;
  blocks: Block[];
  onEdit: (b: Block) => void;
  onResolve: (b: Block) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <h3 className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
          {title}
        </h3>
        <span className="rounded-full !bg-[#F7F7F5] px-2 py-0.5 text-[10px] font-semibold !text-[#767570]">
          {badge}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {blocks.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            onEdit={() => onEdit(block)}
            onResolve={() => onResolve(block)}
          />
        ))}
      </div>
    </div>
  );
}

function BlockCard({
  block,
  onEdit,
  onResolve,
}: {
  block: Block;
  onEdit: () => void;
  onResolve: () => void;
}) {
  const cfg =
    TYPE_CONFIG[block.type as TheatreBlockType] ??
    TYPE_CONFIG[TheatreBlockType.Other];
  const Icon = cfg.icon;
  const start = formatDateTime(block.startTime);
  const end = formatDateTime(block.endTime);
  const dur = durationLabel(block.startTime, block.endTime);
  const ongoing = isOngoing(block.startTime, block.endTime);

  return (
    <div className="relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition hover:!border-[#D3D1C7]">
      {ongoing && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full !bg-[#FEF2F2] px-2 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full !bg-[#DC2626]" />
          <span className="text-[9px] font-semibold uppercase tracking-widest !text-[#DC2626]">
            Live
          </span>
        </div>
      )}

      <div className="px-4 pb-4 pl-6 pt-4 sm:px-5 sm:pl-7 sm:pt-5">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cfg.pill}`}
          >
            <Icon size={9} />
            {cfg.label}
          </span>

          <span className="ml-auto text-[10px] font-semibold !text-[#B4B2A9]">
            {dur}
          </span>
        </div>

        <div className="mb-3 space-y-1">
          <TimeRow label="Start" date={start.date} time={start.time} />
          <div className="pl-1">
            <ChevronRight size={10} className="!text-[#D3D1C7]" />
          </div>
          <TimeRow label="End" date={end.date} time={end.time} />
        </div>

        {block.reason && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed !text-[#767570]">
            <AlertTriangle size={11} className="mt-0.5 shrink-0 !text-[#D08A2E]" />
            {block.reason}
          </p>
        )}

        {block.createdBy?.fullName && (
          <p className="mt-2 text-[10px] !text-[#B4B2A9]">
            Blocked by{' '}
            <span className="font-semibold !text-[#5F5E5A]">
              {block.createdBy.fullName}
            </span>
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 border-t !border-[#F0EFE9] pt-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-lg border !border-[#E8E6E0] !bg-white px-2.5 py-2 text-[10px] font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5]"
          >
            <Edit3 size={10} />
            Edit
          </button>

          <button
            onClick={onResolve}
            className="inline-flex items-center gap-1.5 rounded-lg border !border-[#CFF0E1] !bg-[#ECFBF5] px-2.5 py-2 text-[10px] font-semibold !text-[#1D9E75] transition hover:!bg-[#DCF5EA]"
          >
            <Unlock size={10} />
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
}

function TimeRow({
  label,
  date,
  time,
}: {
  label: string;
  date: string;
  time: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Clock size={11} className="shrink-0 !text-[#B4B2A9]" />
      <span className="w-8 text-[10px] font-semibold uppercase tracking-wide !text-[#B4B2A9]">
        {label}
      </span>
      <span className="text-xs font-semibold !text-[#16211B]">{time}</span>
      <span className="text-[10px] !text-[#B4B2A9]">{date}</span>
    </div>
  );
}

function EmptyState({ onCreateRequest }: { onCreateRequest: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed !border-[#E8E6E0] !bg-white py-16 text-center sm:py-20">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl !bg-[#ECFBF5]">
        <CheckCircle2 className="h-6 w-6 !text-[#1D9E75]" />
      </div>

      <p className="text-base font-semibold !text-[#16211B]">No active blocks</p>
      <p className="mt-1.5 max-w-sm px-6 text-sm !text-[#767570]">
        This theatre is fully open. Add a block to restrict scheduling during
        maintenance, emergencies, or administrative holds.
      </p>

      <button
        onClick={onCreateRequest}
        className="mt-6 inline-flex items-center gap-2 rounded-xl !bg-[#DC2626] px-5 py-2.5 text-sm font-semibold !text-white transition hover:!bg-[#C11F1F]"
      >
        <Ban size={14} />
        Add theatre block
      </button>
    </div>
  );
}