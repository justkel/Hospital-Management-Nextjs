'use client';

import { LabPriority } from '@/shared/graphql/generated/graphql';
import { PrioritySelectorProps } from './types';

export default function PrioritySelector({
  priority,
  setPriority,
}: PrioritySelectorProps) {
  const descriptions = {
    ROUTINE: 'Normal processing',
    URGENT: 'Attend quickly',
    STAT: 'Immediate action',
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="space-y-1">
        <label className="block text-sm sm:text-base font-semibold text-gray-800">
          Request Priority
        </label>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Choose how quickly this lab request should be attended to.
        </p>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {Object.values(LabPriority).map(level => {
          const active = priority === level;

          const styles = {
            ROUTINE: active
              ? 'border-blue-500 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-blue-300',
            URGENT: active
              ? 'border-amber-500 bg-amber-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-amber-300',
            STAT: active
              ? 'border-red-500 bg-red-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-red-300',
          };

          const badgeStyles = {
            ROUTINE: active
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-500',
            URGENT: active
              ? 'bg-amber-100 text-amber-700'
              : 'bg-gray-100 text-gray-500',
            STAT: active
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-500',
          };

          return (
            <button
              key={level}
              type="button"
              onClick={() => setPriority(level)}
              className={`
                w-full min-h-[110px] sm:min-h-[125px]
                rounded-2xl border
                p-4 sm:p-5
                text-left
                transition-all duration-200
                active:scale-[0.98]
                ${styles[level as keyof typeof styles]}
              `}
            >
              <div className="flex items-start sm:items-center justify-between gap-2">
                <span className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg leading-snug">
                  {level}
                </span>

                <span
                  className={`
                    shrink-0
                    text-[10px] sm:text-xs font-medium
                    px-2 py-1 sm:px-2.5
                    rounded-full
                    whitespace-nowrap
                    ${badgeStyles[level as keyof typeof badgeStyles]}
                  `}
                >
                  {active ? 'Selected' : 'Choose'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 leading-relaxed">
                {descriptions[level as keyof typeof descriptions]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}