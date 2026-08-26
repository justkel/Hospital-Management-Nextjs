'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Lottie from 'lottie-react';
import {
  ShieldCheck,
  User,
  Clock,
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  Stethoscope,
  Syringe,
  Bed,
  Scissors,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import ActorActivityChart from './ActorActivityChart';
import { DashboardPeriod } from '@/shared/graphql/generated/graphql';
import type { DashboardOverview } from '@/shared/graphql/generated/graphql';

import pillAnimation from '@/animations/pill.json';

interface Props {
  email: string | null;
  roles: string[];
  phoneNumber?: string | null;
  status?: string | null;
  lastLoginAt?: string | null;
  lastSeenAt?: string | null;
  overview: DashboardOverview;
  selectedPeriod: DashboardPeriod;
}

export default function DashboardClient({
  email,
  roles,
  status,
  lastLoginAt,
  lastSeenAt,
  overview,
  selectedPeriod,
}: Props) {
  const router = useRouter();

  const [animationReady, setAnimationReady] = useState(false);
  const [forceReveal, setForceReveal] = useState(false);

  const allReady = animationReady || forceReveal;

  const handleAnimationReady = () => {
    setAnimationReady(true);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setForceReveal(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const formatRelativeTime = (value?: string | null) => {
    if (!value) return '—';

    const date = new Date(value);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const money = (value: number, currency = 'NGN') =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);

  const MetricCard = ({
    label,
    value,
    icon,
    trend,
    trendValue,
    color = 'blue',
    subtitle,
  }: {
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';
    subtitle?: string;
  }) => {
    const colorMap = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
      orange: 'bg-orange-50 text-orange-600 border-orange-100',
      red: 'bg-rose-50 text-rose-600 border-rose-100',
      teal: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    };

    const iconColorMap = {
      blue: 'text-blue-600',
      green: 'text-emerald-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-rose-600',
      teal: 'text-cyan-600',
    };

    return (
      <div
        className={`group relative overflow-hidden rounded-2xl border ${colorMap[color]} bg-white p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-transparent`}
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 100%)`,
        }}
      >
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-current opacity-[0.03] blur-2xl" />
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400">
              {label}
            </p>
            <p className="mt-2 text-[28px] font-bold tracking-tight text-gray-900">
              {value}
            </p>
            {subtitle && (
              <p className="mt-1 text-[12px] text-gray-500">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="mt-2 flex items-center gap-1.5">
                {trend === 'up' ? (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                ) : trend === 'down' ? (
                  <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                ) : null}
                <span
                  className={`text-[12px] font-medium ${
                    trend === 'up'
                      ? 'text-emerald-600'
                      : trend === 'down'
                        ? 'text-rose-600'
                        : 'text-gray-500'
                  }`}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]} border`}
          >
            <div className={iconColorMap[color]}>{icon}</div>
          </div>
        </div>
      </div>
    );
  };

  const Section = ({
    title,
    icon,
    children,
    className = '',
  }: {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
  }) => (
    <section
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-200 ${className}`}
    >
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-50 blur-3xl" />
      <div className="relative">
        <div className="mb-5 flex items-center gap-2.5">
          {icon && (
            <div className="rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 p-2 text-gray-600">
              {icon}
            </div>
          )}
          <h2 className="text-[14px] font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );

  const periods: Array<{ value: DashboardPeriod; label: string }> = [
    { value: DashboardPeriod.Today, label: 'Today' },
    { value: DashboardPeriod.ThisWeek, label: 'This week' },
    { value: DashboardPeriod.ThisMonth, label: 'This month' },
    { value: DashboardPeriod.Last_24Hours, label: 'Last 24 hours' },
    { value: DashboardPeriod.Last_7Days, label: 'Last 7 days' },
  ];
  const periodLabel =
    periods.find((periodOption) => periodOption.value === selectedPeriod)?.label ??
    'Selected period';

  const laboratory = overview.laboratory;
  const beds = overview.beds;
  const theatre = overview.theatre;
  const incidents = overview.incidents;
  const financial = overview.financial;
  const hasVisitStatusData = overview.visits.byStatus.length > 0;
  const hasLaboratoryData =
    laboratory !== null &&
    laboratory !== undefined &&
    (laboratory.pending > 0 ||
      laboratory.urgent > 0 ||
      laboratory.inProgress > 0 ||
      laboratory.completedInPeriod > 0 ||
      laboratory.recentRequests.length > 0);
  const hasBedData = beds !== null && beds !== undefined && beds.totalActive > 0;
  const hasTheatreData =
    theatre !== null &&
    theatre !== undefined &&
    (theatre.todayProcedures > 0 ||
      theatre.upcoming > 0 ||
      theatre.delayed > 0 ||
      theatre.inProgress > 0 ||
      theatre.cancelled > 0 ||
      theatre.upcomingSchedule.length > 0);
  const hasIncidentData =
    incidents !== null && incidents !== undefined && incidents.activeTotal > 0;
  const hasFinancialData =
    financial !== null &&
    financial !== undefined &&
    (financial.revenueInPeriod > 0 ||
      financial.overallOutstandingBalance > 0 ||
      financial.outstandingBalanceInPeriod > 0 ||
      financial.paymentsReceivedInPeriod > 0 ||
      financial.pendingCredits > 0 ||
      financial.successfulCreditsInPeriod > 0 ||
      financial.recentTransactions.length > 0);
  const hasMetricData =
    overview.patients.activePatients > 0 ||
    overview.patients.registeredToday > 0 ||
    overview.visits.openVisits > 0 ||
    overview.visits.visitsInPeriod > 0 ||
    hasLaboratoryData ||
    hasBedData ||
    hasTheatreData ||
    hasIncidentData ||
    hasFinancialData;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'checked-in': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
      'waiting': 'bg-amber-100 text-amber-700 border-amber-200',
      'completed': 'bg-gray-100 text-gray-700 border-gray-200',
      'cancelled': 'bg-rose-100 text-rose-700 border-rose-200',
    };
    return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <>
      {!allReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-700 border-t-emerald-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-emerald-500/20 blur-xl" />
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex flex-col gap-6 ${allReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
      >
        {/* Hero Section */}
        <div
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 transition-all duration-500 hover:shadow-2xl"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
            <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              }}
            />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1.5 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-emerald-400">
                      Live
                    </span>
                  </div>
                  {status && (
                    <div className="flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                      <span className="text-[11px] font-medium text-gray-400">
                        Status: <span className="!text-white">{status}</span>
                      </span>
                    </div>
                  )}
                </div>

                <h1 className="text-[32px] font-bold tracking-tight !text-white lg:text-[40px]">
                  {greeting} 👋
                  <span className="ml-3 inline-block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    {email?.split('@')[0]}
                  </span>
                </h1>

                <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-gray-400">
                  Here&apos;s your comprehensive clinical overview — patient metrics,
                  visit analytics, and operational insights at a glance.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span className="text-[13px] text-gray-300">
                      <span className="font-semibold !text-white">
                        {overview.patients.activePatients}
                      </span>{' '}
                      active patients
                    </span>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-[13px] text-gray-300">
                      <span className="font-semibold !text-white">
                        {overview.visits.visitsInPeriod}
                      </span>{' '}
                      visits · {periodLabel.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 backdrop-blur-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-[13px] font-medium !text-white">
                      {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
                    </span>
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(event) =>
                      router.push(`/dashboard?period=${event.target.value}`)
                    }
                    className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-[13px] font-medium !text-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 hover:bg-white/20"
                    aria-label="Dashboard period"
                  >
                    {periods.map((periodOption) => (
                      <option
                        key={periodOption.value}
                        value={periodOption.value}
                        className="text-gray-900"
                      >
                        {periodOption.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

 s        {hasMetricData && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {overview.patients.activePatients > 0 && (
              <MetricCard
                label={`Active · ${periodLabel}`}
                value={overview.patients.activePatients}
                icon={<Users className="h-5 w-5" />}
                trend="up"
                color="green"
              />
            )}
            {overview.patients.registeredToday > 0 && (
              <MetricCard
                label={`Registered · ${periodLabel}`}
                value={overview.patients.registeredToday}
                icon={<User className="h-5 w-5" />}
                color="blue"
              />
            )}
            {overview.visits.openVisits > 0 && (
              <MetricCard
                label="Open Visits"
                value={overview.visits.openVisits}
                icon={<Stethoscope className="h-5 w-5" />}
                color="purple"
              />
            )}
            {overview.visits.visitsInPeriod > 0 && (
              <MetricCard
                label={`Visits · ${periodLabel}`}
                value={overview.visits.visitsInPeriod}
                icon={<Calendar className="h-5 w-5" />}
                color="teal"
              />
            )}
            {hasLaboratoryData && laboratory && (
              <MetricCard
                label="Pending Lab"
                value={laboratory.pending}
                icon={<Syringe className="h-5 w-5" />}
                color="orange"
                subtitle={`${laboratory.inProgress} in progress, ${laboratory.urgent} urgent`}
              />
            )}
            {hasBedData && beds && (
              <MetricCard
                label="Bed Occupancy"
                value={`${beds.occupied}/${beds.totalActive}`}
                icon={<Bed className="h-5 w-5" />}
                color="teal"
                trend={
                  beds.occupied / beds.totalActive > 0.8
                    ? 'up'
                    : 'down'
                }
                trendValue={`${Math.round((beds.occupied / beds.totalActive) * 100)}% occupied`}
              />
            )}
            {hasTheatreData && theatre && (
              <MetricCard
                label={`Scheduled procedures · ${periodLabel}`}
                value={theatre.todayProcedures}
                icon={<Scissors className="h-5 w-5" />}
                color="purple"
              />
            )}
            {hasIncidentData && incidents && (
              <MetricCard
                label="Active Incidents"
                value={incidents.activeTotal}
                icon={<AlertTriangle className="h-5 w-5" />}
                color={incidents.activeTotal > 0 ? 'red' : 'green'}
                trend={
                  incidents.activeTotal > 0 ? 'up' : 'neutral'
                }
                trendValue={
                  incidents.activeTotal > 0
                    ? 'Requires attention'
                    : 'All clear'
                }
              />
            )}
            {hasFinancialData && financial && (
              <MetricCard
                label={`Revenue · ${periodLabel}`}
                value={money(financial.revenueToday)}
                icon={<CreditCard className="h-5 w-5" />}
                color="green"
                subtitle={`${financial.paymentsReceivedInPeriod} payments`}
              />
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {hasVisitStatusData && (
            <Section
              title="Visit Status Distribution"
              icon={<PieChart className="h-4 w-4" />}
            >
              <div className="space-y-3">
                {overview.visits.byStatus.map((item) => {
                  const total = overview.visits.byStatus.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                  );
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  return (
                    <div key={item.label} className="group">
                      <div className="flex items-center justify-between text-[13px]">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${getStatusColor(item.label)}`}
                          />
                          <span className="text-gray-600">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-900">
                            {item.count}
                          </span>
                          <span className="text-[11px] font-medium text-gray-400">
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500 group-hover:from-blue-500 group-hover:to-blue-700"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          <Section
            title="Recent Open Visits"
            icon={<Clock className="h-4 w-4" />}
          >
            <div className="space-y-2">
              {overview.visits.recentOpenVisits.length ? (
                overview.visits.recentOpenVisits.map((visit) => (
                  <a
                    key={visit.id}
                    href={`/dashboard/visits/${visit.id}`}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3 transition-all duration-200 hover:border-gray-200 hover:bg-white hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">
                          Patient #{visit.patientId.slice(0, 8)}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {new Date(visit.visitDateTime).toLocaleDateString(
                            undefined,
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-gray-600" />
                  </a>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-emerald-200" />
                  <p className="mt-3 text-[14px] text-gray-500">
                    No open visits
                  </p>
                  <p className="text-[12px] text-gray-400">
                    All clear in the clinic
                  </p>
                </div>
              )}
            </div>
          </Section>
        </div>

        {(hasLaboratoryData || hasTheatreData || hasFinancialData) && (
          <div className="grid gap-6 lg:grid-cols-3">
            {hasLaboratoryData && laboratory && (
              <Section
                title="Lab Workload"
                icon={<Syringe className="h-4 w-4" />}
              >
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Urgent',
                      value: laboratory.urgent,
                      color: 'bg-rose-100 text-rose-700',
                    },
                    {
                      label: 'In Progress',
                      value: laboratory.inProgress,
                      color: 'bg-blue-100 text-blue-700',
                    },
                    {
                      label: 'Completed',
                      value: laboratory.completedInPeriod,
                      color: 'bg-emerald-100 text-emerald-700',
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl ${item.color} p-4 text-center`}
                    >
                      <p className="text-[22px] font-bold">{item.value}</p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasTheatreData && theatre && (
              <Section
                title="Upcoming Procedures"
                icon={<Scissors className="h-4 w-4" />}
              >
                <div className="space-y-2">
                  {theatre.upcomingSchedule.length ? (
                    theatre.upcomingSchedule
                      .slice(0, 4)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 transition-all hover:border-gray-200"
                        >
                          <div>
                            <p className="text-[12px] font-medium text-gray-900">
                              {item.status}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {item.priority} priority
                            </p>
                          </div>
                          <span className="text-[11px] font-medium text-gray-600">
                            {new Date(item.scheduledStartTime).toLocaleTimeString(
                              undefined,
                              { hour: '2-digit', minute: '2-digit' }
                            )}
                          </span>
                        </div>
                      ))
                  ) : (
                    <p className="py-4 text-center text-[13px] text-gray-400">
                      No upcoming procedures
                    </p>
                  )}
                </div>
              </Section>
            )}

            {hasFinancialData && financial && (
              <Section
                title="Financial Overview"
                icon={<CreditCard className="h-4 w-4" />}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3">
                    <span className="text-[13px] font-medium text-emerald-700">
                      Period Revenue
                    </span>
                    <span className="text-[16px] font-bold text-emerald-800">
                      {money(financial.revenueInPeriod)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-4 py-3">
                    <span className="text-[13px] font-medium text-amber-700">
                      Outstanding
                    </span>
                    <span className="text-[16px] font-bold text-amber-800">
                      {money(financial.overallOutstandingBalance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-[13px] font-medium text-gray-600">
                      Payments Received
                    </span>
                    <span className="text-[16px] font-bold text-gray-800">
                      {financial.paymentsReceivedInPeriod}
                    </span>
                  </div>
                </div>
              </Section>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
            </div>
            <span className="text-[11px] text-gray-400">Live updates</span>
          </div>
          <ActorActivityChart />
        </div>

        <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl">
          <div className="relative bg-gradient-to-br from-gray-50 to-white p-6">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-50 to-blue-50 opacity-30 blur-2xl" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white">
                    <Lottie
                      animationData={pillAnimation}
                      loop
                      autoplay
                      onDOMLoaded={handleAnimationReady}
                      className="h-16 w-16"
                    />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                    Signed in as
                  </p>
                  <p className="text-[15px] font-semibold text-gray-900">
                    {email}
                  </p>
                </div>
              </div>

              <div className="hidden h-12 w-px bg-gray-200 sm:block" />

              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
                    <ShieldCheck className="h-3.5 w-3.5" />
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                    Roles
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {roles.length ? (
                    roles.map((role) => (
                      <span
                        key={role}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="text-[13px] text-gray-400">
                      No roles assigned
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-gray-100 border-t border-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="flex items-center gap-4 p-5 transition-all hover:bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                  Signed in since
                </p>
                <p className="mt-0.5 text-[16px] font-semibold text-gray-900">
                  {formatRelativeTime(lastLoginAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 transition-all hover:bg-gray-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                  Last active
                </p>
                <p className="mt-0.5 text-[16px] font-semibold text-gray-900">
                  {formatRelativeTime(lastSeenAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PieChart = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    <path d="M22 12A10 10 0 0 0 12 2v10z" />
  </svg>
);