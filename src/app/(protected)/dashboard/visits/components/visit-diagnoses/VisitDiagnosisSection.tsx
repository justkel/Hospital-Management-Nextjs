'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import VisitDiagnosisForm from './VisitDiagnosisForm';
import VisitDiagnosisList from './VisitDiagnosisList';
import { useBilling } from '@/hooks/billing/useBilling';
import { ChargeDomain, VisitDiagnosesQuery } from '@/shared/graphql/generated/graphql';
import { scheduledFetch } from '@/lib/requestScheduler';
import { useInView } from '@/lib/useInView';
import { ClipboardPlus, Stethoscope } from 'lucide-react';

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

    const { catalogs } = useBilling(ChargeDomain.Diagnosis, inView);
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
        <section ref={ref} className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0FAF5] text-[#1D9E75]">
                    <Stethoscope size={18} />
                </div>
                <div>
                    <h2 className="text-[15px] font-extrabold tracking-[-0.02em] text-[#14231A]">
                        Visit diagnosis
                    </h2>
                    <p className="mt-0.5 text-[11px] font-medium text-[#8D9289]">
                        Document clinical findings and diagnosis codes
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E5EAE5] bg-white shadow-[0_8px_28px_rgba(20,35,26,0.045)]">
                <div className="flex items-center gap-2.5 border-b border-[#EEF0EC] px-4 py-3.5 sm:px-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
                        <ClipboardPlus size={15} />
                    </div>
                    <div>
                        <h3 className="text-[12px] font-extrabold text-[#14231A]">
                            {isEditing ? 'Update diagnosis' : 'Record a diagnosis'}
                        </h3>
                        <p className="mt-0.5 text-[10px] font-medium text-[#8D9289]">
                            Add the clinical assessment for this visit
                        </p>
                    </div>
                </div>
                <div className="p-4 sm:p-5">
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
                        enabled={inView}
                    />
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <h3 className="text-[12px] font-extrabold text-[#14231A]">
                    Recorded diagnoses
                </h3>
            <VisitDiagnosisList
                diagnoses={diagnoses}
                loading={!inView || loading}
                onEdit={handleEdit}
            />
            </div>
        </section>
    );
}