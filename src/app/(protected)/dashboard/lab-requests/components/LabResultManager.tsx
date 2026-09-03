'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus, LabResult } from '@/shared/graphql/generated/graphql';
import ResultCard, { LAB_UNITS, REFERENCE_RANGES } from './ResultCard';
import CompleteLabRequestPanel from './CompleteLabRequestPanel';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';
import { 
  CheckCircle, 
  Circle, 
  ClipboardList, 
  AlertCircle, 
  Save, 
  TrendingUp,
  TestTube,
  Microscope,
  Activity,
  Clock,
  ChevronDown
} from 'lucide-react';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const fetchResults = useCallback(async () => {
    try {
      const res = await clientFetch(`/api/lab-result/list?labRequestId=${labRequestId}`);
      const json = await res.json();

      setResults(res.ok ? json.labResults ?? [] : []);
    } catch {
      setResults([]);
    }
  }, [labRequestId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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

  const disabledSave = loading || !form.parameter.trim() || !form.value.trim();

  const getProgressColor = (percent: number) => {
    if (percent === 100) return 'bg-emerald-500';
    if (percent >= 70) return 'bg-blue-500';
    if (percent >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      <HasRoles roles={[Roles.LAB_TECH]}>
        <div className="bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Microscope size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Lab Progress</h3>
                <p className="text-sm text-slate-500 flex items-center gap-1">
                  <Clock size={14} />
                  {progress.current} of {progress.total} tests completed
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200/60">
              <span className="text-2xl font-bold text-slate-800">
                {progress.percent}%
              </span>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(progress.total, 5) }).map((_, i) => (
                  i < progress.current ? (
                    <CheckCircle key={i} size={18} className="text-emerald-500" />
                  ) : (
                    <Circle key={i} size={18} className="text-slate-300" />
                  )
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-5 relative">
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full transition-all duration-700 ease-out rounded-full ${getProgressColor(progress.percent)}`}
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>

        {remainingTests[0] && (
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50/50 px-6 py-4 border-b border-slate-200/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                    <TestTube size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-lg">
                      {remainingTests[0].testName}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <Activity size={14} />
                      Enter structured lab result data
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {remainingTests.length} remaining
                </span>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> Parameter
                  </label>
                  <input
                    placeholder="e.g. Hemoglobin, WBC, Glucose"
                    value={form.parameter}
                    onFocus={() => setFocusedField('parameter')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => handleChange('parameter', e.target.value)}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50
                      ${errors.parameter 
                        ? 'border-rose-300 focus:border-rose-500 bg-rose-50/50' 
                        : focusedField === 'parameter'
                        ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
                        : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
                      }`}
                  />
                  {errors.parameter && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.parameter}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="text-rose-500">*</span> Value
                  </label>
                  <input
                    placeholder="e.g. 14.5, Positive, 120/80"
                    value={form.value}
                    onFocus={() => setFocusedField('value')}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => handleChange('value', e.target.value)}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50
                      ${errors.value 
                        ? 'border-rose-300 focus:border-rose-500 bg-rose-50/50' 
                        : focusedField === 'value'
                        ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
                        : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
                      }`}
                  />
                  {errors.value && (
                    <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                      <AlertCircle size={12} />
                      {errors.value}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unit</label>
                  <div className="relative">
                    <select
                      value={form.unit}
                      onFocus={() => setFocusedField('unit')}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => handleChange('unit', e.target.value)}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50 appearance-none cursor-pointer
                        ${focusedField === 'unit'
                          ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
                          : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
                        }`}
                    >
                      <option value="">Select unit...</option>
                      {LAB_UNITS.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reference Range</label>
                  <div className="relative">
                    <select
                      value={form.referenceRange}
                      onFocus={() => setFocusedField('referenceRange')}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => handleChange('referenceRange', e.target.value)}
                      className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50 appearance-none cursor-pointer
                        ${focusedField === 'referenceRange'
                          ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
                          : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
                        }`}
                    >
                      <option value="">Select reference range...</option>
                      {REFERENCE_RANGES.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Interpretation / Clinical Notes</label>
                <textarea
                  placeholder="Add clinical interpretation or notes..."
                  value={form.interpretation}
                  onFocus={() => setFocusedField('interpretation')}
                  onBlur={() => setFocusedField(null)}
                  onChange={e => handleChange('interpretation', e.target.value)}
                  className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50 resize-y min-h-[100px]
                    ${focusedField === 'interpretation'
                      ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
                      : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
                    }`}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-200/60">
                <button
                  onClick={saveResult}
                  disabled={disabledSave}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 !text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-200/50 active:scale-[0.98]"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Result
                    </>
                  )}
                </button>
                {form.parameter || form.value ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <TrendingUp size={14} />
                    Ready to save
                  </span>
                ) : (
                  <span className="text-xs text-slate-400">Fill in required fields to save</span>
                )}
              </div>
            </div>
          </div>
        )}

        {remainingTests.length === 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-50 to-green-50/70 border border-emerald-200/60 rounded-2xl p-8 text-center shadow-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-emerald-700">All Tests Completed!</h4>
                  <p className="text-emerald-600/80 text-sm mt-1">
                    All {progress.total} lab tests have results recorded
                  </p>
                </div>
              </div>
            </div>

            <CompleteLabRequestPanel
              labRequestId={labRequestId}
              status={status}
            />
          </div>
        )}
      </HasRoles>

      <div className="space-y-4">
        {results.length > 0 && (
          <div className="flex items-center gap-2 pb-2">
            <ClipboardList size={20} className="text-slate-500" />
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
              Recorded Results ({results.length})
            </h3>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </div>
  );
}