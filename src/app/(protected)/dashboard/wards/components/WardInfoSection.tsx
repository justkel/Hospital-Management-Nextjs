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
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
      <div className="border-b !border-[#E8E6E0] px-5 py-4 sm:px-6">
        <h2 className="text-sm font-semibold !text-[#16211B] sm:text-base">
          {title}
        </h2>
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

export default function WardInfoSection({
  ward,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 py-2 sm:space-y-6 sm:py-4">
      <header className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
        <div className="flex flex-col gap-4 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
              {ward.name}
            </h1>

            <p className="mt-1.5 text-sm !text-[#767570]">
              Hospital ward profile and operational details.
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold ${
              ward.isActive
                ? '!border-[#CFF0E1] !bg-[#ECFBF5] !text-[#1D9E75]'
                : '!border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626]'
            }`}
          >
            {ward.isActive ? (
              <ShieldCheck size={16} />
            ) : (
              <ShieldX size={16} />
            )}
            {ward.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </header>

      <Card title="Ward details">
        <DetailRow
          icon={BedDouble}
          label="Ward name"
          value={ward.name}
        />

        <DetailRow
          icon={Hash}
          label="Ward code"
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
          value={ward.department?.replace(/_/g, ' ')}
        />

        <DetailRow
          icon={Building2}
          label="Ward class"
          value={ward.wardClass?.replace(/_/g, ' ')}
        />
      </Card>
    </div>
  );
}