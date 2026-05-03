'use client';

import { useMemo, useState } from 'react';
import {
  Pill,
  Calendar,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
} from 'lucide-react';

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

  const hasStart = !!form.startDate;
  const hasEnd = !!form.endDate;

  const validationError = useMemo(() => {
    if (!form.drug.trim()) return 'Drug name is required';

    if (hasEnd && !hasStart) {
      return 'Start date is required if end date is set';
    }

    if (hasStart && hasEnd) {
      if (new Date(form.startDate) > new Date(form.endDate)) {
        return 'Start date cannot be after end date';
      }
    }

    return null;
  }, [form, hasStart, hasEnd]);

  const handleSubmit = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);

    if (isEditing) {
      onUpdate();
    } else {
      await onCreate();
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-2">
        <Pill size={18} className="text-indigo-600" />
        <h3 className="font-semibold text-gray-900 text-lg">
          {isEditing ? 'Edit Prescription' : 'New Prescription'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Drug *</label>
          <input
            placeholder="e.g. Paracetamol"
            className={inputClass}
            value={form.drug}
            onChange={e =>
              setForm(prev => ({ ...prev, drug: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500">Dose</label>
          <input
            placeholder="e.g. 500mg"
            className={inputClass}
            value={form.dose}
            onChange={e =>
              setForm(prev => ({ ...prev, dose: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <Activity size={14} /> Route
          </label>
          <input
            placeholder="Oral, IV, IM..."
            className={inputClass}
            value={form.route}
            onChange={e =>
              setForm(prev => ({ ...prev, route: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <Clock size={14} /> Frequency
          </label>
          <input
            placeholder="e.g. 3 times daily"
            className={inputClass}
            value={form.frequency}
            onChange={e =>
              setForm(prev => ({ ...prev, frequency: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> Start Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={form.startDate}
            onChange={e =>
              setForm(prev => ({ ...prev, startDate: e.target.value }))
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={14} /> End Date
          </label>
          <input
            type="date"
            className={inputClass}
            value={form.endDate}
            onChange={e =>
              setForm(prev => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
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

      <div className="space-y-1">
        <label className="text-xs text-gray-500 flex items-center gap-1">
          <FileText size={14} /> Notes
        </label>
        <textarea
          placeholder="Additional instructions, cautions, or notes..."
          className={`${inputClass} min-h-[100px]`}
          value={form.notes}
          onChange={e =>
            setForm(prev => ({ ...prev, notes: e.target.value }))
          }
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}

      <div className="flex flex-wrap gap-4 pt-2">
        <button
          disabled={submitting}
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-indigo-600 !text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle2 size={16} />
          {isEditing ? 'Update' : 'Add'}
        </button>

        {isEditing && (
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}