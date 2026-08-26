'use client';

import { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

type NewCategory = {
  code: string;
  name: string;
  description: string;
};

interface Props {
  newCategory: NewCategory;
  setNewCategory: React.Dispatch<React.SetStateAction<NewCategory>>;
  createCategory: () => Promise<void> | void;
}

export default function CreateCategoryCard({
  newCategory,
  setNewCategory,
  createCategory,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; name?: string }>({});
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

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

  const handleCreate = async () => {
    setMessage(null);

    if (!validate()) return;

    try {
      await createCategory();

      setErrors({});
      setMessage({
        type: 'success',
        text: 'Category created successfully.',
      });
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: (err as Error).message || 'Failed to create category.',
      });
    }
  };

  const isValid =
    newCategory.code.trim().length > 0 &&
    newCategory.name.trim().length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition hover:!bg-[#F7F7F5] sm:px-6 sm:py-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg !bg-[#ECFBF5]">
            <Plus size={16} className="!text-[#1D9E75]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold !text-[#16211B]">
              Create New Category
            </h3>
            <p className="text-[10px] !text-[#767570]">
              Add a billing category
            </p>
          </div>
        </div>

        <ChevronDown
          size={18}
          className={`!text-[#B4B2A9] transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-5 border-t !border-[#E8E6E0] px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          {message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === 'success'
                  ? '!border-[#CFF0E1] !bg-[#ECFBF5] !text-[#1D9E75]'
                  : '!border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626]'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Code <span className="!text-[#DC2626]">*</span>
              </label>
              <input
                placeholder="e.g. LAB-001"
                value={newCategory.code}
                onChange={(e) => {
                  setNewCategory((prev) => ({
                    ...prev,
                    code: e.target.value,
                  }));
                  setMessage(null);
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] ${
                  errors.code
                    ? '!border-[#DC2626] focus:!border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                    : '!border-[#E8E6E0] !bg-white focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20'
                }`}
              />
              {errors.code && (
                <p className="text-xs !text-[#DC2626]">{errors.code}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Name <span className="!text-[#DC2626]">*</span>
              </label>
              <input
                placeholder="e.g. Laboratory Tests"
                value={newCategory.name}
                onChange={(e) => {
                  setNewCategory((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }));
                  setMessage(null);
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] ${
                  errors.name
                    ? '!border-[#DC2626] focus:!border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                    : '!border-[#E8E6E0] !bg-white focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20'
                }`}
              />
              {errors.name && (
                <p className="text-xs !text-[#DC2626]">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                Description <span className="font-normal normal-case !text-[#B4B2A9]">(optional)</span>
              </label>
              <input
                placeholder="e.g. All lab-related charges"
                value={newCategory.description}
                onChange={(e) => {
                  setNewCategory((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }));
                  setMessage(null);
                }}
                className="w-full rounded-xl border !border-[#E8E6E0] !bg-white px-3.5 py-2.5 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            disabled={!isValid}
            className={`h-10 w-full sm:w-auto rounded-xl px-6 text-xs font-semibold transition ${
              isValid
                ? '!bg-[#0c1a12] !text-white hover:!bg-[#16211B]'
                : '!bg-[#F7F7F5] !text-[#B4B2A9] cursor-not-allowed'
            }`}
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}