'use client';

import { useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus } from '@/shared/graphql/generated/graphql';

type LabTest = {
    chargeCatalogId: string;
    testName: string;
};

type Props = {
    labRequestId: string;
    status: LabRequestStatus;
    tests: LabTest[];
    onComplete?: () => void;
};

type FormState = {
    parameter: string;
    value: string;
    unit?: string;
    referenceRange?: string;
    interpretation?: string;
};

export default function LabResultWizard({
    labRequestId,
    status,
    tests,
    onComplete,
}: Props) {
    const isLocked = status === LabRequestStatus.Pending;

    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [savedCount, setSavedCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const currentTest = tests[index];

    const [form, setForm] = useState<FormState>({
        parameter: '',
        value: '',
        unit: '',
        referenceRange: '',
        interpretation: '',
    });

    const progress = useMemo(() => {
        return {
            current: savedCount,
            total: tests.length,
            percent: Math.round((savedCount / tests.length) * 100),
        };
    }, [savedCount, tests.length]);

    if (isLocked) return null;

    const resetForm = () => {
        setForm({
            parameter: '',
            value: '',
            unit: '',
            referenceRange: '',
            interpretation: '',
        });
    };

    const handleChange = (key: keyof FormState, value: string) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const saveResult = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await clientFetch('/api/lab-result/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labRequestId,
                    chargeCatalogId: currentTest.chargeCatalogId,
                    testName: currentTest.testName,
                    items: [
                        {
                            parameter: form.parameter,
                            value: form.value,
                            unit: form.unit || undefined,
                            referenceRange: form.referenceRange || undefined,
                            interpretation: form.interpretation || undefined,
                        },
                    ],
                }),
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || 'Failed to save result');

            setSavedCount(prev => prev + 1);

            resetForm();

            if (index < tests.length - 1) {
                setIndex(prev => prev + 1);
            } else {
                onComplete?.();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving result');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-white border border-slate-200 rounded-3xl shadow-sm p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        Lab Results Entry
                    </h2>
                    <p className="text-sm text-slate-500">
                        Enter results one test at a time
                    </p>
                </div>

                <div className="text-sm font-semibold text-slate-700">
                    {progress.current} / {progress.total} completed
                </div>
            </div>

            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                />
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-700">
                        Test {index + 1}: {currentTest.testName}
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                        placeholder="Parameter"
                        value={form.parameter}
                        onChange={e => handleChange('parameter', e.target.value)}
                        className="p-3 rounded-xl border bg-white text-sm"
                    />

                    <input
                        placeholder="Value"
                        value={form.value}
                        onChange={e => handleChange('value', e.target.value)}
                        className="p-3 rounded-xl border bg-white text-sm"
                    />

                    <input
                        placeholder="Unit (optional)"
                        value={form.unit}
                        onChange={e => handleChange('unit', e.target.value)}
                        className="p-3 rounded-xl border bg-white text-sm"
                    />

                    <input
                        placeholder="Reference Range"
                        value={form.referenceRange}
                        onChange={e => handleChange('referenceRange', e.target.value)}
                        className="p-3 rounded-xl border bg-white text-sm"
                    />
                </div>

                <textarea
                    placeholder="Interpretation (optional)"
                    value={form.interpretation}
                    onChange={e => handleChange('interpretation', e.target.value)}
                    className="w-full p-3 rounded-xl border bg-white text-sm min-h-[90px]"
                />

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={saveResult}
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-green-600 !text-white text-sm font-semibold hover:bg-green-700 disabled:bg-gray-300 transition cursor-pointer"
                    >
                        {loading ? 'Saving...' : 'Save & Continue'}
                    </button>
                </div>
            </div>

            <div className="text-xs text-slate-500 text-center">
                Each result is saved individually for audit integrity
            </div>
        </div>
    );
}