'use client';

import {
  Activity,
  Building,
  Building2,
  Hash,
  Layers3,
  ShieldCheck,
  ShieldX,
  Users,
} from 'lucide-react';

import { GetTheatreByIdQuery } from '@/shared/graphql/generated/graphql';

type Theatre =
  GetTheatreByIdQuery['theatreById'];

type Props = {
  theatre: Theatre;
};

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6 sm:py-5">
        <h2 className="text-sm font-semibold !text-[#16211B] sm:text-base">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs !text-[#767570] sm:text-sm">
            {description}
          </p>
        )}
      </div>

      <div className="divide-y !divide-[#E8E6E0]">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3.5 px-5 py-4 transition hover:!bg-[#FAFAF8] sm:gap-4 sm:px-6 sm:py-5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A] sm:h-10 sm:w-10">
        <Icon size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium !text-[#B4B2A9] sm:text-sm">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold !text-[#16211B]">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border !border-[#E8E6E0] !bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] !text-[#B4B2A9]">
            {label}
          </p>

          <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums !text-[#16211B] sm:text-[26px]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#F7F7F5] !text-[#5F5E5A] sm:h-11 sm:w-11">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function TheatreInfoSection({
  theatre,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 py-2 sm:space-y-6 sm:py-4">

      <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="min-w-0">
              <div className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full !bg-[#1D9E75]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] !text-[#1D9E75]">
                  Operating Theatre
                </p>
              </div>

              <h1 className="mt-3 break-words text-2xl font-bold tracking-tight !text-[#16211B] sm:text-[32px]">
                {theatre.name}
              </h1>

              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed !text-[#767570]">
                Theatre operational profile, scheduling readiness,
                departmental assignment, and surgical capacity overview.
              </p>
            </div>

            <span
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                theatre.isActive
                  ? '!border-[#CFF0E1] !bg-[#ECFBF5] !text-[#1D9E75]'
                  : '!border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626]'
              }`}
            >
              {theatre.isActive ? (
                <ShieldCheck size={17} />
              ) : (
                <ShieldX size={17} />
              )}

              {theatre.isActive ? 'Active theatre' : 'Inactive theatre'}
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <MetricCard
          label="Capacity"
          value={theatre.capacity ? `${theatre.capacity}` : '—'}
          icon={<Users className="h-4 w-4" />}
        />

        <MetricCard
          label="Floor"
          value={theatre.floor ? `${theatre.floor}` : '—'}
          icon={<Layers3 className="h-4 w-4" />}
        />

        <MetricCard
          label="Status"
          value={theatre.isActive ? 'Ready' : 'Offline'}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      <Card
        title="Theatre details"
        description="Core operational and administrative information."
      >
        <DetailRow
          icon={Building2}
          label="Theatre name"
          value={theatre.name}
        />

        <DetailRow
          icon={Hash}
          label="Theatre code"
          value={theatre.code}
        />

        <DetailRow
          icon={Layers3}
          label="Floor"
          value={theatre.floor}
        />

        <DetailRow
          icon={Building}
          label="Department"
          value={theatre.department?.replace(/_/g, ' ')}
        />

        <DetailRow
          icon={Users}
          label="Surgical capacity"
          value={theatre.capacity ? `${theatre.capacity} persons` : '—'}
        />
      </Card>
    </div>
  );
}