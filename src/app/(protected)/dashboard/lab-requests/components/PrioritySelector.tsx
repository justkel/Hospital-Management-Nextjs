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
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm sm:text-base font-semibold text-gray-800">
          Request Priority
        </label>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Choose how quickly this lab request should be attended to.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
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
                w-full rounded-2xl border
                px-4 py-4 sm:px-5 sm:py-5
                text-left transition-all duration-200
                active:scale-[0.98]
                ${styles[level as keyof typeof styles]}
              `}
            >
              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                  {level}
                </span>

                <span
                  className={`
                    self-start xs:self-auto
                    text-[10px] sm:text-xs font-medium
                    px-2 py-1 rounded-full whitespace-nowrap
                    ${badgeStyles[level as keyof typeof badgeStyles]}
                  `}
                >
                  {active ? 'Selected' : 'Choose'}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                {descriptions[level as keyof typeof descriptions]}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}