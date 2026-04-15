'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  newCategory: {
    code: string;
    name: string;
    description: string;
  };
  setNewCategory: React.Dispatch<React.SetStateAction<any>>;
  createCategory: () => void;
}

export default function CreateCategoryCard({
  newCategory,
  setNewCategory,
  createCategory,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});

  const validate = () => {
    const trimmedCode = newCategory.code.trim();
    const trimmedName = newCategory.name.trim();

    const newErrors: typeof errors = {};

    if (!trimmedCode) {
      newErrors.code = 'Code is required';
    }

    if (!trimmedName) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    createCategory();
    setErrors({});
  };

  const isValid =
    newCategory.code.trim().length > 0 &&
    newCategory.name.trim().length > 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300">

      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-8 py-6 text-left hover:bg-gray-50 transition"
      >
        <h2 className="text-lg font-semibold text-gray-900">
          Create New Category
        </h2>

        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-8 pb-8 pt-1.5 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div className="space-y-1">
              <input
                placeholder="Code *"
                value={newCategory.code}
                onChange={e =>
                  setNewCategory((prev: any) => ({
                    ...prev,
                    code: e.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none ${
                  errors.code
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'
                }`}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code}</p>
              )}
            </div>

            <div className="space-y-1">
              <input
                placeholder="Name *"
                value={newCategory.name}
                onChange={e =>
                  setNewCategory((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className={`w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none ${
                  errors.name
                    ? 'border-red-400 focus:ring-2 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-emerald-500'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <input
              placeholder="Description (optional)"
              value={newCategory.description}
              onChange={e =>
                setNewCategory((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={!isValid}
            className={`rounded-xl px-6 py-3 text-sm font-medium text-white! shadow-sm transition active:scale-[0.98] cursor-pointer ${
              isValid
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}