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
  Sparkles,
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
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-gradient-to-r from-cyan-50/70 to-white px-6 py-5">
        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
  accent?: 'cyan' | 'emerald' | 'blue';
}) {
  const accentStyles = {
    cyan: 'bg-cyan-50 text-cyan-700',
    emerald:
      'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className="flex items-start gap-4 px-6 py-5 transition hover:bg-slate-50/60">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentStyles[accent]}`}
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-900 sm:text-base">
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
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
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
    <div className="mx-auto w-full max-w-5xl space-y-6 py-4">

      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/70 via-white to-blue-50/40" />

        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

            <div className="min-w-0">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-cyan-700">
                <Sparkles className="h-4 w-4" />
                Operating Theatre
              </div>

              <h1 className="break-words text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {theatre.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                Theatre operational profile, scheduling readiness,
                departmental assignment, and surgical capacity overview.
              </p>
            </div>

            <div>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-sm ${
                  theatre.isActive
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {theatre.isActive ? (
                  <ShieldCheck size={18} />
                ) : (
                  <ShieldX size={18} />
                )}

                {theatre.isActive
                  ? 'ACTIVE THEATRE'
                  : 'INACTIVE THEATRE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          label="Capacity"
          value={
            theatre.capacity
              ? `${theatre.capacity}`
              : '—'
          }
          icon={<Users className="h-5 w-5" />}
        />

        <MetricCard
          label="Floor"
          value={
            theatre.floor
              ? `${theatre.floor}`
              : '—'
          }
          icon={<Layers3 className="h-5 w-5" />}
        />

        <MetricCard
          label="Status"
          value={
            theatre.isActive
              ? 'READY'
              : 'OFFLINE'
          }
          icon={<Activity className="h-5 w-5" />}
        />
      </div>

      <Card
        title="Theatre Details"
        description="Core operational and administrative information."
      >
        <DetailRow
          icon={Building2}
          label="Theatre Name"
          value={theatre.name}
        />

        <DetailRow
          icon={Hash}
          label="Theatre Code"
          value={theatre.code}
          accent="blue"
        />

        <DetailRow
          icon={Layers3}
          label="Floor"
          value={theatre.floor}
        />

        <DetailRow
          icon={Building}
          label="Department"
          value={theatre.department?.replace(
            /_/g,
            ' '
          )}
          accent="blue"
        />

        <DetailRow
          icon={Users}
          label="Surgical Capacity"
          value={
            theatre.capacity
              ? `${theatre.capacity} persons`
              : '—'
          }
          accent="emerald"
        />
      </Card>
    </div>
  );
}