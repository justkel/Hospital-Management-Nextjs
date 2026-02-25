'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface VisitVital {
  id: string;
  temperature: number | null;
  bloodPressure: string | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  spo2: number | null;
  weight: number | null;
  height: number | null;
  notes: string | null;
  createdAt: string;
}

interface VitalFormValues {
  temperature: string;
  bloodPressure: string;
  heartRate: string;
  respiratoryRate: string;
  spo2: string;
  weight: string;
  height: string;
  notes: string;
}

interface Props {
  visitId: string;
}

const initialForm: VitalFormValues = {
  temperature: '',
  bloodPressure: '',
  heartRate: '',
  respiratoryRate: '',
  spo2: '',
  weight: '',
  height: '',
  notes: '',
};

export default function VisitVitalsSection({ visitId }: Props) {
  const [vitals, setVitals] = useState<VisitVital[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VitalFormValues>(initialForm);

  const fetchVitals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch(
        `/api/visit-vital/list?visitId=${visitId}`
      );

      if (!res.ok) throw new Error('Failed to fetch vitals');

      const json: { vitals: VisitVital[] } = await res.json();
      setVitals(json.vitals ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    fetchVitals();
  }, [fetchVitals]);

  const parseNumber = (value: string): number | null =>
    value.trim() === '' ? null : Number(value);

  const buildPayload = () => ({
    visitId,
    temperature: parseNumber(form.temperature),
    bloodPressure: form.bloodPressure || null,
    heartRate: parseNumber(form.heartRate),
    respiratoryRate: parseNumber(form.respiratoryRate),
    spo2: parseNumber(form.spo2),
    weight: parseNumber(form.weight),
    height: parseNumber(form.height),
    notes: form.notes || null,
  });

  const buildUpdatePayload = () => ({
    temperature: parseNumber(form.temperature),
    bloodPressure: form.bloodPressure || null,
    heartRate: parseNumber(form.heartRate),
    respiratoryRate: parseNumber(form.respiratoryRate),
    spo2: parseNumber(form.spo2),
    weight: parseNumber(form.weight),
    height: parseNumber(form.height),
    notes: form.notes || null,
  });

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      const res = await clientFetch('/api/visit-vital/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      if (!res.ok) throw new Error('Failed to create vital');

      await fetchVitals();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    setSubmitting(true);
    try {
      const res = await clientFetch('/api/visit-vital/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitalId: editingId,
          ...buildUpdatePayload(),
        }),
      });

      if (!res.ok) throw new Error('Failed to update vital');

      await fetchVitals();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vital: VisitVital) => {
    setEditingId(vital.id);
    setForm({
      temperature: vital.temperature?.toString() ?? '',
      bloodPressure: vital.bloodPressure ?? '',
      heartRate: vital.heartRate?.toString() ?? '',
      respiratoryRate: vital.respiratoryRate?.toString() ?? '',
      spo2: vital.spo2?.toString() ?? '',
      weight: vital.weight?.toString() ?? '',
      height: vital.height?.toString() ?? '',
      notes: vital.notes ?? '',
    });
  };

  const isEditing = useMemo(() => editingId !== null, [editingId]);

  return (
    <div className="space-y-10">

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          Visit Vitals
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Temp (°C)', key: 'temperature' },
          { label: 'BP', key: 'bloodPressure' },
          { label: 'HR', key: 'heartRate' },
          { label: 'RR', key: 'respiratoryRate' },
          { label: 'SpO2', key: 'spo2' },
          { label: 'Weight', key: 'weight' },
          { label: 'Height', key: 'height' },
        ].map(field => (
          <input
            key={field.key}
            placeholder={field.label}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            value={form[field.key as keyof VitalFormValues]}
            onChange={e =>
              setForm(prev => ({
                ...prev,
                [field.key]: e.target.value,
              }))
            }
          />
        ))}

        <textarea
          placeholder="Notes"
          className="col-span-2 md:col-span-4 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          value={form.notes}
          onChange={e =>
            setForm(prev => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      <div className="flex gap-4">
        <button
          disabled={submitting}
          onClick={isEditing ? handleUpdate : handleCreate}
          className="px-6 py-2 bg-indigo-600 text-white! rounded-xl hover:bg-indigo-700 transition text-sm disabled:opacity-50 cursor-pointer"
        >
          {isEditing ? 'Update Vitals' : 'Record Vitals'}
        </button>

        {isEditing && (
          <button
            onClick={resetForm}
            className="px-6 py-2 border border-gray-300 rounded-xl text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="text-sm text-gray-500">Loading vitals...</p>
        )}

        {!loading && vitals.length === 0 && (
          <p className="text-sm text-gray-400">
            No vitals recorded yet.
          </p>
        )}

        {vitals.map(vital => (
          <div
            key={vital.id}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm"
          >
            <div>Temp: {vital.temperature ?? '—'}</div>
            <div>BP: {vital.bloodPressure ?? '—'}</div>
            <div>HR: {vital.heartRate ?? '—'}</div>
            <div>RR: {vital.respiratoryRate ?? '—'}</div>
            <div>SpO2: {vital.spo2 ?? '—'}</div>
            <div>Weight: {vital.weight ?? '—'}</div>
            <div>Height: {vital.height ?? '—'}</div>

            <div className="col-span-2 md:col-span-4 flex justify-end">
              <button
                onClick={() => handleEdit(vital)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}