'use client';

import { useState } from 'react';

import { message } from 'antd';

import {
  CreateWardIncidentInput,
  GetWardsQuery,
  WardIncidentSeverity,
  WardIncidentType,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type Ward =
  GetWardsQuery['wards']['items'][number];

export default function CreateWardIncidentSection({
  onCreated,
  wards,
}: {
  onCreated: () => void;
  wards: Ward[];
}) {
  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState<CreateWardIncidentInput>({
      wardId: '',
      type:
        WardIncidentType.GasLeak,
      severity:
        WardIncidentSeverity.Low,
      notes: '',
    });

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await clientFetch(
        '/api/ward-incident/create',
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
        wardId: '',
        type:
          WardIncidentType.GasLeak,
        severity:
          WardIncidentSeverity.Low,
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
    <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Report Ward Incident
        </h2>

        <p className="text-slate-500 mt-2">
          Record operational or clinical
          incidents within hospital wards.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
      >
        <select
          required
          value={form.wardId}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              wardId: e.target.value,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          <option value="">
            Select Ward
          </option>

          {wards.map(ward => (
            <option
              key={ward.id}
              value={ward.id}
            >
              {ward.name}
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
                  .value as WardIncidentType,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          {Object.values(
            WardIncidentType
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
                  .value as WardIncidentSeverity,
            }))
          }
          className="h-12 rounded-2xl border border-slate-200 px-4"
        >
          {Object.values(
            WardIncidentSeverity
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
          className="md:col-span-2 xl:col-span-4 min-h-[140px] rounded-3xl border border-slate-200 p-4 resize-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="xl:col-span-4 h-12 rounded-2xl bg-red-600 hover:bg-red-700 !text-white font-semibold transition"
        >
          {loading
            ? 'Submitting Incident...'
            : 'Submit Incident'}
        </button>
      </form>
    </section>
  );
}