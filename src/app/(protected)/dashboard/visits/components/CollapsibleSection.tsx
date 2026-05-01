'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 text-left group"
      >
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>

        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
}