'use client';

import { useMemo, useState } from 'react';
import { message } from 'antd';
import {
  Activity,
  ClipboardList,
  Clock3,
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

        {/* HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-white shadow-xl shadow-slate-200/60">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-indigo-500/10" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
                  <ClipboardList size={16} />
                  Procedure Management
                </div>

                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                    Visit Procedures
                  </h1>

                  <p className="mt-2 max-w-2xl text-slate-500 text-sm md:text-base">
                    Create, monitor and manage all
                    procedures assigned to this
                    patient visit in an organized workflow.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">

                <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 min-w-[160px]">
                  <div className="flex items-center justify-between">
                    <Activity className="text-blue-600" />
                    <span className="text-3xl font-bold text-slate-900">
                      {stats.total}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    Total Procedures
                  </p>
                </div>

                <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 min-w-[160px]">
                  <div className="flex items-center justify-between">
                    <ShieldAlert className="text-red-600" />
                    <span className="text-3xl font-bold text-slate-900">
                      {stats.urgent}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    Urgent Cases
                  </p>
                </div>

                <div className="rounded-2xl border bg-white/80 backdrop-blur p-5 min-w-[160px]">
                  <div className="flex items-center justify-between">
                    <Clock3 className="text-emerald-600" />
                    <span className="text-3xl font-bold text-slate-900">
                      {stats.completed}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    Completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CreateVisitProcedureForm
          visitId={visit.id}
          catalogs={catalogs}
          onCreated={refresh}
        />

        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">

          <div className="flex items-center justify-between border-b px-6 py-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Procedures
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                All procedures associated with
                this visit
              </p>
            </div>

            {loading && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Refreshing...
              </div>
            )}
          </div>

          {procedures.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ClipboardList className="text-slate-400" />
              </div>

              <h3 className="text-lg font-semibold text-slate-700">
                No Procedures Yet
              </h3>

              <p className="text-sm text-slate-500 mt-2 max-w-md">
                Procedures created for this visit
                will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {procedures.map(p => (
                <div
                  key={p.id}
                  className="group p-5 md:p-6 hover:bg-slate-50 transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {p.customProcedureName ??
                            p.procedureCatalog
                              ?.name}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full border text-xs font-semibold ${
                            priorityStyles[
                              p.priority ??
                                'NORMAL'
                            ]
                          }`}
                        >
                          {p.priority ?? 'NORMAL'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">
                          Status: {p.status}
                        </span>

                        {p.procedureCatalog
                          ?.code && (
                          <span className="rounded-full bg-slate-100 px-3 py-1">
                            Code:{' '}
                            {
                              p.procedureCatalog
                                .code
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="rounded-xl border !border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-100 transition">
                        View
                      </button>

                      <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium !text-white hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                        Manage
                      </button>
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