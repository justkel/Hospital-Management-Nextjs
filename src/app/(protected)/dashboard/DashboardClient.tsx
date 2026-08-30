'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Lottie from 'lottie-react';
import {
  ShieldCheck,
  User,
  TrendingUp,
  TrendingDown,
  Users,
  Stethoscope,
  Syringe,
  Bed,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle,
  Calendar,
  ChevronRight,
  CreditCard,
  Minus,
  Activity,
  HeartPulse,
} from 'lucide-react';
import {
  Line,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  type PieLabelRenderProps,
} from 'recharts';
import ActorActivityChart from './ActorActivityChart';
import { DashboardPeriod } from '@/shared/graphql/generated/graphql';
import type { DashboardOverview } from '@/shared/graphql/generated/graphql';

import pillAnimation from '@/animations/pill.json';

interface Props {
  email: string | null;
  fullName?: string | null;
  roles: string[];
  phoneNumber?: string | null;
  status?: string | null;
  lastLoginAt?: string | null;
  lastSeenAt?: string | null;
  overview: DashboardOverview;
  selectedPeriod: DashboardPeriod;
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

type ChartTooltipEntry = {
  color?: string;
  name?: string | number;
  value?: number | string;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
  labelFormatter?: (label: string | number) => string;
};

const CustomTooltip = ({ active, payload, label, labelFormatter }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-sm">
        <p className="text-[11px] font-medium text-gray-500">{labelFormatter ? labelFormatter(label ?? '') : label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[13px] font-semibold text-gray-900" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const renderPieLabel = (props: PieLabelRenderProps) => {
  const { name, percent } = props;
  if (!name || percent === undefined) return null;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

const hideScrollbarStyle = {
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
} as const;

export default function DashboardClient({
  email,
  fullName,
  roles,
  status,
  lastLoginAt,
  lastSeenAt,
  overview,
  selectedPeriod,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [animationReady, setAnimationReady] = useState(false);
  const [forceReveal] = useState(true);
  const currentPeriod =
    (searchParams.get('period') as DashboardPeriod | null) &&
    Object.values(DashboardPeriod).includes(searchParams.get('period') as DashboardPeriod)
      ? (searchParams.get('period') as DashboardPeriod)
      : selectedPeriod;
  const timeSeriesData = overview.visits.volumeTrend.map((bucket, index) => ({
    time: bucket.label,
    visits: bucket.count,
    patients: overview.visits.activityRevenue[index]?.count ?? 0,
    revenue: overview.visits.activityRevenue[index]?.amount ?? 0,
  }));
  const compactTimeSeriesData = timeSeriesData.length > 12
    ? timeSeriesData.filter((_, index, arr) => {
      const step = Math.max(1, Math.ceil(arr.length / 12));
      return index % step === 0 || index === arr.length - 1;
    })
    : timeSeriesData;

  const formatChartTick = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-NG', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const allReady = animationReady || forceReveal;

  const handleAnimationReady = () => {
    setAnimationReady(true);
  };

  const handlePeriodChange = (period: DashboardPeriod) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('period', period);
    router.push(`/dashboard?${params.toString()}`);
  };

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

  const money = (value: number) =>
    `₦${new Intl.NumberFormat('en-NG', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  const MetricCard = ({
    label,
    value,
    icon,
    trend,
    trendValue,
    color = 'blue',
    subtitle,
    href,
  }: {
    label: string;
    value: string | number;
    icon: ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'pink' | 'indigo';
    subtitle?: string;
    href?: string;
  }) => {
    const colorMap = {
      blue: 'hover:border-blue-200',
      green: 'hover:border-emerald-200',
      purple: 'hover:border-purple-200',
      orange: 'hover:border-orange-200',
      red: 'hover:border-rose-200',
      teal: 'hover:border-cyan-200',
      pink: 'hover:border-pink-200',
      indigo: 'hover:border-indigo-200',
    };

    const iconBgMap = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-emerald-50 text-emerald-600',
      purple: 'bg-purple-50 text-purple-600',
      orange: 'bg-orange-50 text-orange-600',
      red: 'bg-rose-50 text-rose-600',
      teal: 'bg-cyan-50 text-cyan-600',
      pink: 'bg-pink-50 text-pink-600',
      indigo: 'bg-indigo-50 text-indigo-600',
    };

    const trendColorMap = {
      up: 'text-emerald-600',
      down: 'text-rose-600',
      neutral: 'text-gray-500',
    };

    const formattedValue =
      typeof value === 'number' ? value.toLocaleString() : value;

    const card = (
      <div
        className={`group relative min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 transition-all duration-200 hover:border-gray-300 hover:shadow-md sm:p-4 lg:p-5 ${colorMap[color]}`}
      >
        <div className="flex min-w-0 flex-col">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 lg:h-10 lg:w-10 ${iconBgMap[color]}`}
          >
            <div className="flex [&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4 lg:[&>svg]:h-[18px] lg:[&>svg]:w-[18px]">
              {icon}
            </div>
          </div>

          <div className="mt-2 min-w-0 sm:mt-3">
            <div className="flex min-w-0 flex-col gap-0.5 min-[380px]:flex-row min-[380px]:items-start min-[380px]:justify-between min-[380px]:gap-2">
              <p
                className="min-w-0 text-[11px] font-medium leading-snug text-gray-600 sm:text-sm"
                title={label}
              >
                {label}
              </p>

              {trend && trendValue && (
                <div className="flex shrink-0 items-center gap-0.5 whitespace-nowrap sm:gap-1">
                  {trend === 'up' && (
                    <TrendingUp className="h-2.5 w-2.5 text-emerald-500 sm:h-3.5 sm:w-3.5" />
                  )}

                  {trend === 'down' && (
                    <TrendingDown className="h-2.5 w-2.5 text-rose-500 sm:h-3.5 sm:w-3.5" />
                  )}

                  {trend === 'neutral' && (
                    <Minus className="h-2.5 w-2.5 text-gray-400 sm:h-3.5 sm:w-3.5" />
                  )}

                  <span
                    className={`text-[9px] font-medium sm:text-xs ${trendColorMap[trend]}`}
                  >
                    {trendValue}
                  </span>
                </div>
              )}
            </div>

            <p
              className="mt-1 min-w-0 whitespace-nowrap text-base font-semibold leading-tight tracking-tight tabular-nums text-gray-900 min-[380px]:text-lg sm:mt-1.5 sm:text-xl md:text-2xl"
              title={formattedValue}
            >
              {formattedValue}
            </p>

            {subtitle && (
              <p
                className="mt-1 min-w-0 break-words text-[9px] leading-snug text-gray-400 min-[380px]:text-[10px] sm:text-xs"
                title={subtitle}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    );

    return href ? (
      <Link href={href} className="block min-w-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
        {card}
      </Link>
    ) : (
      card
    );
  };

  const Section = ({
    title,
    icon,
    children,
    className = '',
    href,
  }: {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
    href?: string;
  }) => (
    <section
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:border-gray-200 ${className}`}
    >
      <div className="relative">
        <div className="mb-5 flex items-center gap-2.5">
          {icon && (
            <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
              {icon}
            </div>
          )}
          {href ? (
            <Link
              href={href}
              className="group/section inline-flex items-center gap-1 text-[14px] font-semibold !text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {title}
              <ChevronRight className="h-3.5 w-3.5 text-gray-300 transition-transform group-hover/section:translate-x-0.5 group-hover/section:text-gray-600" />
            </Link>
          ) : (
            <h2 className="text-[14px] font-semibold text-gray-900">{title}</h2>
          )}
        </div>
        {children}
      </div>
    </section>
  );

  const periods: Array<{ value: DashboardPeriod; label: string }> = [
    { value: DashboardPeriod.Today, label: 'Today' },
    { value: DashboardPeriod.ThisWeek, label: 'This week' },
    { value: DashboardPeriod.ThisMonth, label: 'This month' },
    { value: DashboardPeriod.Last_3Months, label: 'Last 3 months' },
    { value: DashboardPeriod.Last_24Hours, label: 'Last 24 hours' },
    { value: DashboardPeriod.Last_7Days, label: 'Last 7 days' },
  ];
  const periodLabel =
    periods.find((periodOption) => periodOption.value === currentPeriod)?.label ??
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
  const guestStatusData = (overview.guests?.byStatus ?? []).filter((entry) => entry.count > 0);
  const hasGuestData = Boolean(
    overview.guests && (overview.guests.pendingRequests > 0 || guestStatusData.length > 0),
  );
  const hasMetricData =
    overview.patients.activePatients > 0 ||
    overview.patients.registeredInPeriod > 0 ||
    overview.visits.openVisits > 0 ||
    overview.visits.visitsInPeriod > 0 ||
    hasLaboratoryData ||
    hasBedData ||
    hasTheatreData ||
    hasIncidentData ||
    hasFinancialData ||
    hasGuestData;
  const patientGenderData = overview.patients.genderDistribution.filter((entry) => entry.count > 0);
  const patientVisitTypeData = overview.patients.firstTimeVsReturning.filter((entry) => entry.count > 0);
  const theatreStatusData = (theatre?.byStatus ?? []).filter((entry) => entry.count > 0);
  const theatreOutcomeData = (theatre?.outcomes ?? []).filter((entry) => entry.count > 0);
  const paymentMethodData = (financial?.paymentMethods ?? []).filter((entry) => entry.count > 0);
  const revenueBreakdownData = (financial?.revenueVsGrantsDiscounts ?? []).filter((entry) => entry.amount > 0 || entry.count > 0);
  const hasDepartmentData = (beds?.byDepartment ?? []).filter((entry) => entry.count > 0).length > 0;
  const hasWardData = (beds?.byWard ?? []).filter((entry) => entry.count > 0).length > 0;

  return (
    <>
      {!allReady && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
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
        <div
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 transition-all duration-500 hover:shadow-2xl"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
            <div className="absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl animate-pulse delay-1000" />
            <div className="absolute right-1/3 top-1/2 h-64 w-64 rounded-full bg-purple-500/5 blur-2xl animate-pulse delay-500" />
          </div>

          <div className="relative z-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-3">
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
                  <span className="ml-3 inline-block bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    {fullName?.trim().split(/\s+/)[0] || email?.split('@')[0] || 'there'}
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
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 backdrop-blur-sm">
                    <Activity className="h-4 w-4 text-purple-400" />
                    <span className="text-[13px] text-gray-300">
                      <span className="font-semibold !text-white">
                        {overview.visits.openVisits}
                      </span>{' '}
                      open visits
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
                    value={currentPeriod}
                    onChange={(event) => handlePeriodChange(event.target.value as DashboardPeriod)}
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

        {hasMetricData && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {overview.patients?.activePatients > 0 && (
              <MetricCard
                label={`Active · ${periodLabel}`}
                value={overview.patients.activePatients}
                icon={<Users className="h-5 w-5" />}
                trend="up"
                trendValue="+12%"
                color="green"
                href="/dashboard/patients"
              />
            )}
            {overview.patients?.registeredInPeriod > 0 && (
              <MetricCard
                label={`Registered · ${periodLabel}`}
                value={overview.patients.registeredInPeriod}
                icon={<User className="h-5 w-5" />}
                trend="up"
                trendValue="+8%"
                color="blue"
                href="/dashboard/patients"
              />
            )}
            {overview.visits?.openVisits > 0 && (
              <MetricCard
                label="Open Visits"
                value={overview.visits.openVisits}
                icon={<Stethoscope className="h-5 w-5" />}
                trend="up"
                trendValue="+5%"
                color="purple"
                href="/dashboard/visits"
              />
            )}
            {overview.visits?.visitsInPeriod > 0 && (
              <MetricCard
                label={`Visits · ${periodLabel}`}
                value={overview.visits.visitsInPeriod}
                icon={<Calendar className="h-5 w-5" />}
                trend="up"
                trendValue="+15%"
                color="teal"
                href="/dashboard/visits"
              />
            )}
            {hasLaboratoryData && laboratory && (
              <MetricCard
                label="Pending Lab"
                value={laboratory.pending}
                icon={<Syringe className="h-5 w-5" />}
                color="orange"
                subtitle={`${laboratory.inProgress} in progress, ${laboratory.urgent} urgent / high priority`}
                href="/dashboard/lab-requests"
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
                href="/dashboard/wards"
              />
            )}
            {hasTheatreData && theatre && (
              <MetricCard
                label={`Scheduled · ${periodLabel}`}
                value={theatre.todayProcedures}
                icon={<ClipboardCheck className="h-5 w-5" />}
                color="indigo"
                href="/dashboard/theatres"
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
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Section
            title={`Patient Activity (${periodLabel})`}
            icon={<HeartPulse className="h-4 w-4" />}
            className="lg:col-span-2"
          >
            <div
              className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
              style={hideScrollbarStyle}
            >
              <div style={{ minWidth: Math.max(compactTimeSeriesData.length * 52, 640) }}>
                <ResponsiveContainer width="100%" height={280}>
                  <ComposedChart data={compactTimeSeriesData}>
                    <defs>
                      <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="time"
                      stroke="#9CA3AF"
                      fontSize={11}
                      tickFormatter={formatChartTick}
                      minTickGap={14}
                    />
                    <YAxis yAxisId="left" stroke="#9CA3AF" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" fontSize={11} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="visits"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fill="url(#visitGradient)"
                      name="Visits"
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="patients"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                      name="Patients"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10B981"
                      strokeWidth={2}
                      dot={{ fill: '#10B981', strokeWidth: 2 }}
                      name="Revenue (₦)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Section>

          {hasVisitStatusData && (
            <Section
              title="Visit Status"
              icon={<PieChartIcon className="h-4 w-4" />}
              href="/dashboard/visits"
            >
              <ResponsiveContainer width="100%" height={280}>
                <RechartsPieChart>
                  <Pie
                    data={overview.visits.byStatus.map((item) => ({ name: item.label, value: item.count }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={renderPieLabel}
                    labelLine={false}
                  >
                    {overview.visits.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </Section>
          )}
        </div>

        {(hasDepartmentData || hasWardData) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {hasDepartmentData && (
              <Section
                title="Department Workload"
                icon={<Activity className="h-4 w-4" />}
              >
                <div
                  className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                  style={hideScrollbarStyle}
                >
                  <div style={{ minWidth: Math.max((beds?.byDepartment?.length ?? 0) * 90, 420) }}>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={(beds?.byDepartment ?? []).map((item) => ({ department: item.label, load: item.count }))} layout="vertical" margin={{ left: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" fontSize={11} />
                        <YAxis type="category" dataKey="department" stroke="#9CA3AF" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="load" fill="#8B5CF6" radius={[0, 8, 8, 0]}>
                          {(beds?.byDepartment ?? []).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Section>
            )}

            {hasWardData && (
              <Section
                title="Bed Occupancy by Ward"
                icon={<Bed className="h-4 w-4" />}
              >
                <div
                  className="overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
                  style={hideScrollbarStyle}
                >
                  <div style={{ minWidth: Math.max((beds?.byWard?.length ?? 0) * 110, 420) }}>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={(beds?.byWard ?? []).map((item) => ({ ward: item.label, occupied: item.count }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="ward" stroke="#9CA3AF" fontSize={11} tick={{ fontSize: 10 }} interval={0} angle={-10} textAnchor="end" height={48} />
                        <YAxis stroke="#9CA3AF" fontSize={11} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="occupied" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Occupied" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Section>
            )}
          </div>
        )}

        {(patientGenderData.length > 0 || patientVisitTypeData.length > 0) && (
          <Section title="Patient Demographics" icon={<Users className="h-4 w-4" />}>
            <div className="grid gap-6 md:grid-cols-3">
              {patientGenderData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">Gender</h3>
                    <span className="text-[11px] text-gray-400">{overview.patients.genderDistribution.reduce((sum, item) => sum + item.count, 0)} total</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={patientGenderData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        label={renderPieLabel}
                        labelLine={false}
                      >
                        {patientGenderData.map((entry, index) => (
                          <Cell key={`gender-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {patientVisitTypeData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">First visits</h3>
                    <span className="text-[11px] text-gray-400">{overview.patients.firstTimeVsReturning.reduce((sum, item) => sum + item.count, 0)} total</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={patientVisitTypeData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={3}
                        label={renderPieLabel}
                        labelLine={false}
                      >
                        {patientVisitTypeData.map((entry, index) => (
                          <Cell key={`visit-type-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Section>
        )}

        {(theatreStatusData.length > 0 || theatreOutcomeData.length > 0) && (
          <Section title="Theatre Performance" icon={<ClipboardCheck className="h-4 w-4" />}>
            <div className="grid gap-6 md:grid-cols-2">
              {theatreStatusData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">Procedure status</h3>
                    <span className="text-[11px] text-gray-400">{theatreStatusData.reduce((sum, item) => sum + item.count, 0)} total</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={theatreStatusData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        label={renderPieLabel}
                        labelLine={false}
                      >
                        {theatreStatusData.map((entry, index) => (
                          <Cell key={`status-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {theatreOutcomeData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">Procedure outcomes</h3>
                    <span className="text-[11px] text-gray-400">{theatreOutcomeData.reduce((sum, item) => sum + item.count, 0)} total</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={theatreOutcomeData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        label={renderPieLabel}
                        labelLine={false}
                      >
                        {theatreOutcomeData.map((entry, index) => (
                          <Cell key={`outcome-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Section>
        )}

        {(paymentMethodData.length > 0 || revenueBreakdownData.length > 0) && (
          <Section title="Financial Mix" icon={<CreditCard className="h-4 w-4" />}>
            <div className="grid gap-6 md:grid-cols-2">
              {paymentMethodData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">Payment methods</h3>
                    <span className="text-[11px] text-gray-400">including balance payments</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={paymentMethodData}
                        dataKey="count"
                        nameKey="label"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        label={renderPieLabel}
                        labelLine={false}
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`payment-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {revenueBreakdownData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-500">Revenue vs grants & discounts</h3>
                    <span className="text-[11px] text-gray-400">net trend</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={revenueBreakdownData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="label" stroke="#9CA3AF" fontSize={11} />
                      <YAxis stroke="#9CA3AF" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                        {revenueBreakdownData.map((entry, index) => (
                          <Cell key={`revenue-breakdown-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </Section>
        )}

        {hasGuestData && overview.guests && (
          <Section title="Guest Access Requests" icon={<ShieldCheck className="h-4 w-4" />}>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-500">Pending requests</p>
                <p className="mt-3 text-[32px] font-bold text-gray-900">{overview.guests.pendingRequests}</p>
              </div>
              {guestStatusData.length > 0 && (
                <ResponsiveContainer width="100%" height={220}>
                  <RechartsPieChart>
                    <Pie
                      data={guestStatusData}
                      dataKey="count"
                      nameKey="label"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      label={renderPieLabel}
                      labelLine={false}
                    >
                      {guestStatusData.map((entry, index) => (
                        <Cell key={`guest-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Section>
        )}

        {(hasLaboratoryData || hasFinancialData) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {hasLaboratoryData && laboratory && (
              <Section
                title="Lab Workload Overview"
                icon={<Syringe className="h-4 w-4" />}
                href="/dashboard/lab-requests"
              >
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      label: 'Urgent',
                      value: laboratory.urgent,
                      color: 'bg-rose-100 text-rose-700 border-rose-200',
                      icon: <AlertTriangle className="h-4 w-4" />,
                    },
                    {
                      label: 'In Progress',
                      value: laboratory.inProgress,
                      color: 'bg-blue-100 text-blue-700 border-blue-200',
                      icon: <Activity className="h-4 w-4" />,
                    },
                    {
                      label: 'Completed',
                      value: laboratory.completedInPeriod,
                      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                      icon: <CheckCircle className="h-4 w-4" />,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`rounded-xl border ${item.color} p-4 text-center transition-all hover:scale-105 hover:shadow-md`}
                    >
                      <div className="flex justify-center mb-2">{item.icon}</div>
                      <p className="text-[24px] font-bold">{item.value}</p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.06em]">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {hasFinancialData && financial && (
              <Section
                title="Financial Snapshot"
                icon={<CreditCard className="h-4 w-4" />}
                href="/dashboard/visits"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 transition-all hover:shadow-md">
                    <span className="text-[13px] font-medium text-emerald-700">
                      Period Revenue
                    </span>
                    <span className="text-[18px] font-bold text-emerald-800">
                      {money(financial.revenueInPeriod)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition-all hover:shadow-md">
                    <span className="text-[13px] font-medium text-amber-700">
                      Outstanding
                    </span>
                    <span className="text-[18px] font-bold text-amber-800">
                      {money(financial.overallOutstandingBalance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all hover:shadow-md">
                    <span className="text-[13px] font-medium text-gray-600">
                      Payments Received
                    </span>
                    <span className="text-[18px] font-bold text-gray-800">
                      {financial.paymentsReceivedInPeriod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 transition-all hover:shadow-md">
                    <span className="text-[13px] font-medium text-purple-700">
                      Pending Credits
                    </span>
                    <span className="text-[18px] font-bold text-purple-800">
                      {money(financial.pendingCredits)}
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
              <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                <Activity className="h-4 w-4" />
              </div>
              <span className="text-[14px] font-semibold text-gray-900">Real-time Activity</span>
            </div>
            <span className="text-[11px] text-gray-400">Live updates</span>
          </div>
          <ActorActivityChart />
        </div>

        <div className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl">
          <div className="relative bg-gradient-to-r from-gray-50 to-white p-6">
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[12px] font-medium text-emerald-700 transition-all hover:scale-105 hover:shadow-sm"
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
            <div className="group p-5 transition-colors hover:bg-gray-50/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                    Signed in since
                  </p>

                  <p className="mt-1 text-[16px] font-semibold tracking-tight text-gray-900">
                    {formatRelativeTime(lastLoginAt)}
                  </p>
                </div>

                <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                  Session
                </span>
              </div>
            </div>

            <div className="group p-5 transition-colors hover:bg-gray-50/60">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-gray-400">
                    Last active
                  </p>

                  <p className="mt-1 text-[16px] font-semibold tracking-tight text-gray-900">
                    {formatRelativeTime(lastSeenAt)}
                  </p>
                </div>

                <span className="shrink-0 rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const PieChartIcon = ({ className }: { className?: string }) => (
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