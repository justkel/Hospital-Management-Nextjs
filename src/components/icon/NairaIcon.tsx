import { forwardRef } from 'react';
import type { LucideProps } from 'lucide-react';

export const NairaIcon = forwardRef<SVGSVGElement, LucideProps>(
  (
    {
      size = 24,
      color = 'currentColor',
      strokeWidth = 2,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        <text
          x="12"
          y="17"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="18"
          fontWeight="600"
        >
          ₦
        </text>
      </svg>
    );
  },
);

NairaIcon.displayName = 'NairaIcon';