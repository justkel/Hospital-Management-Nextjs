'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Props {
  title: string;
  icon?: React.ReactNode;
  iconColor?: 'teal' | 'amber' | 'blue' | 'purple' | 'red';
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ICON_COLORS = {
  teal:   'bg-[#F0FAF5] text-[#1D9E75]',
  amber:  'bg-[#FFFBEB] text-[#D97706]',
  blue:   'bg-[#EFF6FF] text-[#2563EB]',
  purple: 'bg-[#F5F3FF] text-[#7C3AED]',
  red:    'bg-[#FEF2F2] text-[#DC2626]',
};

export default function CollapsibleSection({
  title,
  icon,
  iconColor = 'teal',
  children,
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E6E0] bg-white">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#FAFAF8] ${open ? 'border-b border-[#E8E6E0]' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-[7px] ${ICON_COLORS[iconColor]}`}>
              {icon}
            </div>
          )}
          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5F5E5A]">
            {title}
          </span>
        </div>
        <ChevronDown
          size={15}
          className={`flex-shrink-0 text-[#B4B2A9] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  );
}