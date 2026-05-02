'use client';

import { useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus, LabResult } from '@/shared/graphql/generated/graphql';
import ResultCard from './ResultCard';
import CompleteLabRequestPanel from './CompleteLabRequestPanel';

type LabTest = {
  chargeCatalogId: string;
  testName: string;
};

type Props = {
  labRequestId: string;
  status: LabRequestStatus;
  tests: LabTest[];
};

type FormState = {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  interpretation: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function LabResultManager({
  labRequestId,
  status,
  tests,
}: Props) {
  const isLocked = status === LabRequestStatus.Pending || status === LabRequestStatus.Cancelled;

  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    parameter: '',
    value: '',
    unit: '',
    referenceRange: '',
    interpretation: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const fetchResults = async () => {
    try {
      const res = await clientFetch(`/api/lab-result/list?labRequestId=${labRequestId}`);
      const json = await res.json();

      setResults(res.ok ? json.labResults ?? [] : []);
    } catch {
      setResults([]);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [labRequestId]);

  const completedIds = useMemo(
    () => new Set(results.map(r => r.chargeCatalogId)),
    [results]
  );

  const remainingTests = useMemo(
    () => tests.filter(t => !completedIds.has(t.chargeCatalogId)),
    [tests, completedIds]
  );

  const progress = useMemo(() => {
    const total = tests.length;
    const current = total - remainingTests.length;

    return {
      total,
      current,
      percent: total ? Math.round((current / total) * 100) : 0,
    };
  }, [tests.length, remainingTests.length]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.parameter.trim()) newErrors.parameter = 'Parameter is required';
    if (!form.value.trim()) newErrors.value = 'Value is required';

    if (form.value && isNaN(Number(form.value)) && !form.unit) {
      newErrors.value = 'Consider numeric value or specify unit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (key: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const resetForm = () => {
    setForm({
      parameter: '',
      value: '',
      unit: '',
      referenceRange: '',
      interpretation: '',
    });
    setErrors({});
  };

  const saveResult = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setError(null);

      const test = remainingTests[0];
      if (!test) return;

      const res = await clientFetch('/api/lab-result/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labRequestId,
          chargeCatalogId: test.chargeCatalogId,
          testName: test.testName,
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
      if (!res.ok) throw new Error(json.error || 'Failed to save');

      resetForm();
      await fetchResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  if (isLocked) return null;

  const inputBase =
    'w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-green-500/30';

  const errorStyle = 'border-red-400 focus:ring-red-200';

  const disabledSave =
    loading || !form.parameter.trim() || !form.value.trim();

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between text-sm font-medium text-slate-700">
          <span>Lab Progress</span>
          <span>
            {progress.current} / {progress.total}
          </span>
        </div>

        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {remainingTests[0] && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold text-slate-800">
              {remainingTests[0].testName}
            </h3>
            <p className="text-xs text-slate-500">
              Enter structured lab result data
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <input
                placeholder="Parameter *"
                value={form.parameter}
                onChange={e => handleChange('parameter', e.target.value)}
                className={`${inputBase} ${errors.parameter ? errorStyle : ''}`}
              />
              {errors.parameter && (
                <p className="text-xs text-red-500 mt-1">{errors.parameter}</p>
              )}
            </div>

            <div>
              <input
                placeholder="Value *"
                value={form.value}
                onChange={e => handleChange('value', e.target.value)}
                className={`${inputBase} ${errors.value ? errorStyle : ''}`}
              />
              {errors.value && (
                <p className="text-xs text-red-500 mt-1">{errors.value}</p>
              )}
            </div>

            <input
              placeholder="Unit (e.g. mg/dL)"
              value={form.unit}
              onChange={e => handleChange('unit', e.target.value)}
              className={inputBase}
            />

            <input
              placeholder="Reference Range"
              value={form.referenceRange}
              onChange={e => handleChange('referenceRange', e.target.value)}
              className={inputBase}
            />
          </div>

          <textarea
            placeholder="Interpretation / Clinical notes"
            value={form.interpretation}
            onChange={e => handleChange('interpretation', e.target.value)}
            className={`${inputBase} min-h-[90px]`}
          />

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl">
              {error}
            </div>
          )}

          <button
            onClick={saveResult}
            disabled={disabledSave}
            className="w-full sm:w-auto bg-green-600 !text-white px-5 py-2.5 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition cursor-pointer"
          >
            {loading ? 'Saving result...' : 'Save Result'}
          </button>
        </div>
      )}

      {remainingTests.length === 0 && (
        <>
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium text-center">
            Data entry done ✔
          </div>

          <CompleteLabRequestPanel
            labRequestId={labRequestId}
            status={status}
          />
        </>
      )}

      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
        {results.map(result => (
          <ResultCard
            key={result.id}
            result={result}
            onUpdated={fetchResults}
            status={status}
          />
        ))}
      </div>
    </div>
  );
}