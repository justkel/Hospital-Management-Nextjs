'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';
import { useVisitChargeExists } from '@/hooks/billing/useVisitChargeExists';

interface Props {
  form: DiagnosisFormValues;
  setForm: React.Dispatch<React.SetStateAction<DiagnosisFormValues>>;
  submitting: boolean;
  catalogs: { id: string; name: string }[];
  isEditing: boolean;
  onCreate: () => Promise<void>;
  onUpdate: () => void;
  onCancel: () => void;
  visitId: string;
}

type DiagnosisFormValues = {
  diagnosis: string;
  diagnosisCode: string;
  notes: string;
  chargeEnabled?: boolean;
  chargeCatalogId: string;
};

export default function VisitDiagnosisForm({
  form,
  setForm,
  submitting,
  catalogs,
  isEditing,
  onCreate,
  onUpdate,
  onCancel,
  visitId,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const {
    chargeExists,
    loading: loadingChargeCheck,
    markChargeCreated,
  } = useVisitChargeExists({
    visitId,
    chargeDomain: ChargeDomain.Diagnosis,
    enabled: !!visitId && !isEditing,
  });

  const noCatalogs = !catalogs || catalogs.length === 0;

  useEffect(() => {
    if (chargeExists) {
      setForm(prev => ({
        ...prev,
        chargeEnabled: false,
        chargeCatalogId: '',
      }));
    }
  }, [chargeExists, setForm]);

  const hasDiagnosis = useMemo(() => {
    return form.diagnosis.trim() !== '';
  }, [form.diagnosis]);

  const handleSubmit = async () => {
    if (!hasDiagnosis) {
      setError('Diagnosis is required.');
      return;
    }

    if (form.chargeEnabled && noCatalogs) {
      setError(
        'No billing catalogs available for diagnosis. Please contact an administrator.'
      );
      return;
    }

    if (form.chargeEnabled && !form.chargeCatalogId) {
      setError('Please select a charge type for diagnosis billing.');
      return;
    }

    setError(null);

    if (isEditing) {
      onUpdate();
      return;
    }

    await onCreate();

    if (form.chargeEnabled && form.chargeCatalogId) {
      markChargeCreated();
    }

    setForm(prev => ({
      ...prev,
      chargeEnabled: false,
      chargeCatalogId: '',
    }));
  };

  if (loadingChargeCheck) {
    return <p className="text-sm text-gray-500">Checking billing status...</p>;
  }

  return (
    <>
      {chargeExists && (
        <div className="mb-5 p-4 rounded-xl bg-yellow-50 text-yellow-700 text-sm">
          Diagnosis billing has already been applied for this visit.
        </div>
      )}

      {!isEditing && !chargeExists && (
        <div className="mb-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.chargeEnabled || false}
              onChange={e => {
                setForm(prev => ({
                  ...prev,
                  chargeEnabled: e.target.checked,
                  chargeCatalogId: '',
                }));
                setError(null);
              }}
              className="w-4 h-4 accent-indigo-600"
            />

            <span className="text-sm text-gray-700">
              Check this box to charge for diagnosis
            </span>
          </label>

          {form.chargeEnabled && (
            <>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Charges shown here come from billing catalogs mapped to the{' '}
                <span className="font-medium text-gray-700">
                  Diagnosis
                </span>{' '}
                domain. If no options appear, an administrator may need to
                configure diagnosis-related catalogs.
              </p>

              {noCatalogs && (
                <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm">
                  No diagnosis charge catalogs are currently available.
                  Please contact an administrator.
                </div>
              )}

              <select
                className="
                  w-full px-4 py-3 rounded-xl border border-gray-200
                  bg-white shadow-sm focus:ring-2 focus:ring-indigo-500
                  focus:border-indigo-500 outline-none transition text-sm
                "
                value={form.chargeCatalogId}
                disabled={noCatalogs}
                onChange={e =>
                  setForm(prev => ({
                    ...prev,
                    chargeCatalogId: e.target.value,
                  }))
                }
              >
                <option value="">Select diagnosis charge type</option>
                {catalogs?.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <input
          placeholder="Diagnosis"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
          bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={form.diagnosis}
          onChange={e => {
            setForm(prev => ({ ...prev, diagnosis: e.target.value }));
            if (error) setError(null);
          }}
        />

        <input
          placeholder="Diagnosis Code"
          className="w-full px-4 py-3 rounded-xl border border-gray-200 
          bg-white shadow-sm focus:ring-2 focus:ring-indigo-500"
          value={form.diagnosisCode}
          onChange={e => {
            setForm(prev => ({ ...prev, diagnosisCode: e.target.value }));
            if (error) setError(null);
          }}
        />

        <textarea
          placeholder="Clinical notes..."
          className="md:col-span-2 w-full px-4 py-3 rounded-xl border border-gray-200 
          bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 min-h-24"
          value={form.notes}
          onChange={e => {
            setForm(prev => ({ ...prev, notes: e.target.value }));
            if (error) setError(null);
          }}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mt-6">
        <button
          disabled={submitting || (form.chargeEnabled && noCatalogs)}
          onClick={handleSubmit}
          className="px-8 py-3 rounded-xl !bg-green-600 !text-white font-medium
          !hover:bg-green-700 transition shadow-md cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? 'Update Diagnosis' : 'Record Diagnosis'}
        </button>

        {isEditing && (
          <button
            onClick={() => {
              setError(null);
              onCancel();
            }}
            className="px-8 py-3 rounded-xl border border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
}