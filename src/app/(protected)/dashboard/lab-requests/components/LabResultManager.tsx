'use client';

import { useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus, LabResult } from '@/shared/graphql/generated/graphql';
import ResultCard from './ResultCard';

type LabTest = {
  chargeCatalogId: string;
  testName: string;
};

type Props = {
  labRequestId: string;
  status: LabRequestStatus;
  tests: LabTest[];
};

export default function LabResultManager({
  labRequestId,
  status,
  tests,
}: Props) {
  const isLocked = status === LabRequestStatus.Pending;

  const [results, setResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    parameter: '',
    value: '',
    unit: '',
    referenceRange: '',
    interpretation: '',
  });

  const [error, setError] = useState<string | null>(null);

  const fetchResults = async () => {
    try {
      const res = await clientFetch(
        `/api/lab-result/list?labRequestId=${labRequestId}`
      );

      const json = await res.json();

      if (res.ok) {
        setResults(json.labResults ?? []);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [labRequestId]);

  const completedIds = useMemo(() => {
    return new Set(results.map(r => r.chargeCatalogId));
  }, [results]);

  const remainingTests = useMemo(() => {
    return tests.filter(t => !completedIds.has(t.chargeCatalogId));
  }, [tests, completedIds]);

  const completedCount = tests.length - remainingTests.length;

  const isComplete = remainingTests.length === 0;

  const progress = useMemo(() => {
    return {
      current: completedCount,
      total: tests.length,
      percent:
        tests.length === 0
          ? 0
          : Math.round((completedCount / tests.length) * 100),
    };
  }, [completedCount, tests.length]);

  if (isLocked) return null;

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      parameter: '',
      value: '',
      unit: '',
      referenceRange: '',
      interpretation: '',
    });
  };

  const saveResult = async () => {
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
      if (!res.ok) throw new Error(json.error);

      resetForm();
      await fetchResults();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between text-sm font-semibold">
          <span>Progress</span>
          <span>
            {progress.current} / {progress.total}
          </span>
        </div>

        <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {!isComplete && remainingTests[0] && (
        <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="font-semibold text-sm text-slate-700">
            {remainingTests[0].testName}
          </h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <input
              placeholder="Parameter"
              value={form.parameter}
              onChange={e => handleChange('parameter', e.target.value)}
              className="p-3 border rounded-xl"
            />
            <input
              placeholder="Value"
              value={form.value}
              onChange={e => handleChange('value', e.target.value)}
              className="p-3 border rounded-xl"
            />
            <input
              placeholder="Unit"
              value={form.unit}
              onChange={e => handleChange('unit', e.target.value)}
              className="p-3 border rounded-xl"
            />
            <input
              placeholder="Reference Range"
              value={form.referenceRange}
              onChange={e => handleChange('referenceRange', e.target.value)}
              className="p-3 border rounded-xl"
            />
          </div>

          <textarea
            placeholder="Interpretation"
            value={form.interpretation}
            onChange={e => handleChange('interpretation', e.target.value)}
            className="w-full p-3 border rounded-xl"
          />

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            onClick={saveResult}
            disabled={loading}
            className="bg-green-600 !text-white px-5 py-2 rounded-xl"
          >
            {loading ? 'Saving...' : 'Save Result'}
          </button>
        </div>
      )}

      {isComplete && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm font-medium text-center">
          All lab results completed ✔
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {results.map(result => (
          <ResultCard
            key={result.id}
            result={result}
            onUpdated={fetchResults}
          />
        ))}
      </div>
    </div>
  );
}