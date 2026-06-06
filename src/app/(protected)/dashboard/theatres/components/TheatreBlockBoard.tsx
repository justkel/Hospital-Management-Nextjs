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
    glow: string;
  }
> = {
  [TheatreBlockType.Maintenance]: {
    label: 'Maintenance',
    icon: Wrench,
    pill: 'bg-amber-50 border-amber-200 text-amber-700',
    bar: 'bg-amber-400',
    glow: 'shadow-amber-100',
  },
  [TheatreBlockType.Cleaning]: {
    label: 'Cleaning',
    icon: Sparkles,
    pill: 'bg-cyan-50 border-cyan-200 text-cyan-700',
    bar: 'bg-cyan-400',
    glow: 'shadow-cyan-100',
  },
  [TheatreBlockType.EquipmentFailure]: {
    label: 'Equipment Failure',
    icon: TriangleAlert,
    pill: 'bg-orange-50 border-orange-200 text-orange-700',
    bar: 'bg-orange-400',
    glow: 'shadow-orange-100',
  },
  [TheatreBlockType.InfectionControl]: {
    label: 'Infection Control',
    icon: Shield,
    pill: 'bg-red-50 border-red-200 text-red-700',
    bar: 'bg-red-400',
    glow: 'shadow-red-100',
  },
  [TheatreBlockType.Sterilization]: {
    label: 'Sterilization',
    icon: Thermometer,
    pill: 'bg-violet-50 border-violet-200 text-violet-700',
    bar: 'bg-violet-400',
    glow: 'shadow-violet-100',
  },
  [TheatreBlockType.Reserved]: {
    label: 'Reserved',
    icon: Droplets,
    pill: 'bg-blue-50 border-blue-200 text-blue-700',
    bar: 'bg-blue-400',
    glow: 'shadow-blue-100',
  },
  [TheatreBlockType.Other]: {
    label: 'Other',
    icon: Zap,
    pill: 'bg-slate-50 border-slate-200 text-slate-600',
    bar: 'bg-slate-400',
    glow: 'shadow-slate-100',
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {blocks.length === 0
            ? 'No active blocks'
            : `${blocks.length} active block${blocks.length !== 1 ? 's' : ''}`}
        </p>

        <button
          onClick={onCreateRequest}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold !text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
        >
          <Lock size={13} />
          New Block
        </button>
      </div>

      {blocks.length === 0 ? (
        <EmptyState onCreateRequest={onCreateRequest} />
      ) : (
        <div className="space-y-8">
          {ongoing.length > 0 && (
            <Section
              title="Ongoing"
              dot="bg-rose-500"
              badge={ongoing.length}
              blocks={ongoing}
              onEdit={onEditRequest}
              onResolve={onResolveRequest}
            />
          )}
          {upcoming.length > 0 && (
            <Section
              title="Upcoming"
              dot="bg-amber-500"
              badge={upcoming.length}
              blocks={upcoming}
              onEdit={onEditRequest}
              onResolve={onResolveRequest}
            />
          )}
          {past.length > 0 && (
            <Section
              title="Recently started"
              dot="bg-slate-400"
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
      <div className="mb-3 flex items-center gap-2.5">
        <div className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">
          {title}
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
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
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border bg-white shadow-sm transition hover:shadow-lg ${cfg.glow}`}
      style={{ borderColor: 'rgb(226 232 240)' }}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${cfg.bar}`}
      />

      {ongoing && (
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 border border-rose-200">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-rose-600">
            Live
          </span>
        </div>
      )}

      <div className="px-5 pb-4 pt-5 pl-7">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${cfg.pill}`}
          >
            <Icon size={9} />
            {cfg.label}
          </span>

          <span className="ml-auto text-[10px] font-bold text-slate-400">
            {dur}
          </span>
        </div>

        <div className="space-y-1.5 mb-3">
          <TimeRow label="Start" date={start.date} time={start.time} />
          <div className="flex items-center gap-1.5 pl-1">
            <ChevronRight size={10} className="text-slate-300" />
          </div>
          <TimeRow label="End" date={end.date} time={end.time} />
        </div>

        {block.reason && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-slate-500">
            <AlertTriangle size={11} className="mt-0.5 shrink-0 text-amber-400" />
            {block.reason}
          </p>
        )}

        {block.createdBy?.fullName && (
          <p className="mt-2 text-[10px] text-slate-400">
            Blocked by{' '}
            <span className="font-semibold text-slate-600">
              {block.createdBy.fullName}
            </span>
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 border-t border-slate-50 pt-3">
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600 transition hover:border-slate-300 hover:bg-white active:scale-95"
          >
            <Edit3 size={10} />
            Edit
          </button>

          <button
            onClick={onResolve}
            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-700 transition hover:bg-rose-100 active:scale-95"
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
    <div className="flex items-center gap-2">
      <Clock size={11} className="shrink-0 text-slate-400" />
      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400 w-7">
        {label}
      </span>
      <span className="text-xs font-bold text-slate-800">{time}</span>
      <span className="text-[10px] text-slate-400">{date}</span>
    </div>
  );
}

function EmptyState({ onCreateRequest }: { onCreateRequest: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-50">
        <CheckCircle2 className="h-8 w-8 text-rose-400" />
      </div>

      <p className="text-lg font-black text-slate-800">No active blocks</p>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        This theatre is fully open. Add a block to restrict scheduling during
        maintenance, emergencies, or administrative holds.
      </p>

      <button
        onClick={onCreateRequest}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3 text-sm font-bold !text-white shadow-sm transition hover:bg-rose-700 active:scale-95"
      >
        <Ban size={14} />
        Add Theatre Block
      </button>
    </div>
  );
}