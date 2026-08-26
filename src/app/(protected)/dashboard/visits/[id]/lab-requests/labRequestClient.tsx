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
  LOW: '!bg-[#F7F7F5] !text-[#767570] !border-[#E8E6E0]',
  NORMAL: '!bg-[#EFF5FF] !text-[#1D6FE0] !border-[#D6E4FB]',
  HIGH: '!bg-[#FFF1E9] !text-[#C2571C] !border-[#FAD9C4]',
  URGENT: '!bg-[#FEF2F2] !text-[#DC2626] !border-[#FBD5D5]',
};

const statusStyles: Record<string, string> = {
  PENDING: '!bg-[#FFF8EC] !text-[#B9770E] !border-[#F5E3C0]',
  IN_PROGRESS: '!bg-[#EFF5FF] !text-[#1D6FE0] !border-[#D6E4FB]',
  COMPLETED: '!bg-[#ECFBF5] !text-[#1D9E75] !border-[#CFF0E1]',
  CANCELLED: '!bg-[#FEF2F2] !text-[#DC2626] !border-[#FBD5D5]',
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
    <div className="min-h-screen !bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">

        <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-5">
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1 text-xs font-semibold !text-[#1D9E75]">
                <FlaskConical size={13} />
                Lab request management
              </div>

              <h1 className="text-2xl font-bold tracking-tight !text-[#16211B] sm:text-[28px]">
                Lab requests
              </h1>

              <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-[#767570]">
                Track every lab request raised for this visit, along with its
                priority, status, and requested tests.
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
                <p className="text-xs font-medium !text-[#767570]">Total requests</p>
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

        <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="inline-flex w-fit items-center gap-1.5 rounded-full !bg-[#ECFBF5] px-3 py-1 text-xs font-semibold uppercase tracking-wide !text-[#1D9E75]">
                <FlaskConical size={13} />
                Request list
              </div>

              <button
                type="button"
                onClick={refresh}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-2.5 text-sm font-medium !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={15} className="animate-spin !text-[#1D9E75]" />
                ) : (
                  <RefreshCw size={15} className="!text-[#1D9E75]" />
                )}
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>

          {labRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl !bg-[#F7F7F5]">
                <FlaskConical size={26} className="!text-[#B4B2A9]" />
              </div>

              <h3 className="mt-5 text-base font-semibold !text-[#16211B]">
                No lab requests yet
              </h3>

              <p className="mt-1.5 max-w-md text-sm leading-relaxed !text-[#767570]">
                Lab requests created for this visit will automatically appear
                here for tracking and management.
              </p>
            </div>
          ) : (
            <div className="divide-y !divide-[#E8E6E0]">
              {labRequests.map((r) => (
                <div
                  key={r.id}
                  className="px-4 py-4 transition hover:!bg-[#FAFAF8] sm:px-6 sm:py-5"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-base font-semibold tracking-tight !text-[#16211B] sm:text-lg">
                          Lab request &middot;{' '}
                          {r.tests?.length ?? 0}{' '}
                          {r.tests?.length === 1 ? 'test' : 'tests'}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            priorityStyles[
                              (r.priority ?? 'NORMAL').toString().toUpperCase()
                            ] ?? priorityStyles.NORMAL
                          }`}
                        >
                          {r.priority ?? 'NORMAL'}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            statusStyles[
                              (r.status ?? '').toString().toUpperCase()
                            ] ?? '!bg-[#F7F7F5] !text-[#767570] !border-[#E8E6E0]'
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      {r.tests?.length ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {r.tests.map((test, i) => (
                            <span
                              key={`${test?.chargeCatalogId}-${i}`}
                              className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1 text-xs font-medium !text-[#5F5E5A]"
                            >
                              <FlaskConical size={11} className="!text-[#B4B2A9]" />
                              {test?.testName}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-2 text-xs">
                        <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 !text-[#767570]">
                          <span className="font-medium !text-[#B4B2A9]">
                            Requested:
                          </span>
                          <span className="font-medium !text-[#16211B]">
                            {formatDateTime(r.createdAt)}
                          </span>
                        </div>

                        {r.updatedAt && r.updatedAt !== r.createdAt && (
                          <div className="inline-flex items-center gap-1.5 rounded-full border !border-[#E8E6E0] !bg-white px-2.5 py-1.5 !text-[#767570]">
                            <span className="font-medium !text-[#B4B2A9]">
                              Updated:
                            </span>
                            <span className="font-medium !text-[#16211B]">
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