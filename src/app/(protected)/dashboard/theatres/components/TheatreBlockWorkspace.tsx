'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import {
  ArrowLeft,
  Ban,
  RefreshCw,
  ShieldOff,
} from 'lucide-react';

import Link from 'next/link';

import {
  ActiveBlocksForTheatreQuery,
  GetTheatreByIdQuery,
  TheatreBlockType,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

import TheatreBlockBoard from './TheatreBlockBoard';
import TheatreBlockCreateForm from './TheatreBlockCreateForm';
import TheatreBlockUpdateForm from './TheatreBlockUpdateForm';
import TheatreBlockResolveModal from './TheatreBlockResolveModal';

type Theatre = GetTheatreByIdQuery['theatreById'];
type Block = ActiveBlocksForTheatreQuery['activeBlocksForTheatre'][number];

type View = 'board' | 'create' | 'update';

interface Props {
  theatre: Theatre;
  initialBlocks: Block[];
}

export default function TheatreBlockWorkspace({
  theatre,
  initialBlocks,
}: Props) {
  const router = useRouter();

  const [view, setView] = useState<View>('board');
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [resolvingBlock, setResolvingBlock] = useState<Block | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refresh = useCallback(async () => {
    if (!theatre) return;
    setSyncing(true);
    try {
      const res = await clientFetch(
        `/api/theatre/active-blocks?theatreId=${theatre.id}`,
      );
      const json = await res.json();
      if (Array.isArray(json)) {
        setBlocks(json);
      }
      router.refresh();
    } finally {
      setSyncing(false);
    }
  }, [theatre, router]);

  const handleSuccess = useCallback(async () => {
    await refresh();
    setView('board');
    setEditingBlock(null);
  }, [refresh]);

  const handleResolveSuccess = useCallback(async () => {
    await refresh();
    setResolvingBlock(null);
  }, [refresh]);

  const handleEditRequest = useCallback((block: Block) => {
    setEditingBlock(block);
    setView('update');
  }, []);

  if (!theatre) return null;

  const maintenanceCount = blocks.filter(
    (b) => b.type === TheatreBlockType.Maintenance,
  ).length;
  const totalBlocks = blocks.length;

  return (
    <>
      {resolvingBlock && (
        <TheatreBlockResolveModal
          block={resolvingBlock}
          onSuccess={handleResolveSuccess}
          onCancel={() => setResolvingBlock(null)}
        />
      )}

      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-white to-amber-50/40" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg,#000 0,#000 1px,transparent 1px,transparent 40px), repeating-linear-gradient(90deg,#000 0,#000 1px,transparent 1px,transparent 40px)',
            }}
          />

          <div className="relative px-6 py-6 sm:px-8 sm:py-8">
            <Link
              href={`/dashboard/theatres/${theatre.id}`}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition hover:border-slate-300 hover:bg-white hover:text-slate-900"
            >
              <ArrowLeft size={13} />
              Back to Theatre
            </Link>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-rose-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-rose-700">
                  <ShieldOff className="h-3.5 w-3.5" />
                  Block Console
                </div>

                <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                  {theatre.name}
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
                  Manage scheduling blocks — maintenance holds, emergency
                  closures, and administrative restrictions for this theatre.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <StatChip label="Total blocks" value={totalBlocks} color="rose" />
                <StatChip label="Maintenance" value={maintenanceCount} color="amber" />
              </div>
            </div>

            <div className="mt-6 flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1 w-fit">
              <TabButton
                active={view === 'board'}
                onClick={() => setView('board')}
                label="Active Blocks"
              />
              <TabButton
                active={view === 'create'}
                onClick={() => setView('create')}
                label="New Block"
                accent
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={refresh}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
          >
            <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {view === 'board' && (
          <TheatreBlockBoard
            blocks={blocks}
            onCreateRequest={() => setView('create')}
            onEditRequest={handleEditRequest}
            onResolveRequest={(block) => setResolvingBlock(block)}
          />
        )}

        {view === 'create' && (
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-rose-50/60 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Create Theatre Block
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define a time window where bookings are restricted
                  </p>
                </div>
                <Ban size={18} className="text-rose-400" />
              </div>
            </div>
            <div className="p-6">
              <TheatreBlockCreateForm
                theatreId={theatre.id}
                onSuccess={handleSuccess}
                onCancel={() => setView('board')}
              />
            </div>
          </div>
        )}

        {view === 'update' && editingBlock && (
          <TheatreBlockUpdateForm
            block={editingBlock}
            onSuccess={handleSuccess}
            onCancel={() => {
              setView('board');
              setEditingBlock(null);
            }}
          />
        )}
      </div>
    </>
  );
}

function StatChip({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: 'rose' | 'amber' | 'red';
}) {
  const palette = {
    rose: 'bg-rose-50 border-rose-200 text-rose-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 ${palette[color]}`}
    >
      <span className="text-2xl font-black leading-none">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  accent = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  accent?: boolean;
}) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className={`rounded-xl px-5 py-2 text-xs font-bold shadow-sm transition ${
          accent ? 'bg-rose-600 !text-white' : 'bg-white text-slate-900'
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-5 py-2 text-xs font-semibold transition ${
        accent
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-slate-500 hover:bg-white/60 hover:text-slate-800'
      }`}
    >
      {label}
    </button>
  );
}