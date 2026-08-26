'use client';

import { useMemo, useState } from 'react';
import { message } from 'antd';
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  Loader2,
  ShieldAlert,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';

import {
  ChargeDomain,
  GetVisitByIdQuery,
  GetVisitProceduresByVisitQuery,
  VisitProcedurePriority,
} from '@/shared/graphql/generated/graphql';

import { useBilling } from '@/hooks/billing/useBilling';

import CreateVisitProcedureForm from './components/CreateVisitProcedureForm';
import { ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { formatDuration } from '../../../visit-procedures/types/procedure-functions';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type VisitProcedureItem =
  GetVisitProceduresByVisitQuery['visitProceduresByVisit'][number];

const priorityStyles: Record<string, string> = {
  LOW: '!bg-[#F7F7F5] !text-[#767570] !border-[#E8E6E0]',
  NORMAL: '!bg-[#EFF5FF] !text-[#1D6FE0] !border-[#D6E4FB]',
  HIGH: '!bg-[#FFF1E9] !text-[#C2571C] !border-[#FAD9C4]',
  URGENT: '!bg-[#FEF2F2] !text-[#DC2626] !border-[#FBD5D5]',
};

const STATUS_DOT: Record<string, string> = {
  PENDING: '!bg-[#D08A2E]',
  IN_PROGRESS: '!bg-[#1D6FE0]',
  COMPLETED: '!bg-[#1D9E75]',
  CANCELLED: '!bg-[#B4B2A9]',
};

export default function VisitProcedureClient({
  visit,
  initialProcedures,
}: {
  visit: GetVisitByIdQuery['visit'];
  initialProcedures: VisitProcedureItem[];
}) {
  const [procedures, setProcedures] =
    useState(initialProcedures ?? []);

  const [loading, setLoading] =
    useState(false);

  const { catalogs } =
    useBilling(ChargeDomain.Procedure);

  const refresh = async () => {
    try {
      setLoading(true);

      const res = await clientFetch(
        `/api/visit-procedure/by-visit?visitId=${visit.id}&t=${Date.now()}`,
        {
          cache: 'no-store',
        }
      );

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error ||
          'Failed to load procedures'
        );

        return;
      }

      setProcedures(
        json.procedures ??
        json.visitProcedures ??
        []
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: procedures.length,
      urgent: procedures.filter(
        p =>
          p.priority ===
          VisitProcedurePriority.Urgent
      ).length,
      completed: procedures.filter(
        p => p.status === 'COMPLETED'
      ).length,
    };
  }, [procedures]);

  return (
    <div className="min-h-screen !bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-5">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1 text-xs font-medium !text-[#1D9E75]">
                <ClipboardList size={13} />
                Procedure management
              </div>

              <h1 className="text-2xl font-bold tracking-tight !text-[#16211B] sm:text-[28px]">
                Visit procedures
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-[#767570]">
                Create, monitor, and manage all procedures assigned to this
                patient visit in an organized clinical workflow.
              </p>
            </div>

            <div className="mb-5 h-px !bg-[#E8E6E0]" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-[#EFF5FF] !text-[#1D6FE0]">
                    <Activity size={16} />
                  </div>
                  <span className="font-mono text-2xl font-semibold tabular-nums !text-[#16211B]">{stats.total}</span>
                </div>
                <p className="text-xs font-medium !text-[#767570]">Total procedures</p>
              </div>

              <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-[#FEF2F2] !text-[#DC2626]">
                    <ShieldAlert size={16} />
                  </div>
                  <span className="font-mono text-2xl font-semibold tabular-nums !text-[#16211B]">{stats.urgent}</span>
                </div>
                <p className="text-xs font-medium !text-[#767570]">Urgent cases</p>
              </div>

              <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg !bg-[#ECFBF5] !text-[#1D9E75]">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-mono text-2xl font-semibold tabular-nums !text-[#16211B]">{stats.completed}</span>
                </div>
                <p className="text-xs font-medium !text-[#767570]">Completed</p>
              </div>
            </div>
          </div>
        </header>

        <CreateVisitProcedureForm
          visitId={visit.id}
          catalogs={catalogs}
          onCreated={refresh}
        />

        <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1 text-xs font-semibold uppercase tracking-wide !text-[#1D9E75]">
                <ClipboardList size={13} />
                Procedure list
              </div>

              {loading && (
                <div className="inline-flex items-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-2.5 text-sm font-medium !text-[#5F5E5A]">
                  <Loader2 size={15} className="animate-spin !text-[#1D9E75]" />
                  Refreshing procedures…
                </div>
              )}
            </div>
          </div>

          {procedures.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl !bg-[#F7F7F5]">
                <ClipboardList size={26} className="!text-[#B4B2A9]" />
              </div>

              <h3 className="mt-5 text-base font-semibold !text-[#16211B]">
                No procedures yet
              </h3>

              <p className="mt-1.5 max-w-md text-sm leading-relaxed !text-[#767570]">
                Procedures created for this visit will automatically appear
                here for tracking and management.
              </p>
            </div>
          ) : (
            <div className="divide-y !divide-[#E8E6E0]">
              {procedures.map(p => (
                <div
                  key={p.id}
                  className="px-4 py-4 transition hover:!bg-[#FAFAF8] sm:px-6 sm:py-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight !text-[#16211B] sm:text-lg">
                          {p.customProcedureName ?? p.procedureCatalog?.name}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            priorityStyles[p.priority ?? 'NORMAL'] ?? priorityStyles.NORMAL
                          }`}
                        >
                          {p.priority ?? 'NORMAL'}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 !text-[#767570]">
                          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[p.status ?? ''] ?? '!bg-[#B4B2A9]'}`} />
                          <span className="font-medium !text-[#16211B]">
                            {p.status}
                          </span>
                        </div>

                        {p.procedureCatalog?.code && (
                          <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 !text-[#767570]">
                            <span className="font-medium !text-[#B4B2A9]">
                              Code:
                            </span>
                            <span className="font-semibold !text-[#16211B]">
                              {p.procedureCatalog.code}
                            </span>
                          </div>
                        )}

                        {p.estimatedDuration && (
                          <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 !text-[#767570]">
                            <ClockCircleOutlined />
                            <span>{formatDuration(p.estimatedDuration)}</span>
                          </div>
                        )}
                      </div>

                      {p.notes && (
                        <div className="mt-3 rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] px-4 py-3.5 text-sm leading-relaxed !text-[#5F5E5A]">
                          {p.notes}
                        </div>
                      )}
                    </div>

                    <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST]}>
                      <div className="flex w-full flex-row gap-3 sm:w-auto">
                        <Link
                          href={`/dashboard/visit-procedures/${p.id}`}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border !border-[#E8E6E0] !bg-white px-4 text-sm font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] sm:flex-none"
                        >
                          <EyeOutlined />
                          <span>View</span>
                        </Link>
                      </div>
                    </HasRoles>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}