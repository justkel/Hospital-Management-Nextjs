'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import VisitVitalForm from './VisitVitalForm';
import VisitVitalsList from './VisitVitalsList';

export interface VisitVital {
  id: string;
  temperature: number | null;
  bloodPressure: string | null;
  heartRate: number | null;
  respiratoryRate: number | null;
  spo2: number | null;
  weight: number | null;
  height: number | null;
  notes: string | null;
  createdAt?: string;
}

export interface VitalFormValues {
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

      <VisitVitalForm
        form={form}
        setForm={setForm}
        submitting={submitting}
        isEditing={isEditing}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancel={resetForm}
      />

      <VisitVitalsList
        vitals={vitals}
        loading={loading}
        onEdit={handleEdit}
      />
    </div>
  );
}