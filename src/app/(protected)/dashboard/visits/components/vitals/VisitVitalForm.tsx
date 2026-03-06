'use client';

import { useMemo, useState } from 'react';
import { ChargeCatalogOption, VitalFormValues } from './VisitVitalsSection';

interface Props {
  form: VitalFormValues;
  setForm: React.Dispatch<React.SetStateAction<VitalFormValues>>;
  submitting: boolean;
  catalogs: ChargeCatalogOption[];
  isEditing: boolean;
  onCreate: () => void;
  onUpdate: () => void;
  onCancel: () => void;
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
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const hasVitalValue = useMemo(() => {
    return Object.entries(form).some(([key, value]) => {
      if (key === 'notes' || key === 'chargeCatalogId' || key === 'chargeEnabled') {
        return false;
      }
      return String(value).trim() !== '';
    });
  }, [form]);

  const handleSubmit = () => {
    if (!hasVitalValue) {
      setError('Please record at least one vital measurement.');
      return;
    }

    if (form.chargeEnabled && !form.chargeCatalogId) {
      setError('Please select a charge type for vital billing or uncheck the charge option.');
      return;
    }

    setError(null);

    if (isEditing) onUpdate();
    else onCreate();
  };

  return (
    <>
      {/* Charge Toggle Section */}
      {!isEditing && (
        <div className="mb-6 space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.chargeEnabled || false}
              onChange={e => {
                setForm(prev => ({
                  ...prev,
                  chargeEnabled: e.target.checked,
                  chargeCatalogId: e.target.checked
                    ? prev.chargeCatalogId
                    : '',
                }));
                setError(null);
              }}
              className="w-4 h-4 accent-indigo-600"
            />

            <span className="text-sm text-gray-700">
              Check this box if vitals should be charged
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
          <div key={field.key}>
            <input
              placeholder={field.label}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 
              bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
              focus:border-indigo-500 outline-none text-sm transition
              placeholder:text-gray-400"
              value={String(form[field.key as keyof VitalFormValues] ?? '')}
              onChange={e => {
                setForm(prev => ({
                  ...prev,
                  [field.key]: e.target.value,
                }));
                if (error) setError(null);
              }}
            />
          </div>
        ))}

        <div className="sm:col-span-2 md:col-span-3">
          <textarea
            placeholder="Clinical notes..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 
            bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 
            focus:border-indigo-500 outline-none text-sm transition 
            min-h-25"
            value={form.notes}
            onChange={e => {
              setForm(prev => ({ ...prev, notes: e.target.value }));
              if (error) setError(null);
            }}
          />
        </div>
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