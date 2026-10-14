'use client';

import { Clock3, ClipboardCheck, Pencil, Stethoscope } from 'lucide-react';
import { VisitDiagnosesQuery } from '@/shared/graphql/generated/graphql';

interface Props {
  diagnoses: VisitDiagnosesQuery['visitDiagnoses'];
  loading: boolean;
  onEdit: (d: VisitDiagnosesQuery['visitDiagnoses'][0]) => void;
}

export default function VisitDiagnosisList({
  diagnoses,
  loading,
  onEdit,
}: Props) {
  if (loading) {
    return (
      <div className="rounded-xl border border-[#EEF0EC] bg-white p-4">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#F0FAF5]" />
          <div className="space-y-2">
            <div className="h-3 w-32 rounded bg-[#EEF0EC]" />
            <div className="h-2.5 w-48 rounded bg-[#F3F4F1]" />
          </div>
        </div>
        <p className="sr-only">Loading diagnoses...</p>
      </div>
    );
  }

  if (!diagnoses.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#DDE5DE] bg-[#FAFCFA] px-5 py-7 text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0FAF5] text-[#1D9E75]">
          <ClipboardCheck size={16} />
        </div>
        <p className="mt-3 text-[12px] font-semibold text-[#353B34]">
          No diagnoses recorded yet
        </p>
        <p className="mt-1 text-[10.5px] leading-relaxed text-[#8D9289]">
          Diagnoses added to this visit will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {diagnoses.map(d => (
        <article
          key={d.id}
          className="overflow-hidden rounded-xl border border-[#E5EAE5] bg-white shadow-[0_4px_18px_rgba(20,35,26,0.035)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0EC] px-4 py-3 sm:px-5">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
                <Stethoscope size={15} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-extrabold text-[#14231A]">Clinical diagnosis</p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-[#8D9289]">
                  <Clock3 size={10} />
                  {new Date(d.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onEdit(d)}
              aria-label={`Edit diagnosis ${d.diagnosis}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E8E6E0] px-2.5 text-[10px] font-semibold text-[#5F5E5A] transition hover:border-[#1D9E75]/30 hover:bg-[#F0FAF5] hover:text-[#1D9E75]"
            >
              <Pencil size={12} />
              Edit
            </button>
          </div>
          <div className="space-y-2.5 px-4 py-4 sm:px-5">
            <p className="text-[13px] font-bold leading-relaxed text-[#353B34]">
              {d.diagnosis}
            </p>
            {d.diagnosisCode && (
              <span className="inline-flex rounded-full border border-[#1D9E75]/15 bg-[#F0FAF5] px-2.5 py-1 text-[10px] font-bold tracking-[0.04em] text-[#178664]">
                {d.diagnosisCode}
              </span>
            )}
            {d.notes && (
              <div className="rounded-lg border border-[#EEF0EC] bg-[#FCFDFC] px-3.5 py-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8D9289]">
                  Clinical notes
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-[11px] leading-relaxed text-[#5F5E5A]">
                  {d.notes}
                </p>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}