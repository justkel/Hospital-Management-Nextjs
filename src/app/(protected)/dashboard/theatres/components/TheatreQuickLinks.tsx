import Link from 'next/link';

import {
  ArrowRight,
  Ban,
  CalendarClock,
  CalendarDays,
} from 'lucide-react';

interface Props {
  theatreId: string;
}

const LINKS = [
  {
    href: (id: string) => `/dashboard/theatres/${id}/availability`,
    icon: CalendarDays,
    label: 'Availability',
    description: 'Configure weekly operating windows and session types',
    badgeLabel: 'Manage',
    badge: '!bg-[#ECFBF5] !text-[#1D9E75] !border-[#CFF0E1]',
    iconBg: '!bg-[#F7F7F5] !text-[#5F5E5A]',
  },
  {
    href: (id: string) => `/dashboard/theatres/${id}/day-schedule`,
    icon: CalendarClock,
    label: 'Day schedule',
    description: 'View a single day\u2019s timeline of open windows and active holds',
    badgeLabel: 'View',
    badge: '!bg-[#EFF5FF] !text-[#1D6FE0] !border-[#D6E4FB]',
    iconBg: '!bg-[#F7F7F5] !text-[#5F5E5A]',
  },
  {
    href: (id: string) => `/dashboard/theatres/${id}/block`,
    icon: Ban,
    label: 'Blocks',
    description: 'Manage maintenance holds, closures and scheduling restrictions',
    badgeLabel: 'Manage',
    badge: '!bg-[#ECFBF5] !text-[#1D9E75] !border-[#CFF0E1]',
    iconBg: '!bg-[#FEF2F2] !text-[#DC2626]',
  },
];

export default function TheatreQuickLinks({ theatreId }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {LINKS.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.label}
            href={link.href(theatreId)}
            className="group relative overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white transition hover:!border-[#D3D1C7]"
          >
            <div className="flex items-start gap-3.5 px-5 py-4.5 sm:gap-4 sm:px-6 sm:py-5">
              <div
                className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${link.iconBg}`}
              >
                <Icon size={18} strokeWidth={1.75} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold tracking-tight !text-[#16211B]">
                    {link.label}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${link.badge}`}
                  >
                    {link.badgeLabel}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed !text-[#767570]">
                  {link.description}
                </p>
              </div>

              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full !bg-[#F7F7F5] !text-[#B4B2A9] transition duration-200 group-hover:!bg-[#0c1a12] group-hover:!text-white">
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}