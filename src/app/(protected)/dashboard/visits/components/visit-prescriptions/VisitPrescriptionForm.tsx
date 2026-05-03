'use client';

import { useState } from 'react';

interface PrescriptionFormValues {
  drug: string;
  dose: string;
  route: string;
  frequency: string;
  isProvidedInHouse: boolean;
  startDate: string;
  endDate: string;
  notes: string;
}

interface Props {
  form: PrescriptionFormValues;
  setForm: React.Dispatch<React.SetStateAction<PrescriptionFormValues>>;
  submitting: boolean;
  isEditing: boolean;
  onCreate: () => Promise<void>;
  onUpdate: () => void;
  onCancel: () => void;
}

export default function VisitPrescriptionForm({
  form,
  setForm,
  submitting,
  isEditing,
  onCreate,
  onUpdate,
  onCancel,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.drug.trim()) {
      setError('Drug name is required.');
      return;
    }

    setError(null);

    if (isEditing) {
      onUpdate();
      return;
    }

    await onCreate();
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <input
          placeholder="Drug name (e.g. Paracetamol)"
          className="input"
          value={form.drug}
          onChange={e => setForm(prev => ({ ...prev, drug: e.target.value }))}
        />

        <input
          placeholder="Dose (e.g. 500mg)"
          className="input"
          value={form.dose}
          onChange={e => setForm(prev => ({ ...prev, dose: e.target.value }))}
        />

        <input
          placeholder="Route (e.g. Oral, IV)"
          className="input"
          value={form.route}
          onChange={e => setForm(prev => ({ ...prev, route: e.target.value }))}
        />

        <input
          placeholder="Frequency (e.g. 3 times daily)"
          className="input"
          value={form.frequency}
          onChange={e =>
            setForm(prev => ({ ...prev, frequency: e.target.value }))
          }
        />

        <input
          type="date"
          className="input"
          value={form.startDate}
          onChange={e =>
            setForm(prev => ({ ...prev, startDate: e.target.value }))
          }
        />

        <input
          type="date"
          className="input"
          value={form.endDate}
          onChange={e =>
            setForm(prev => ({ ...prev, endDate: e.target.value }))
          }
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isProvidedInHouse}
          onChange={e =>
            setForm(prev => ({
              ...prev,
              isProvidedInHouse: e.target.checked,
            }))
          }
          className="w-4 h-4 accent-indigo-600"
        />
        <span className="text-sm text-gray-700">
          Provide this drug in-house
        </span>
      </label>

      <textarea
        placeholder="Prescription notes..."
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[90px]"
        value={form.notes}
        onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
      />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-4">
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="btn-primary"
        >
          {isEditing ? 'Update Prescription' : 'Add Prescription'}
        </button>

        {isEditing && (
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}