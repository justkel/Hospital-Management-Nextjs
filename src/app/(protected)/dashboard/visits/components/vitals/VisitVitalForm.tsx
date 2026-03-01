'use client';

import { useMemo, useState } from 'react';
import { VitalFormValues } from './VisitVitalsSection';

interface Props {
  form: VitalFormValues;
  setForm: React.Dispatch<React.SetStateAction<VitalFormValues>>;
  submitting: boolean;
  isEditing: boolean;
  onCreate: () => void;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function VisitVitalForm({
  form,
  setForm,
  submitting,
  isEditing,
  onCreate,
  onUpdate,
  onCancel,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const hasAtLeastOneValue = useMemo(() => {
    return Object.values(form).some(value => value.trim() !== '');
  }, [form]);

  const handleSubmit = () => {
    if (!hasAtLeastOneValue) {
      setError('Please enter at least one vital before submitting.');
      return;
    }

    setError(null);

    if (isEditing) {
      onUpdate();
    } else {
      onCreate();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Temp (°C)', key: 'temperature' },
          { label: 'BP', key: 'bloodPressure' },
          { label: 'HR', key: 'heartRate' },
          { label: 'RR', key: 'respiratoryRate' },
          { label: 'SpO2', key: 'spo2' },
          { label: 'Weight', key: 'weight' },
          { label: 'Height', key: 'height' },
        ].map(field => (
          <input
            key={field.key}
            placeholder={field.label}
            className="px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            value={form[field.key as keyof VitalFormValues]}
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
          placeholder="Notes"
          className="col-span-2 md:col-span-4 px-3 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          value={form.notes}
          onChange={e => {
            setForm(prev => ({ ...prev, notes: e.target.value }));
            if (error) setError(null);
          }}
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium">
          {error}
        </p>
      )}

      <div className="flex gap-4 mt-4">
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="px-6 py-2 bg-indigo-600 text-white! rounded-xl hover:bg-indigo-700 transition text-sm disabled:opacity-50 cursor-pointer"
        >
          {isEditing ? 'Update Vitals' : 'Record Vitals'}
        </button>

        {isEditing && (
          <button
            onClick={() => {
              setError(null);
              onCancel();
            }}
            className="px-6 py-2 border border-gray-300 rounded-xl text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
}