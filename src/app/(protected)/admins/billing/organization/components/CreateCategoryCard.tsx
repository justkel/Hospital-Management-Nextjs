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
        <div className="px-8 pb-8 space-y-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              placeholder="Code"
              value={newCategory.code}
              onChange={e =>
                setNewCategory((prev: any) => ({
                  ...prev,
                  code: e.target.value,
                }))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <input
              placeholder="Name"
              value={newCategory.name}
              onChange={e =>
                setNewCategory((prev: any) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />

            <input
              placeholder="Description"
              value={newCategory.description}
              onChange={e =>
                setNewCategory((prev: any) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="rounded-xl border border-gray-200 px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={createCategory}
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-medium text-white! shadow-sm hover:bg-emerald-700 transition active:scale-[0.98]"
          >
            Create Category
          </button>
        </div>
      </div>
    </div>
  );
}