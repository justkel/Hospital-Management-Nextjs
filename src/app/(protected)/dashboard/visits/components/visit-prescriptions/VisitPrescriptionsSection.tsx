'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import VisitPrescriptionForm from './VisitPrescriptionForm';
import VisitPrescriptionsList from './VisitPrescriptionsList';
import { VisitPrescription } from '@/shared/graphql/generated/graphql';
import PrescriptionPrint from './components/PrescriptionPrint';
import { scheduledFetch } from '@/lib/requestScheduler';
import { useInView } from '@/lib/useInView';

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

const FETCH_PRIORITY = 4;

export default function VisitPrescriptionsSection({ visitId }: Props) {
    const { ref, inView } = useInView<HTMLDivElement>();

    const [prescriptions, setPrescriptions] = useState<VisitPrescription[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(initialForm);

    useEffect(() => {
        if (!error) return;

        const timer = setTimeout(() => {
            setError(null);
        }, 4000);

        return () => clearTimeout(timer);
    }, [error]);

    const buildPayload = (form: typeof initialForm) => ({
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        dose: form.dose || undefined,
        route: form.route || undefined,
        frequency: form.frequency || undefined,
        notes: form.notes || undefined,
    });

    const fetchPrescriptions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await scheduledFetch(
                () => clientFetch(
                    `/api/visit-prescription/list?visitId=${visitId}`,
                    {},
                    { skipRateLimitRetry: true }
                ),
                FETCH_PRIORITY
            );

            if (!res.ok) {
                throw new Error('Failed to fetch prescriptions');
            }

            const json = await res.json();
            setPrescriptions(json.prescriptions ?? []);
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to fetch prescriptions');
        } finally {
            setLoading(false);
        }
    }, [visitId]);

    useEffect(() => {
        if (!inView) return;
        fetchPrescriptions();
    }, [inView, fetchPrescriptions]);

    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
        setError(null);
    };

    const handleCreate = async () => {
        if (!form.drug.trim()) {
            setError('Drug name cannot be empty');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const res = await clientFetch('/api/visit-prescription/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitId,
                    ...buildPayload(form),
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to create prescription');
            }

            await fetchPrescriptions();
            setError(null);
            resetForm();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to create prescription');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        if (!form.drug.trim()) {
            setError('Drug name cannot be empty');
            return;
        }

        setSubmitting(true);
        setError(null);
        try {
            const res = await clientFetch('/api/visit-prescription/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prescriptionId: editingId,
                    ...buildPayload(form),
                }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to update prescription');
            }

            await fetchPrescriptions();
            setError(null);
            resetForm();
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to update prescription');
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
        setError(null);
    };

    const isEditing = useMemo(() => !!editingId, [editingId]);

    return (
        <div ref={ref} className="space-y-8">
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

            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
                    {error}
                </div>
            )}

            <VisitPrescriptionsList
                prescriptions={prescriptions}
                loading={!inView || loading}
                onEdit={handleEdit}
            />

            <div className="pt-4 flex justify-end">
                <div className="flex items-center gap-3">
                    <PrescriptionPrint prescriptions={prescriptions} />
                </div>
            </div>
        </div>
    );
}