'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useCallback, useEffect, useMemo, useState } from 'react';
import VisitVitalForm from './VisitVitalForm';
import VisitVitalsList from './VisitVitalsList';
import { useBilling } from '@/hooks/billing/useBilling';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';
import { scheduledFetch } from '@/lib/requestScheduler';

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
  chargeCatalogId: string;
  chargeEnabled?: boolean;
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

export interface ChargeCatalogOption {
  id: string;
  name: string;
}

const initialForm: VitalFormValues = {
  chargeCatalogId: '',
  chargeEnabled: false,
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
  const [error, setError] = useState<string | null>(null);

  const { catalogs } = useBilling(ChargeDomain.Vitals);
  const FETCH_PRIORITY = 1;

  const fetchVitals = useCallback(async () => {
    setLoading(true);

    try {
      const res = await scheduledFetch(
        () =>
          clientFetch(
            `/api/visit-vital/list?visitId=${visitId}`,
            {},
            { skipRateLimitRetry: true },
          ),
        FETCH_PRIORITY,
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch vitals');
      }

      setVitals(json.vitals ?? []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to load visit vitals');
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    fetchVitals();
  }, [fetchVitals]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

  const parseNumber = (value: string): number | null =>
    value.trim() === '' ? null : Number(value);

  const buildPayload = () => ({
    visitId,
    chargeCatalogId: form.chargeCatalogId,
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
    setError(null);
  };

  const handleCreate = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await clientFetch('/api/visit-vital/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to record vital signs');
      }

      await fetchVitals();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        (err as Error).message || 'Failed to record vital signs',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      setSubmitting(true);
      setError(null);

      const res = await clientFetch('/api/visit-vital/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitalId: editingId,
          ...buildUpdatePayload(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to update vital signs');
      }

      await fetchVitals();
      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        (err as Error).message || 'Failed to update vital signs',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (vital: VisitVital) => {
    setError(null);
    setEditingId(vital.id);

    setForm({
      chargeCatalogId: '',
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
        catalogs={catalogs}
        isEditing={isEditing}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancel={resetForm}
        visitId={visitId}
      />

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <VisitVitalsList
        vitals={vitals}
        loading={loading}
        onEdit={handleEdit}
      />
    </div>
  );
};