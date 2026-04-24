'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import VisitDiagnosisForm from './VisitDiagnosisForm';
import VisitDiagnosisList from './VisitDiagnosisList';
import { useBilling } from '@/hooks/billing/useBilling';
import { ChargeDomain, VisitDiagnosesQuery } from '@/shared/graphql/generated/graphql';

interface Props {
    visitId: string;
}

export interface DiagnosisFormValues {
    diagnosis: string;
    diagnosisCode: string;
    notes: string;
    chargeEnabled?: boolean;
    chargeCatalogId: string;
}

const initialForm: DiagnosisFormValues = {
    diagnosis: '',
    diagnosisCode: '',
    notes: '',
    chargeEnabled: false,
    chargeCatalogId: '',
};

export default function VisitDiagnosisSection({ visitId }: Props) {
    const [diagnoses, setDiagnoses] = useState<
        VisitDiagnosesQuery['visitDiagnoses']
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(initialForm);

    const { catalogs } = useBilling(ChargeDomain.Diagnosis);

    const fetchDiagnoses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await clientFetch(
                `/api/visit-diagnosis/list?visitId=${visitId}`
            );

            if (!res.ok) throw new Error('Failed to fetch diagnoses');

            const json = await res.json();
            setDiagnoses(json.diagnoses ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [visitId]);

    useEffect(() => {
        fetchDiagnoses();
    }, [fetchDiagnoses]);

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

    const handleCreate = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await clientFetch('/api/visit-diagnosis/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitId,
                    diagnosis: form.diagnosis,
                    diagnosisCode: form.diagnosisCode || null,
                    notes: form.notes || null,
                    chargeCatalogId: form.chargeEnabled ? form.chargeCatalogId : null,
                }),
            });

            await fetchDiagnoses();
            setError(null);
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;
        setError(null);

        setSubmitting(true);
        try {
            const res = await clientFetch('/api/visit-diagnosis/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diagnosisId: editingId,
                    diagnosis: form.diagnosis,
                    diagnosisCode: form.diagnosisCode || null,
                    notes: form.notes || null,
                })
            });

            if (!res.ok) throw new Error('Failed to update diagnosis');

            await fetchDiagnoses();
            setError(null);
            resetForm();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (d: VisitDiagnosesQuery['visitDiagnoses'][0]) => {
        setEditingId(d.id);
        setForm({
            diagnosis: d.diagnosis,
            diagnosisCode: d.diagnosisCode ?? '',
            notes: d.notes ?? '',
            chargeCatalogId: '',
        });
    };

    const isEditing = useMemo(() => !!editingId, [editingId]);

    return (
        <div className="space-y-10">
            <h2 className="text-xl font-semibold text-gray-900">
                Visit Diagnosis
            </h2>

            <VisitDiagnosisForm
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
                <p className="text-red-600 text-sm font-medium">
                    {error}
                </p>
            )}

            <VisitDiagnosisList
                diagnoses={diagnoses}
                loading={loading}
                onEdit={handleEdit}
            />
        </div>
    );
}