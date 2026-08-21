'use client';

import { useMemo, useState } from 'react';
import { message } from 'antd';
import {
  Activity,
  CheckCircle2,
  FlaskConical,
  Loader2,
  RefreshCw,
  ShieldAlert,
} from 'lucide-react';
import { EyeOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { clientFetch } from '@/lib/clientFetch';

import {
  GetLabRequestsByVisitQuery,
  GetVisitByIdQuery,
} from '@/shared/graphql/generated/graphql';
import { Roles } from '@/shared/utils/enums/roles';
import { HasRoles } from '@/components/auth/HasRoles';

type LabRequestItem =
  GetLabRequestsByVisitQuery['labRequestsByVisit'][number];

const priorityStyles: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-700 border-slate-200',
  NORMAL: 'bg-blue-50 text-blue-700 border-blue-200',
  HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
  URGENT: 'bg-red-50 text-red-700 border-red-200',
};

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
};

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function LabRequestClient({
  visit,
  initialLabRequests,
}: {
  visit: GetVisitByIdQuery['visit'];
  initialLabRequests: LabRequestItem[];
}) {
  const [labRequests, setLabRequests] = useState(
    initialLabRequests ?? []
  );

  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);

      const res = await clientFetch(
        `/api/lab-request/get-by-visit?visitId=${visit.id}`,
        {
          cache: 'no-store',
        }
      );

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error || 'Failed to load lab requests'
        );

        return;
      }

      setLabRequests(
        json.labRequests ?? json.labRequestsByVisit ?? []
      );
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: labRequests.length,
      urgent: labRequests.filter(
        (r) =>
          (r.priority ?? '').toString().toUpperCase() === 'URGENT'
      ).length,
      completed: labRequests.filter(
        (r) =>
          (r.status ?? '').toString().toUpperCase() === 'COMPLETED'
      ).length,
    };
  }, [labRequests]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto py-3 lg:px-3 space-y-6">

        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white">

          <div className="px-6 py-7 sm:px-8 sm:py-8">
            <div className="mb-6">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <FlaskConical size={13} />
                Lab request management
              </div>

              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Lab requests
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-slate-500">
                Track every lab request raised for this visit, along with its
                priority, status, and requested tests.
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
                <p className="text-xs font-medium text-slate-500">Total requests</p>
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

        <div className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/60 px-5 py-5 sm:px-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                <FlaskConical size={14} />
                Request list
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                ) : (
                  <RefreshCw size={16} className="text-blue-600" />
                )}
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {labRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
                <FlaskConical
                  size={34}
                  className="text-slate-400"
                />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-800">
                No lab requests yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                Lab requests created for this visit will automatically appear here
                for tracking and management.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {labRequests.map((r) => (
                <div
                  key={r.id}
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
                          Lab request&nbsp;·&nbsp;
                          {r.tests?.length ?? 0}{' '}
                          {r.tests?.length === 1 ? 'test' : 'tests'}
                        </h3>

                        <span
                          className={`
                                        rounded-full border px-3 py-1
                                        text-xs font-bold uppercase tracking-wide
                                        ${priorityStyles[
                            (r.priority ?? 'NORMAL').toString().toUpperCase()
                            ] ?? priorityStyles.NORMAL
                            }
                                    `}
                        >
                          {r.priority ?? 'NORMAL'}
                        </span>

                        <span
                          className={`
                                        rounded-full border px-3 py-1
                                        text-xs font-bold uppercase tracking-wide
                                        ${statusStyles[
                            (r.status ?? '').toString().toUpperCase()
                            ] ?? 'bg-slate-100 text-slate-700 border-slate-200'
                            }
                                    `}
                        >
                          {r.status}
                        </span>
                      </div>

                      {r.tests?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {r.tests.map((test, i) => (
                            <span
                              key={`${test?.chargeCatalogId}-${i}`}
                              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm"
                            >
                              <FlaskConical size={12} className="text-slate-400" />
                              {test?.testName}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
                          <span className="font-semibold text-slate-500">
                            Requested:
                          </span>

                          <span className="font-medium text-slate-800">
                            {formatDateTime(r.createdAt)}
                          </span>
                        </div>

                        {r.updatedAt && r.updatedAt !== r.createdAt && (
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-600 shadow-sm">
                            <span className="font-semibold text-slate-500">
                              Updated:
                            </span>

                            <span className="font-medium text-slate-800">
                              {formatDateTime(r.updatedAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR, Roles.NURSE, Roles.GUEST]}>
                      <div className="flex w-full flex-row gap-3 sm:w-auto">
                        <Link
                          href={`/dashboard/lab-requests/${r.id}`}
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