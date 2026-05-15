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

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white" />
            <div className="absolute bottom-0 left-10 h-28 w-28 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-blue-100 font-medium tracking-wide uppercase text-xs sm:text-sm">
                  Clinical Procedure Management
                </p>

                <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
                  Visit Procedures
                </h1>

                <p className="mt-3 text-blue-100 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Beautifully manage procedure workflow, monitor statuses,
                  update outcomes, and track clinical execution in real time.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 min-w-[140px]">
                  <p className="text-blue-100 text-xs uppercase tracking-wider">
                    Total Records
                  </p>
                  <h3 className="mt-2 text-3xl font-black">
                    {paginated.total}
                  </h3>
                </div>

                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 p-4 min-w-[140px]">
                  <p className="text-blue-100 text-xs uppercase tracking-wider">
                    Active Page
                  </p>
                  <h3 className="mt-2 text-3xl font-black">
                    {paginated.page}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <VisitProcedureHistorySection
          key={refreshKey}
          paginated={paginated}
          onUpdated={triggerRefresh}
        />
      </div>
    </div>
  );
}