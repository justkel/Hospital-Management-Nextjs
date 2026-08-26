'use client';

import { useState } from 'react';

import { message } from 'antd';
import { AlertTriangle } from 'lucide-react';

import {
  CreateTheatreIncidentInput,
  GetTheatresQuery,
  TheatreIncidentSeverity,
  TheatreIncidentType,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type Theatre =
  GetTheatresQuery['theatres']['items'][number];

const SEVERITY_HINT: Record<TheatreIncidentSeverity, string> = {
  [TheatreIncidentSeverity.Low]: '!text-[#1D9E75]',
  [TheatreIncidentSeverity.Medium]: '!text-[#B9770E]',
  [TheatreIncidentSeverity.High]: '!text-[#C2571C]',
  [TheatreIncidentSeverity.Critical]: '!text-[#DC2626]',
};

export default function CreateTheatreIncidentSection({
  onCreated,
  theatres,
}: {
  onCreated: () => void;
  theatres: Theatre[];
}) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CreateTheatreIncidentInput>({
      theatreId: '',
      type:
        TheatreIncidentType.EquipmentFailure,
      severity:
        TheatreIncidentSeverity.Low,
      notes: '',
    });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await clientFetch(
        '/api/theatre-incident/create',
        {
          method: 'POST',
          body: JSON.stringify(form),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        message.error(
          json.error ||
            'Failed to create incident'
        );

        return;
      }

      message.success(
        'Incident created successfully'
      );

      setForm({
        theatreId: '',
        type:
          TheatreIncidentType.EquipmentFailure,
        severity:
          TheatreIncidentSeverity.Low,
        notes: '',
      });

      onCreated();
    } catch (error) {
      console.error(error);

      message.error(
        'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white p-5 sm:p-8">
      <div className="mb-6 flex items-start gap-3 sm:mb-8">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl !bg-[#FEF2F2]">
          <AlertTriangle size={17} className="!text-[#DC2626]" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
            Report theatre incident
          </h2>
          <p className="mt-1 text-sm !text-[#767570]">
            Record operational or surgical incidents occurring within hospital theatres.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <Field label="Theatre">
          <select
            required
            value={form.theatreId}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                theatreId: e.target.value,
              }))
            }
            className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#DC2626]"
          >
            <option value="">Select theatre</option>

            {theatres.map(theatre => (
              <option key={theatre.id} value={theatre.id}>
                {theatre.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Incident type">
          <select
            value={form.type}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                type: e.target.value as TheatreIncidentType,
              }))
            }
            className="h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm !text-[#16211B] outline-none transition focus:!border-[#DC2626]"
          >
            {Object.values(TheatreIncidentType).map(item => (
              <option key={item} value={item}>
                {item.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Severity">
          <select
            value={form.severity}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                severity: e.target.value as TheatreIncidentSeverity,
              }))
            }
            className={`h-11 w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 text-sm font-medium outline-none transition focus:!border-[#DC2626] ${SEVERITY_HINT[form.severity]}`}
          >
            {Object.values(TheatreIncidentSeverity).map(item => (
              <option key={item} value={item} className="!text-[#16211B]">
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="&nbsp;">
          <div className="flex h-11 items-center rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] px-3.5 text-xs !text-[#B4B2A9]">
            Fields marked are required
          </div>
        </Field>

        <div className="sm:col-span-2 xl:col-span-4">
          <Field label="Notes">
            <textarea
              value={form.notes || ''}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Incident notes, observations or escalation details…"
              className="min-h-[130px] w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white p-3.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#DC2626]"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl !bg-[#DC2626] px-5 text-sm font-semibold !text-white transition hover:!bg-[#C11F1F] disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 xl:col-span-4"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
              Submitting incident…
            </>
          ) : (
            'Submit incident'
          )}
        </button>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
        {label}
      </label>
      {children}
    </div>
  );
}