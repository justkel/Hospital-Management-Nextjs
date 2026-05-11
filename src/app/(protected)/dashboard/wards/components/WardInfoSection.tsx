'use client';

import {
  Building2,
  Hash,
  Layers3,
  ShieldCheck,
  ShieldX,
  BedDouble,
  Building,
} from 'lucide-react';

import { GetWardByIdQuery } from '@/shared/graphql/generated/graphql';

type Ward =
  GetWardByIdQuery['wardById'];

type Props = {
  ward: Ward;
};

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
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
}: {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 px-6 py-5">
      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500">
          {label}
        </p>

        <p className="text-sm sm:text-base font-semibold text-slate-900 mt-1 break-words">
          {value || '—'}
        </p>
      </div>
    </div>
  );
}

export default function WardInfoSection({
  ward,
}: Props) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {ward.name}
          </h1>

          <p className="text-slate-500 mt-2">
            Hospital ward profile and operational details.
          </p>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              ward.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {ward.isActive ? (
              <ShieldCheck size={16} />
            ) : (
              <ShieldX size={16} />
            )}

            {ward.isActive
              ? 'ACTIVE'
              : 'INACTIVE'}
          </span>
        </div>
      </div>

      <Card title="Ward Details">
        <DetailRow
          icon={BedDouble}
          label="Ward Name"
          value={ward.name}
        />

        <DetailRow
          icon={Hash}
          label="Ward Code"
          value={ward.code}
        />

        <DetailRow
          icon={Layers3}
          label="Floor"
          value={ward.floor}
        />

        <DetailRow
          icon={Building}
          label="Department"
          value={ward.department?.replace(
            /_/g,
            ' '
          )}
        />

        <DetailRow
          icon={Building2}
          label="Ward Class"
          value={ward.wardClass?.replace(
            /_/g,
            ' '
          )}
        />
      </Card>
    </div>
  );
}