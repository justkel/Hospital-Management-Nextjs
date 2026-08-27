'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Activity } from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';

type ActorActivityPeriod = 'LAST_24_HOURS' | 'LAST_7_DAYS';

interface ActivityTooltipProps {
  active?: boolean;
  payload?: Array<{
    value?: number;
  }>;
  label?: string;
}

interface ActorActivityBucket {
  label: string;
  timestamp: string;
  count: number;
}

interface ActorActivityStats {
  actorId: string;
  period: ActorActivityPeriod;
  total: number;
  buckets: ActorActivityBucket[];
}

interface ChartBucket {
  label: string;
  count: number;
}

const PERIOD_OPTIONS: { value: ActorActivityPeriod; label: string }[] = [
  { value: 'LAST_24_HOURS', label: '24h' },
  { value: 'LAST_7_DAYS', label: '7d' },
];

const MOBILE_BREAKPOINT = 480;
const TABLET_BREAKPOINT = 768;

function formatBucketLabel(
  timestamp: string, 
  period: ActorActivityPeriod, 
  isMobile: boolean, 
  isTablet: boolean, 
  index: number, 
  totalBuckets: number
): string {
  const date = new Date(timestamp);

  if (period === 'LAST_24_HOURS') {
    let spacing = 1;
    
    if (isMobile) {
      spacing = Math.max(2, Math.ceil(totalBuckets / 6));
    } else if (isTablet) {
      spacing = Math.max(2, Math.ceil(totalBuckets / 8));
    } else {
      spacing = Math.max(2, Math.ceil(totalBuckets / 12));
    }

    if (index % spacing !== 0 && index !== 0 && index !== totalBuckets - 1) {
      return '';
    }

    return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  }

  // For 7 days period
  let spacing = 1;
  if (isMobile) {
    spacing = Math.max(1, Math.ceil(totalBuckets / 5)); // Show ~5 labels on mobile
  } else if (isTablet) {
    spacing = Math.max(1, Math.ceil(totalBuckets / 7)); // Show ~7 labels on tablet
  } else {
    spacing = Math.max(1, Math.ceil(totalBuckets / 7)); // Show all 7 days on desktop
  }

  if (index % spacing !== 0 && index !== 0 && index !== totalBuckets - 1) {
    return '';
  }

  if (isMobile) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
    });
  }
  if (isTablet) {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function useBreakpoints() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const tabletQuery = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT}px)`);

    const update = () => {
      const mobile = mobileQuery.matches;
      const tablet = tabletQuery.matches && !mobile;
      setIsMobile(mobile);
      setIsTablet(tablet);
    };

    update();

    mobileQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);
    
    return () => {
      mobileQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return { isMobile, isTablet };
}

function ActivityTooltip({
  active,
  payload,
  label,
}: ActivityTooltipProps) {
  if (!active || !payload?.length) return null;

  const value = payload[0].value ?? 0;

  return (
    <div className="rounded-lg border border-[#E8E6E0] bg-white px-3 py-2 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#B4B2A9]">
        {label}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold text-[#2C2C2A]">
        {value} action{value === 1 ? '' : 's'}
      </p>
    </div>
  );
}

export default function ActorActivityChart() {
  const [period, setPeriod] = useState<ActorActivityPeriod>('LAST_24_HOURS');
  const [stats, setStats] = useState<ActorActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isMobile, isTablet } = useBreakpoints();

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await clientFetch(
          `/api/audit/actor-activity-stats?period=${period}`
        );
        const json = await res.json();

        if (!res.ok || !json.stats) {
          throw new Error(json.error ?? 'Failed to load activity stats');
        }

        if (!cancelled) {
          setStats(json.stats);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [period]);

  const chartData: ChartBucket[] = useMemo(() => {
    if (!stats) return [];

    return stats.buckets.map((bucket, index) => ({
      label: formatBucketLabel(
        bucket.timestamp, 
        period, 
        isMobile, 
        isTablet, 
        index, 
        stats.buckets.length
      ),
      count: bucket.count,
    }));
  }, [stats, period, isMobile, isTablet]);

  const chartSettings = useMemo(() => {
    if (isMobile) {
      return {
        xAxisInterval: 0,
        barSize: 16,
        margin: { top: 8, right: 4, left: -8, bottom: 0 },
        tickFontSize: 9,
        xAxisAngle: 0,
        hideXAxis: false,
      };
    }
    if (isTablet) {
      return {
        xAxisInterval: 0,
        barSize: 24,
        margin: { top: 8, right: 4, left: -12, bottom: 0 },
        tickFontSize: 10,
        xAxisAngle: 0,
        hideXAxis: false,
      };
    }
    return {
      xAxisInterval: 0,
      barSize: period === 'LAST_24_HOURS' ? 14 : 32,
      margin: { top: 8, right: 8, left: -16, bottom: 0 },
      tickFontSize: 11,
      xAxisAngle: 0,
      hideXAxis: false,
    };
  }, [isMobile, isTablet, period]);

  const filteredChartData = useMemo(() => {
    return chartData.filter(item => item.label !== '');
  }, [chartData]);

  return (
    <div className="overflow-hidden rounded-xl border !border-[#E8E6E0] bg-white transition hover:!border-[#D3D1C7] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b !border-[#F0F0EC] p-4 sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg !bg-[#F0FAF5] text-[#1D9E75]">
            <Activity size={16} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#2C2C2A]">
              Actor activity
            </p>
            <p className="truncate text-[11px] text-[#B4B2A9]">
              {stats
                ? `${stats.total} action${stats.total === 1 ? '' : 's'} in this period`
                : 'Loading…'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 rounded-lg !bg-[#F5F5F0] p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setPeriod(opt.value)}
              className={
                period === opt.value
                  ? 'rounded-md bg-white px-3 py-1.5 text-[12px] font-medium text-[#2C2C2A] shadow-sm'
                  : 'rounded-md px-3 py-1.5 text-[12px] font-medium text-[#B4B2A9] hover:text-[#2C2C2A]'
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 sm:p-5">
        {loading && (
          <div className="flex h-[220px] items-center justify-center">
            <div className="relative h-8 w-8">
              <span className="absolute inset-0 rounded-full border-[3px] !border-[#E8E6E0]" />
              <span className="absolute inset-0 rounded-full border-[3px] !border-[#1D9E75] border-t-transparent animate-spin" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="flex h-[220px] items-center justify-center">
            <p className="text-[13px] text-[#B4B2A9]">{error}</p>
          </div>
        )}

        {!loading && !error && stats && (
          stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={isMobile ? 180 : 220}>
              <BarChart
                data={filteredChartData}
                margin={chartSettings.margin}
              >
                <CartesianGrid vertical={false} stroke="#F0F0EC" />
                <XAxis
                  dataKey="label"
                  tick={{ 
                    fontSize: chartSettings.tickFontSize, 
                    fill: '#B4B2A9',
                    angle: chartSettings.xAxisAngle,
                    textAnchor: chartSettings.xAxisAngle === 0 ? 'middle' : 'end',
                    height: isMobile ? 30 : 20,
                  }}
                  axisLine={{ stroke: '#E8E6E0' }}
                  tickLine={false}
                  interval={chartSettings.xAxisInterval}
                  padding={{ left: 4, right: 4 }}
                  tickMargin={isMobile ? 4 : 8}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ 
                    fontSize: chartSettings.tickFontSize, 
                    fill: '#B4B2A9' 
                  }}
                  axisLine={false}
                  tickLine={false}
                  width={isMobile ? 24 : 32}
                />
                <Tooltip content={<ActivityTooltip />} cursor={{ fill: '#F0FAF5' }} />
                <Bar
                  dataKey="count"
                  fill="#1D9E75"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={chartSettings.barSize}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[220px] items-center justify-center text-center">
              <div>
                <Activity className="mx-auto h-10 w-10 text-[#D8EDE3]" />
                <p className="mt-3 text-[13px] text-[#B4B2A9]">
                  No activity in this period
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}