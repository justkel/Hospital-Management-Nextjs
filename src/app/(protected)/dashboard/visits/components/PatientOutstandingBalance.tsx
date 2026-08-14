'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  CircleDollarSign,
  Receipt,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronDown,
  User,
  CalendarDays,
  RefreshCw,
} from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';

interface VisitOutstanding {
  visitId: string;
  visitDate: string;
  visitType?: string;
  outstandingBalance: number;
  totalCharges: number;
  totalPaid: number;
  totalAdjustments?: number;
  status: string;
}

interface PatientOutstandingData {
  patientId: string;
  patientName: string;
  patientUserCode?: number;
  totalOutstandingBalance: number;
  totalChargesAcrossAllVisits: number;
  totalPaidAcrossAllVisits: number;
  visitOutstandings: VisitOutstanding[];
}

interface Props {
  patientId: string;
  className?: string;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusColor(status: string) {
  switch (status) {
    case 'OPEN':
      return 'bg-emerald-100 text-emerald-700';
    case 'CLOSED':
      return 'bg-gray-100 text-gray-600';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'OPEN':
      return <Clock size={12} />;
    case 'CLOSED':
      return <CheckCircle2 size={12} />;
    case 'CANCELLED':
      return <AlertCircle size={12} />;
    default:
      return <Clock size={12} />;
  }
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  onRefresh,
  isRefreshing,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-[#E8E6E0]">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
        >
          {icon && (
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] bg-[#F0FAF5] text-[#1D9E75]">
              {icon}
            </div>
          )}
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5F5E5A]">
            {title}
          </span>
          <ChevronDown
            size={15}
            className={`flex-shrink-0 text-[#B4B2A9] transition-transform duration-200 ml-auto ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#B4B2A9] transition-colors hover:bg-[#F5F4F1] hover:text-[#5F5E5A] disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw
              size={15}
              className={`transition-transform duration-500 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
          </button>
        )}
      </div>

      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function PatientOutstandingBalance({
  patientId,
  className = '',
}: Props) {
  const [data, setData] = useState<PatientOutstandingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async (showRefreshState = false) => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const res = await clientFetch(`/api/patients/balance?patientId=${patientId}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch balance');
      }

      setData(json.patientOutstandingBalance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchBalance(false);
  }, [fetchBalance]);

  const handleRefresh = () => {
    fetchBalance(true);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-sm text-gray-500">Loading balance...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`rounded-xl border border-red-200 bg-red-50 p-4 ${className}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin' : ''}
            />
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totalVisits = data.visitOutstandings.length;
  const hasOutstanding = data.totalOutstandingBalance > 0.01;
  const hasCharges = data.totalChargesAcrossAllVisits > 0.01;
  const isFullyPaid = totalVisits > 0 && hasCharges && !hasOutstanding;
  const hasNoCharges = totalVisits > 0 && !hasCharges;
  const lastFiveVisits = data.visitOutstandings.slice(0, 5);

  return (
    <div className={`space-y-4 ${className}`}>
      <CollapsibleSection
        title="Patient Outstanding Balance"
        icon={<CircleDollarSign size={15} />}
        defaultOpen={true}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <User size={18} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  {data.patientName}
                </h3>
                {data.patientUserCode && (
                  <p className="text-xs text-gray-500">
                    Patient ID: #{data.patientUserCode}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Receipt className="h-4 w-4" />
              <span>
                {totalVisits} visit{totalVisits !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-amber-100 p-1.5 text-amber-600">
                <CircleDollarSign className="h-4 w-4" />
              </div>
              <p className="text-xs font-medium text-gray-500">
                Total Outstanding
              </p>
            </div>
            <p
              className={`mt-1 text-2xl font-bold ${
                hasOutstanding ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {formatCurrency(data.totalOutstandingBalance)}
            </p>
            {isFullyPaid && (
              <p className="mt-0.5 text-xs text-emerald-600">
                ✓ All visits are fully paid
              </p>
            )}
            {hasNoCharges && (
              <p className="mt-0.5 text-xs text-gray-400">
                No charges recorded on any visit yet
              </p>
            )}
            {totalVisits === 0 && (
              <p className="mt-0.5 text-xs text-gray-400">
                No visits on record yet
              </p>
            )}
          </div>
        </div>
      </CollapsibleSection>

      {totalVisits > 0 && (
        <CollapsibleSection
          title={`Recent Visits (${Math.min(lastFiveVisits.length, totalVisits)} of ${totalVisits})`}
          icon={<CalendarDays size={15} />}
          defaultOpen={true}
        >
          <div className="space-y-2">
            {lastFiveVisits.map((visit) => (
              <Link
                key={visit.visitId}
                href={`/dashboard/visits/${visit.visitId}/billing`}
                className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-md hover:shadow-emerald-100/50"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {visit.visitType || 'Visit'}
                      </span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(visit.visitDate)}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
                          visit.status
                        )}`}
                      >
                        {getStatusIcon(visit.status)}
                        {visit.status}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span>Charges: {formatCurrency(visit.totalCharges)}</span>
                      <span>·</span>
                      <span>Paid: {formatCurrency(visit.totalPaid)}</span>
                      {visit.totalAdjustments && visit.totalAdjustments > 0 && (
                        <>
                          <span>·</span>
                          <span>
                            Adjustments:{' '}
                            {formatCurrency(visit.totalAdjustments)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      {visit.outstandingBalance > 0.01 ? (
                        <>
                          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-600">
                            Outstanding
                          </p>
                          <p className="text-sm font-bold text-amber-600">
                            {formatCurrency(visit.outstandingBalance)}
                          </p>
                        </>
                      ) : visit.totalCharges > 0.01 ? (
                        <div className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs font-medium">Paid</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <span className="text-xs font-medium">No charges</span>
                        </div>
                      )}
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {totalVisits > 5 && (
              <div className="pt-2 text-center">
                <Link
                  href={`/dashboard/patients/${data.patientId}/visits`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  View all {totalVisits} visits
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}