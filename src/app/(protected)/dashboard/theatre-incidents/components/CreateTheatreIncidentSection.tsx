'use client';

import { useState } from 'react';

import { message } from 'antd';

import {
  CreateTheatreIncidentInput,
  GetTheatresQuery,
  TheatreIncidentSeverity,
  TheatreIncidentType,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type Theatre =
  GetTheatresQuery['theatres']['items'][number];

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
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Report Theatre Incident
        </h2>

        <p className="mt-2 text-slate-500">
          Record operational or surgical
          incidents occurring within hospital theatres.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <select
          required
          value={form.theatreId}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              theatreId: e.target.value,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          <option value="">
            Select Theatre
          </option>

          {theatres.map(theatre => (
            <option
              key={theatre.id}
              value={theatre.id}
            >
              {theatre.name}
            </option>
          ))}
        </select>

        <select
          value={form.type}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              type:
                e.target
                  .value as TheatreIncidentType,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          {Object.values(
            TheatreIncidentType
          ).map(item => (
            <option
              key={item}
              value={item}
            >
              {item.replace(/_/g, ' ')}
            </option>
          ))}
        </select>

        <select
          value={form.severity}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              severity:
                e.target
                  .value as TheatreIncidentSeverity,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          {Object.values(
            TheatreIncidentSeverity
          ).map(item => (
            <option
              key={item}
              value={item}
            >
              {item}
            </option>
          ))}
        </select>

        <textarea
          value={form.notes || ''}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              notes: e.target.value,
            }))
          }
          placeholder="Incident notes, observations or escalation details..."
          className="min-h-[140px] resize-none rounded-3xl border border-slate-200 p-4 md:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-2xl bg-cyan-600 font-semibold !text-white transition hover:bg-cyan-700 xl:col-span-4"
        >
          {loading
            ? 'Submitting Incident...'
            : 'Submit Incident'}
        </button>
      </form>
    </section>
  );
}