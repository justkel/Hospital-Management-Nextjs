'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChargeCatalogOption, VitalFormValues } from './VisitVitalsSection';
import { ChargeDomain } from '@/shared/graphql/generated/graphql';

interface Props {
  form: VitalFormValues;
  setForm: React.Dispatch<React.SetStateAction<VitalFormValues>>;
  submitting: boolean;
  catalogs: ChargeCatalogOption[];
  isEditing: boolean;
  onCreate: () => Promise<void>;
  onUpdate: () => void;
  onCancel: () => void;
  visitId: string;
}

export default function VisitVitalForm({
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
  const [chargeExists, setChargeExists] = useState(false);
  const [loadingChargeCheck, setLoadingChargeCheck] = useState(true);

  useEffect(() => {
    const checkCharge = async () => {
      try {
        const res = await fetch(
          `/api/visit-charge/charge-exists?visitId=${visitId}&chargeDomain=${ChargeDomain.Vitals}`
        );

        const json = await res.json();

        if (json.exists) {
          setChargeExists(true);

          setForm(prev => ({
            ...prev,
            chargeEnabled: false,
            chargeCatalogId: '',
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChargeCheck(false);
      }
    };

    if (visitId && !isEditing) {
      checkCharge();
    }
  }, [visitId, isEditing, setForm]);

  const hasVitalValue = useMemo(() => {
    return Object.entries(form).some(([key, value]) => {
      if (
        key === 'notes' ||
        key === 'chargeCatalogId' ||
        key === 'chargeEnabled'
      ) {
        return false;
      }

      return String(value).trim() !== '';
    });
  }, [form]);

  const handleSubmit = async () => {
    if (!hasVitalValue) {
      setError('Please record at least one vital measurement.');
      return;
    }

    if (form.chargeEnabled && !form.chargeCatalogId) {
      setError('Please select a charge type for vitals billing.');
      return;
    }

    setError(null);

    if (isEditing) {
      onUpdate();
      return;
    }

    await onCreate();

    if (form.chargeEnabled && form.chargeCatalogId) {
      setChargeExists(true);
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
          Vital billing has already been applied for this visit.
        </div>
      )}

      {!isEditing && !chargeExists && (
        <div className="mb-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              disabled={chargeExists}
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
              Check this box to charge for vitals recording
            </span>
          </label>

          {form.chargeEnabled && (
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 
              bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 outline-none transition text-sm"
              value={form.chargeCatalogId}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  chargeCatalogId: e.target.value,
                }))
              }
            >
              <option value="">Select vital charge type</option>
              {catalogs?.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { label: 'Temperature (°C)', key: 'temperature' },
          { label: 'Blood Pressure', key: 'bloodPressure' },
          { label: 'Heart Rate (bpm)', key: 'heartRate' },
          { label: 'Respiratory Rate', key: 'respiratoryRate' },
          { label: 'SpO₂ (%)', key: 'spo2' },
          { label: 'Weight (kg)', key: 'weight' },
          { label: 'Height (cm)', key: 'height' },
        ].map(field => (
          <input
            key={field.key}
            placeholder={field.label}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 
            bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 outline-none text-sm transition"
            value={String(
              form[field.key as keyof VitalFormValues] ?? ''
            )}
            onChange={e => {
              setForm(prev => ({
                ...prev,
                [field.key]: e.target.value,
              }));
              if (error) setError(null);
            }}
          />
        ))}

        <textarea
          placeholder="Clinical notes..."
          className="sm:col-span-2 md:col-span-3 w-full px-4 py-3 rounded-xl border border-gray-200 
          bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
          focus:border-indigo-500 outline-none text-sm min-h-25"
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
          disabled={submitting}
          onClick={handleSubmit}
          className="px-8 py-3 rounded-xl bg-indigo-600 text-white! font-medium
          hover:bg-indigo-700 transition shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isEditing ? 'Update Vitals' : 'Record Vitals'}
        </button>

        {isEditing && (
          <button
            onClick={() => {
              setError(null);
              onCancel();
            }}
            className="px-8 py-3 rounded-xl border border-gray-300 
            hover:bg-gray-50 transition text-sm cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
}