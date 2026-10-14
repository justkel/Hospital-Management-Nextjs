'use client';

import { HasRoles } from "@/components/auth/HasRoles";
import { Roles } from "@/shared/utils/enums/roles";
import { VisitVital } from "./VisitVitalsSection";
import {
  Activity,
  Clock3,
  Droplets,
  HeartPulse,
  Pencil,
  Ruler,
  Thermometer,
  Wind,
} from 'lucide-react';

interface Props {
  vitals: VisitVital[];
  loading: boolean;
  onEdit: (vital: VisitVital) => void;
}

const PRIMARY_VITALS = [
  {
    label: 'Temperature',
    key: 'temperature',
    unit: '°C',
    icon: Thermometer,
    tint: 'bg-[#FFF7ED] text-[#D97706]',
    valueClass: 'text-[#14231A]',
  },
  {
    label: 'Blood pressure',
    key: 'bloodPressure',
    unit: '',
    icon: Activity,
    tint: 'bg-[#EFF6FF] text-[#2563EB]',
    valueClass: 'text-[#14231A]',
  },
  {
    label: 'Heart rate',
    key: 'heartRate',
    unit: 'bpm',
    icon: HeartPulse,
    tint: 'bg-[#FEF2F2] text-[#DC2626]',
    valueClass: 'text-[#14231A]',
  },
  {
    label: 'Oxygen saturation',
    key: 'spo2',
    unit: '%',
    icon: Droplets,
    tint: 'bg-[#F0FAF5] text-[#1D9E75]',
    valueClass: 'text-[#14231A]',
  },
] as const;

function formatRecordedAt(createdAt?: string) {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export default function VisitVitalsList({
  vitals,
  loading,
  onEdit,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-[#E8E6E0] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-[#F0FAF5]" />
          <div className="space-y-2">
            <div className="h-3 w-32 animate-pulse rounded bg-[#EEF0EC]" />
            <div className="h-2.5 w-48 animate-pulse rounded bg-[#F3F4F1]" />
          </div>
        </div>
        <p className="sr-only">Loading vitals...</p>
      </div>
    );
  }

  if (vitals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DDE5DE] bg-[#FAFCFA] px-5 py-8 text-center sm:py-10">
        <p className="mt-3 text-sm font-semibold text-[#353B34]">No vitals recorded yet</p>
        <p className="mt-1 text-xs leading-relaxed text-[#8D9289]">
          Recorded observations will appear here with the visit.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {vitals.map((vital) => {
        const recordedAt = formatRecordedAt(vital.createdAt);
        const secondaryVitals = [
          { label: 'Respiratory rate', value: vital.respiratoryRate, unit: '/min', icon: Wind },
          { label: 'Weight', value: vital.weight, unit: 'kg', icon: Activity },
          { label: 'Height', value: vital.height, unit: 'cm', icon: Ruler },
        ];

        return (
          <article
            key={vital.id}
            className="overflow-hidden rounded-2xl border border-[#E5EAE5] bg-white shadow-[0_8px_28px_rgba(20,35,26,0.045)] transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(20,35,26,0.075)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0EC] px-4 py-3.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F0FAF5] text-[#1D9E75]">
                  <Activity size={17} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[13px] font-extrabold text-[#14231A]">Vital signs</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-[10.5px] font-medium text-[#8D9289]">
                    <Clock3 size={11} />
                    {recordedAt ? (
                      <time dateTime={vital.createdAt}>{recordedAt}</time>
                    ) : (
                      'Visit observation'
                    )}
                  </p>
                </div>
              </div>

              <HasRoles roles={[Roles.DOCTOR, Roles.NURSE, Roles.GUEST]}>
                <button
                  type="button"
                  onClick={() => onEdit(vital)}
                  aria-label="Edit vital signs"
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E8E6E0] bg-white px-3 text-[11px] font-semibold text-[#5F5E5A] transition hover:border-[#1D9E75]/30 hover:bg-[#F0FAF5] hover:text-[#1D9E75]"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              </HasRoles>
            </div>

            <div className="p-3.5 sm:p-5">
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
                {PRIMARY_VITALS.map((item) => {
                  const Icon = item.icon;
                  const value = vital[item.key];

                  return (
                    <div
                      key={item.key}
                      className="min-w-0 rounded-xl border border-[#EEF0EC] bg-[#FCFDFC] p-3 sm:p-3.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${item.tint}`}>
                          <Icon size={14} />
                        </span>
                        <span className="truncate text-[9px] font-semibold text-[#858A82] sm:text-[10px]">
                          {item.label}
                        </span>
                      </div>
                      <p className={`mt-3 truncate text-[19px] font-extrabold tracking-[-0.03em] ${item.valueClass} sm:text-[21px]`}>
                        {value ?? '—'}
                        {value !== null && item.unit && (
                          <span className="ml-1 text-[10px] font-bold tracking-normal text-[#8D9289]">
                            {item.unit}
                          </span>
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {secondaryVitals.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex min-w-0 items-center gap-2.5 rounded-lg bg-[#F7F8F6] px-3 py-2.5"
                    >
                      <Icon size={14} className="shrink-0 text-[#8D9289]" />
                      <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-[#777970]">
                        {item.label}
                      </span>
                      <span className="shrink-0 text-[11px] font-bold text-[#353B34]">
                        {item.value ?? '—'}
                        {item.value !== null && <span className="ml-0.5 text-[9px] font-semibold text-[#8D9289]">{item.unit}</span>}
                      </span>
                    </div>
                  );
                })}
              </div>

              {vital.notes && (
                <div className="mt-3 rounded-lg border border-[#E8E6E0] bg-white px-3.5 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8D9289]">Clinical notes</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-[#5F5E5A]">{vital.notes}</p>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
