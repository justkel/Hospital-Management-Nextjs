'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import VisitPrescriptionForm from './VisitPrescriptionForm';
import VisitPrescriptionsList, {
  VisitPrescription,
} from './VisitPrescriptionsList';

interface Props {
  visitId: string;
}

const initialForm = {
  drug: '',
  dose: '',
  route: '',
  frequency: '',
  isProvidedInHouse: false,
  startDate: '',
  endDate: '',
  notes: '',
};

export default function VisitPrescriptionsSection({ visitId }: Props) {
  const [prescriptions, setPrescriptions] = useState<VisitPrescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(initialForm);

  const fetchPrescriptions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch(
        `/api/visit-prescription/list?visitId=${visitId}`
      );

      const json = await res.json();
      setPrescriptions(json.prescriptions ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [visitId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleCreate = async () => {
    setSubmitting(true);
    try {
      await clientFetch('/api/visit-prescription/create', {
        method: 'POST',
        body: JSON.stringify({ visitId, ...form }),
      });

      await fetchPrescriptions();
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
      await clientFetch('/api/visit-prescription/update', {
        method: 'POST',
        body: JSON.stringify({
          prescriptionId: editingId,
          ...form,
        }),
      });

      await fetchPrescriptions();
      resetForm();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (p: VisitPrescription) => {
    setEditingId(p.id);
    setForm({
      drug: p.drug,
      dose: p.dose || '',
      route: p.route || '',
      frequency: p.frequency || '',
      isProvidedInHouse: p.isProvidedInHouse,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      notes: p.notes || '',
    });
  };

  const isEditing = useMemo(() => !!editingId, [editingId]);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold text-gray-900">
        Visit Prescriptions
      </h2>

      <VisitPrescriptionForm
        form={form}
        setForm={setForm}
        submitting={submitting}
        isEditing={isEditing}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onCancel={resetForm}
      />

      <VisitPrescriptionsList
        prescriptions={prescriptions}
        loading={loading}
        onEdit={handleEdit}
      />
    </div>
  );
}