'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  Activity,
  ArrowRight,
  Building2,
  CalendarSearch,
  ShieldAlert,
} from 'lucide-react';

import { GetTheatresQuery } from '@/shared/graphql/generated/graphql';

import CreateTheatreSection from './components/CreateTheatreSection';
import TheatreHistorySection from './components/TheatreHistorySection';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type TheatreItem = GetTheatresQuery['theatres']['items'][number];

export default function TheatreManagementClient({
  paginated,
}: {
  paginated: GetTheatresQuery['theatres'];
}) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [liveItems, setLiveItems] = useState<TheatreItem[]>(paginated.items);

  const activeTheatres = liveItems.filter((i) => i.isActive).length;
  const totalCapacity = liveItems.reduce(
    (acc, item) => acc + (item.capacity || 0),
    0,
  );

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/40 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        <div className="relative overflow-hidden rounded-[2rem] border border-cyan-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-transparent to-blue-50 opacity-70" />

          <div className="relative p-6 sm:p-8 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-xs font-semibold text-cyan-700">
                <Building2 className="w-4 h-4" />
                Theatre Operations Center
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                  Theatre Management
                </h1>

                <p className="mt-3 text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
                  Coordinate surgical theatres, manage operating capacity,
                  streamline room utilization, and monitor critical incident
                  reports across departments.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-2">
                  <p className="text-xs font-medium text-cyan-700">Active Theatres</p>
                  <p className="text-xl font-bold text-cyan-900">{activeTheatres}</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-2">
                  <p className="text-xs font-medium text-blue-700">Total Capacity</p>
                  <p className="text-xl font-bold text-blue-900">{totalCapacity}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 w-full xl:w-[260px]">

              <Link
                href="/dashboard/theatres/availability"
                className="group rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md hover:shadow-violet-100/60 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                      <CalendarSearch className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Availability Search
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        Find open theatres for a time window
                      </p>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-violet-200 text-violet-400 transition group-hover:border-violet-400 group-hover:text-violet-600">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/theatre-incidents"
                className="group rounded-3xl border border-rose-100 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-rose-200 hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2.5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                      <ShieldAlert className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        Theatre Incidents
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                        Safety events & reports
                      </p>
                    </div>
                  </div>

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition group-hover:border-rose-200 group-hover:text-rose-500">
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>

              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Activity className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Operational Visibility
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      Manage utilization, floor mapping, and departmental
                      theatre coordination.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <HasRoles roles={[Roles.ADMIN]}>
          <CreateTheatreSection onCreated={triggerRefresh} />
        </HasRoles>

        <TheatreHistorySection
          key={refreshKey}
          paginated={paginated}
          onItemsChange={setLiveItems}
        />
      </div>
    </div>
  );
}