'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import VisitDiagnosisForm from './VisitDiagnosisForm';
import VisitDiagnosisList from './VisitDiagnosisList';
import { useBilling } from '@/hooks/billing/useBilling';
import { ChargeDomain, VisitDiagnosesQuery } from '@/shared/graphql/generated/graphql';
import { scheduledFetch } from '@/lib/requestScheduler';
import { useInView } from '@/lib/useInView';

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

const FETCH_PRIORITY = 3;

export default function VisitDiagnosisSection({ visitId }: Props) {
    const { ref, inView } = useInView<HTMLDivElement>();

    const [diagnoses, setDiagnoses] = useState<
        VisitDiagnosesQuery['visitDiagnoses']
    >([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(initialForm);

    const { catalogs } = useBilling(ChargeDomain.Diagnosis);
    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            setError(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [error]);

    const fetchDiagnoses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await scheduledFetch(
                () => clientFetch(
                    `/api/visit-diagnosis/list?visitId=${visitId}`,
                    {},
                    { skipRateLimitRetry: true }
                ),
                FETCH_PRIORITY
            );

            if (!res.ok) throw new Error('Failed to fetch diagnoses');

            const json = await res.json();
            setDiagnoses(json.diagnoses ?? []);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to fetch diagnoses');
        } finally {
            setLoading(false);
        }
    }, [visitId]);

    useEffect(() => {
        if (!inView) return;
        fetchDiagnoses();
    }, [inView, fetchDiagnoses]);

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setError(null);
    };

    const handleCreate = async () => {
        if (!form.diagnosis.trim()) {
            setError('Diagnosis cannot be empty');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const res = await clientFetch('/api/visit-diagnosis/create', {
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

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to create diagnosis');
            }

            await fetchDiagnoses();
            setError(null);
            resetForm();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to create diagnosis');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        if (!form.diagnosis.trim()) {
            setError('Diagnosis cannot be empty');
            return;
        }

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

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to update diagnosis');
            }

            await fetchDiagnoses();
            setError(null);
            resetForm();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to update diagnosis');
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
            chargeEnabled: false,
        });
        setError(null);
    };

    const isEditing = useMemo(() => !!editingId, [editingId]);

    return (
        <div ref={ref} className="space-y-10">
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
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <VisitDiagnosisList
                diagnoses={diagnoses}
                loading={!inView || loading}
                onEdit={handleEdit}
            />
        </div>
    );
}