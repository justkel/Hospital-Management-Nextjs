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

      <div className="space-y-4 sm:space-y-6">
        <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="p-5 sm:p-8">
            <Link
              href={`/dashboard/theatres/${theatre.id}`}
              className="mb-5 inline-flex items-center gap-1.5 rounded-lg border !border-[#E8E6E0] !bg-white px-3 py-1.5 text-xs font-medium !text-[#767570] transition hover:!bg-[#F7F7F5] hover:!text-[#16211B]"
            >
              <ArrowLeft size={12} />
              Back to theatre
            </Link>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md !bg-[#FEF2F2]">
                    <ShieldOff size={12} className="!text-[#DC2626]" />
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#DC2626]">
                    Block Console
                  </p>
                </div>

                <h1 className="mt-3 text-[22px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[28px]">
                  {theatre.name}
                </h1>

                <p className="mt-2 text-sm leading-relaxed !text-[#767570]">
                  Manage scheduling blocks — maintenance holds, emergency
                  closures, and administrative restrictions for this theatre.
                </p>
              </div>

              <div className="grid grid-cols-2 divide-x !divide-[#E8E6E0] overflow-hidden rounded-xl border !border-[#E8E6E0]">
                <div className="min-w-[92px] p-3.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    Total blocks
                  </p>
                  <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                    {String(totalBlocks).padStart(2, '0')}
                  </p>
                </div>
                <div className="min-w-[92px] p-3.5">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
                    Maintenance
                  </p>
                  <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums !text-[#16211B]">
                    {String(maintenanceCount).padStart(2, '0')}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="mt-6 flex w-full items-center gap-1 overflow-x-auto rounded-xl border !border-[#E8E6E0] !bg-[#F7F7F5] p-1 sm:w-fit hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <TabButton
                active={view === 'board'}
                onClick={() => setView('board')}
                label="Active blocks"
              />
              <TabButton
                active={view === 'create'}
                onClick={() => setView('create')}
                label="New block"
                accent
              />
            </div>
          </div>
        </header>

        <div className="flex items-center justify-end">
          <button
            onClick={refresh}
            disabled={syncing}
            className="inline-flex h-9 items-center gap-2 rounded-lg border !border-[#E8E6E0] !bg-white px-3.5 text-xs font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
          >
            <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
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
          <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
            <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold !text-[#16211B]">
                    Create theatre block
                  </h3>
                  <p className="mt-0.5 text-xs !text-[#767570]">
                    Define a time window where bookings are restricted
                  </p>
                </div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg !bg-[#FEF2F2]">
                  <Ban size={16} className="!text-[#DC2626]" />
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-6">
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
        className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition !bg-white shadow-sm ${accent ? '!text-[#DC2626]' : '!text-[#16211B]'
          }`}
      >
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium !text-[#767570] transition hover:!text-[#16211B]"
    >
      {label}
    </button>
  );
}