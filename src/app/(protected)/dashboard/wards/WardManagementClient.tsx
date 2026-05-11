'use client';

import { useState } from 'react';
import Link from 'next/link';

import { GetWardsQuery } from '@/shared/graphql/generated/graphql';
import { ClipboardList, ArrowRight } from 'lucide-react';

import CreateWardSection from './components/CreateWardSection';
import WardHistorySection from './components/WardHistorySection';

export default function WardManagementClient({
    paginated,
}: {
    paginated: GetWardsQuery['wards'];
}) {
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                            Ward Management
                        </h1>
                        <p className="text-sm text-slate-500">
                            Manage wards and monitor clinical operations
                        </p>
                    </div>

                    <Link
                        href="/dashboard/ward-incidents"
                        className="group flex items-center justify-between gap-4 
                       rounded-2xl border border-slate-200 bg-white 
                       px-4 py-3 shadow-sm hover:shadow-md 
                       transition-all w-full sm:w-auto"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <ClipboardList className="w-5 h-5" />
                            </div>

                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-900">
                                    Ward Incidents
                                </p>
                                <p className="text-xs text-slate-500">
                                    View reports & safety events
                                </p>
                            </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <CreateWardSection onCreated={triggerRefresh} />

                <WardHistorySection
                    key={refreshKey}
                    paginated={paginated}
                />
            </div>
        </div>
    );
}