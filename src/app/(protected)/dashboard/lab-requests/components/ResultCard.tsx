'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus, LabResult } from '@/shared/graphql/generated/graphql';
import { useHasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';
import { 
  Edit3, 
  X, 
  Save, 
  AlertCircle,
  CheckCircle,
  FileText,
  Activity,
  Ruler,
  BookOpen,
  MessageSquare
} from 'lucide-react';

type Item = {
  id?: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: string;
};

export const LAB_UNITS = [
  { value: '', label: 'Select unit...' },
  { value: 'mg/dL', label: 'mg/dL' },
  { value: 'g/dL', label: 'g/dL' },
  { value: 'mmol/L', label: 'mmol/L' },
  { value: 'μmol/L', label: 'μmol/L' },
  { value: 'ng/mL', label: 'ng/mL' },
  { value: 'pg/mL', label: 'pg/mL' },
  { value: 'IU/L', label: 'IU/L' },
  { value: 'U/L', label: 'U/L' },
  { value: 'mU/L', label: 'mU/L' },
  { value: 'μIU/mL', label: 'μIU/mL' },
  { value: '%', label: '%' },
  { value: 'mm/hr', label: 'mm/hr' },
  { value: 'mm³', label: 'mm³' },
  { value: 'µL', label: 'µL' },
  { value: 'cells/µL', label: 'cells/µL' },
  { value: 'g/L', label: 'g/L' },
  { value: 'mEq/L', label: 'mEq/L' },
  { value: 'mOsm/kg', label: 'mOsm/kg' },
  { value: 'ratio', label: 'Ratio' },
  { value: 'positive', label: 'Positive' },
  { value: 'negative', label: 'Negative' },
  { value: 'normal', label: 'Normal' },
  { value: 'abnormal', label: 'Abnormal' },
  { value: 'N/A', label: 'N/A' },
];

export const REFERENCE_RANGES = [
  { value: '', label: 'Select reference range...' },
  { value: '12.0-16.0', label: '12.0-16.0 g/dL (Hemoglobin - Male)' },
  { value: '11.0-15.0', label: '11.0-15.0 g/dL (Hemoglobin - Female)' },
  { value: '4.0-5.5', label: '4.0-5.5 x10⁶/µL (RBC)' },
  { value: '4,500-11,000', label: '4,500-11,000 /µL (WBC)' },
  { value: '150,000-450,000', label: '150,000-450,000 /µL (Platelets)' },
  { value: '70-110', label: '70-110 mg/dL (Fasting Glucose)' },
  { value: '< 140', label: '< 140 mg/dL (2-hr Glucose)' },
  { value: '3.5-5.0', label: '3.5-5.0 mEq/L (Potassium)' },
  { value: '135-145', label: '135-145 mEq/L (Sodium)' },
  { value: '8.5-10.2', label: '8.5-10.2 mg/dL (Calcium)' },
  { value: '2.5-4.5', label: '2.5-4.5 mg/dL (Phosphorus)' },
  { value: '0.5-1.2', label: '0.5-1.2 mg/dL (Creatinine)' },
  { value: '5-25', label: '5-25 mg/dL (BUN)' },
  { value: '10-40', label: '10-40 U/L (AST)' },
  { value: '9-46', label: '9-46 U/L (ALT)' },
  { value: '30-120', label: '30-120 U/L (ALP)' },
  { value: '0.3-1.2', label: '0.3-1.2 mg/dL (Bilirubin)' },
  { value: '< 200', label: '< 200 mg/dL (Total Cholesterol)' },
  { value: '< 150', label: '< 150 mg/dL (Triglycerides)' },
  { value: '> 40', label: '> 40 mg/dL (HDL - Male)' },
  { value: '> 50', label: '> 50 mg/dL (HDL - Female)' },
  { value: '< 100', label: '< 100 mg/dL (LDL)' },
  { value: '1.0-4.0', label: '1.0-4.0 mIU/L (TSH)' },
  { value: '0.5-5.0', label: '0.5-5.0 µIU/mL (T4)' },
  { value: '1.5-4.5', label: '1.5-4.5 ng/dL (T3)' },
  { value: 'Negative', label: 'Negative (HIV, Hep B, etc.)' },
  { value: 'Non-reactive', label: 'Non-reactive (Syphilis)' },
];

export default function ResultCard({
  result,
  onUpdated,
  status,
}: {
  result: LabResult;
  onUpdated: () => void;
  status: LabRequestStatus;
}) {
  const canEditLab = useHasRoles([Roles.LAB_TECH]);
  const isLocked =
    status === LabRequestStatus.Completed ||
    status === LabRequestStatus.Cancelled;

  const canInteract = canEditLab && !isLocked;

  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<Item[]>(
    (result.items ?? []).map(i => ({
      id: i.id,
      parameter: i.parameter,
      value: i.value,
      unit: i.unit ?? undefined,
      referenceRange: i.referenceRange ?? undefined,
      interpretation: i.interpretation ?? undefined,
    }))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateItem = (i: number, key: keyof Item, value: string) => {
    if (!canInteract) return;

    const copy = [...items];
    copy[i] = { ...copy[i], [key]: value };
    setItems(copy);
    setError(null);
  };

  const save = async () => {
    if (!canInteract) return;

    setLoading(true);
    setError(null);

    try {
      const res = await clientFetch('/api/lab-result/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          labResultId: result.id,
          items: items.map(i => ({
            parameter: i.parameter,
            value: i.value,
            unit: i.unit || undefined,
            referenceRange: i.referenceRange || undefined,
            interpretation: i.interpretation || undefined,
          })),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to update');

      setEditing(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) return null;

  const inputBase =
    'w-full rounded-xl border-2 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 bg-slate-50/50';

  const getInputStyle = (field: string) => {
    const isFocused = focusedField === field;
    return `${inputBase} ${
      isFocused
        ? 'border-emerald-400 bg-white shadow-md shadow-emerald-100/50'
        : 'border-slate-200 hover:border-slate-300 focus:border-emerald-400'
    }`;
  };

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-5 py-4 border-b border-slate-200/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-800 text-sm truncate">
                {result.testName}
              </h4>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Activity size={12} />
                {items.length} {items.length === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>

          {canInteract && (
            <button
              onClick={() => {
                setEditing(v => !v);
                setError(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                editing
                  ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {editing ? (
                <>
                  <X size={14} />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 size={14} />
                  Edit
                </>
              )}
            </button>
          )}

          {!canInteract && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
              <CheckCircle size={12} />
              Read-only
            </span>
          )}
        </div>
      </div>

      <div className="p-5 space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="border border-slate-200/60 rounded-xl p-4 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200"
          >
            {editing && canInteract ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <span className="text-rose-500">*</span> Parameter
                    </label>
                    <input
                      value={item.parameter}
                      onFocus={() => setFocusedField(`param-${i}`)}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => updateItem(i, 'parameter', e.target.value)}
                      className={getInputStyle(`param-${i}`)}
                      placeholder="Enter parameter"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <span className="text-rose-500">*</span> Value
                    </label>
                    <input
                      value={item.value}
                      onFocus={() => setFocusedField(`value-${i}`)}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => updateItem(i, 'value', e.target.value)}
                      className={getInputStyle(`value-${i}`)}
                      placeholder="Enter value"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Ruler size={12} />
                      Unit
                    </label>
                    <select
                      value={item.unit || ''}
                      onFocus={() => setFocusedField(`unit-${i}`)}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => updateItem(i, 'unit', e.target.value)}
                      className={`${getInputStyle(`unit-${i}`)} appearance-none cursor-pointer pr-10`}
                    >
                      {LAB_UNITS.map(unit => (
                        <option key={unit.value} value={unit.value}>
                          {unit.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <BookOpen size={12} />
                      Reference Range
                    </label>
                    <select
                      value={item.referenceRange || ''}
                      onFocus={() => setFocusedField(`ref-${i}`)}
                      onBlur={() => setFocusedField(null)}
                      onChange={e => updateItem(i, 'referenceRange', e.target.value)}
                      className={`${getInputStyle(`ref-${i}`)} appearance-none cursor-pointer pr-10`}
                    >
                      {REFERENCE_RANGES.map(range => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <MessageSquare size={12} />
                    Interpretation
                  </label>
                  <input
                    value={item.interpretation || ''}
                    onFocus={() => setFocusedField(`interp-${i}`)}
                    onBlur={() => setFocusedField(null)}
                    onChange={e => updateItem(i, 'interpretation', e.target.value)}
                    className={getInputStyle(`interp-${i}`)}
                    placeholder="Enter interpretation or clinical notes"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-medium text-slate-500">
                      {item.parameter}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-lg font-semibold text-slate-800">
                        {item.value}
                      </span>
                      {item.unit && (
                        <span className="text-xs font-medium text-slate-500">
                          {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.referenceRange && (
                    <div className="text-right">
                      <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                        Reference
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        {item.referenceRange}
                      </div>
                    </div>
                  )}
                </div>

                {item.interpretation && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <div className="text-xs text-slate-600 italic bg-white/70 px-3 py-2 rounded-lg border border-slate-200/40">
                      “{item.interpretation}”
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {error && (
          <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {editing && canInteract && (
          <button
            onClick={save}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 !text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-emerald-200/50 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}