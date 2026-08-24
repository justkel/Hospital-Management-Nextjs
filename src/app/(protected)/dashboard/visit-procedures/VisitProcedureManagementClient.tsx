'use client';

import { useState } from 'react';

import {
  GetVisitProceduresQuery,
} from '@/shared/graphql/generated/graphql';

import VisitProcedureHistorySection from './components/VisitProcedureHistorySection';

export default function VisitProcedureManagementClient({
  paginated,
}: {
  paginated: GetVisitProceduresQuery['visitProcedures'];
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(paginated.page);
  const [total, setTotal] = useState(paginated.total);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen !bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
          <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                  Clinical Operations
                </p>
              </div>

              <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight !text-[#16211B] sm:text-[34px]">
                Visit Procedures
              </h1>

              <p className="mt-2.5 text-sm leading-relaxed !text-[#767570] sm:text-[15px]">
                Track procedure status, review outcomes, and manage clinical
                execution across every visit.
              </p>
            </div>

            <div className="flex gap-8 border-t !border-[#E8E6E0] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] !text-[#B4B2A9]">
                  Total records
                </p>
                <p className="mt-1.5 font-mono text-[26px] font-semibold tabular-nums !text-[#16211B]">
                  {String(total).padStart(2, '0')}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] !text-[#B4B2A9]">
                  Page
                </p>
                <p className="mt-1.5 font-mono text-[26px] font-semibold tabular-nums !text-[#16211B]">
                  {String(page).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="mt-6 sm:mt-8">
          <VisitProcedureHistorySection
            key={refreshKey}
            paginated={paginated}
            onUpdated={triggerRefresh}
            onPaginationChange={(nextPage, nextTotal) => {
              setPage(nextPage);
              setTotal(nextTotal);
            }}
          />
        </div>
      </div>
    </div>
  );
}