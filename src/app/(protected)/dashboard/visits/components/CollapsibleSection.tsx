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
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-4 text-left group"
      >
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 tracking-tight">
          {title}
        </h2>

        <ChevronDown
          size={18}
          className={`
            text-gray-500
            transition-all duration-300 ease-in-out
            group-hover:text-gray-800
            ${open ? 'rotate-180' : ''}
          `}
        />
      </button>

      <div
        className={`
          overflow-hidden
          transition-[max-height,opacity] duration-400 ease-in-out
          ${open ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-sm text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}