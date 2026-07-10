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

type VisitProcedureItem =
  GetVisitProceduresByVisitQuery['visitProceduresByVisit'][number];

const priorityStyles: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  NORMAL:
    'bg-blue-50 text-blue-700 border-blue-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-3 lg:px-3 space-y-6">

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white">

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-6">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <ClipboardList size={13} />
                Procedure management
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Visit procedures
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-500">
                Create, monitor, and manage all procedures assigned to this patient visit
                in an organized clinical workflow.
              </p>
            </div>
            <div className="mb-6 h-px bg-slate-100" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Activity size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{stats.total}</span>
                </div>
                <p className="text-xs font-medium text-slate-500">Total procedures</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600">
                    <ShieldAlert size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{stats.urgent}</span>
                </div>
                <p className="text-xs font-medium text-slate-500">Urgent cases</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-2xl font-semibold text-slate-900">{stats.completed}</span>
                </div>
                <p className="text-xs font-medium text-slate-500">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <CreateVisitProcedureForm
          visitId={visit.id}
          catalogs={catalogs}
          onCreated={refresh}
        />

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  <ClipboardList size={14} />
                  Procedure list
                </div>
              </div>

              {loading && (
                <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
                  <Loader2
                    size={16}
                    className="animate-spin text-blue-600"
                  />

                  Refreshing procedures...
                </div>
              )}
            </div>
          </div>

          {procedures.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
                <ClipboardList
                  size={34}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-800">
                No Procedures Yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Procedures created for this visit will automatically appear here
                for tracking and management.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {procedures.map(p => (
                <div
                  key={p.id}
                  className="
                        group relative overflow-hidden
                        px-5 py-5 sm:px-6 sm:py-6
                        transition-all duration-300
                        hover:bg-gradient-to-r
                        hover:from-slate-50
                        hover:to-blue-50/40
                    "
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="truncate text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                          {p.customProcedureName ??
                            p.procedureCatalog?.name}
                        </h3>

                        <span
                          className={`
                                        rounded-full border px-3 py-1
                                        text-xs font-bold uppercase tracking-wide
                                        ${priorityStyles[
                            p.priority ?? 'NORMAL'
                            ]}
                                    `}
                        >
                          {p.priority ?? 'NORMAL'}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          <span className="font-medium">
                            {p.status}
                          </span>
                        </div>

                        {p.procedureCatalog?.code && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
                            <span className="font-semibold text-slate-500">
                              Code:
                            </span>

                            <span className="font-bold text-slate-800">
                              {p.procedureCatalog.code}
                            </span>
                          </div>
                        )}

                        {p.estimatedDuration && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
                            <ClockCircleOutlined />

                            <span>
                              {formatDuration(
                                p.estimatedDuration
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {p.notes && (
                        <div className="mt-4 rounded-2xl border border-slate-100 bg-white/80 px-4 py-4 text-sm leading-relaxed text-slate-600 shadow-sm">
                          {p.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-row gap-3 sm:w-auto">
                      <Link
                        href={`/dashboard/visit-procedures/${p.id}`}
                        className="
                                    flex-1 sm:flex-none
                                    inline-flex h-12 items-center justify-center gap-2
                                    rounded-2xl border border-slate-200
                                    bg-white px-5
                                    text-sm font-bold text-slate-700
                                    shadow-sm transition-all duration-200
                                    hover:-translate-y-0.5
                                    hover:border-slate-300
                                    hover:bg-slate-50
                                    hover:shadow-md
                                "
                      >
                        <EyeOutlined />

                        <span>View</span>
                      </Link>
                    </div>
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