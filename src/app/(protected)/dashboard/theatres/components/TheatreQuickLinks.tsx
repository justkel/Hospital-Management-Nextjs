import Link from 'next/link';

import {
  ArrowRight,
  Ban,
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
    accent: {
      bg: 'from-violet-500 to-indigo-600',
      glow: 'shadow-violet-200',
      badge: 'bg-violet-100 text-violet-700 border-violet-200',
      bar: 'bg-violet-500',
      hover: 'hover:shadow-violet-200/80',
      arrow: 'group-hover:bg-violet-600',
      iconBg: 'bg-violet-50 text-violet-600',
    },
  },
  {
    href: (id: string) => `/dashboard/theatres/${id}/block`,
    icon: Ban,
    label: 'Blocks',
    description: 'Manage maintenance holds, closures and scheduling restrictions',
    accent: {
      bg: 'from-rose-500 to-pink-600',
      glow: 'shadow-rose-200',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      bar: 'bg-rose-500',
      hover: 'hover:shadow-rose-200/80',
      arrow: 'group-hover:bg-rose-600',
      iconBg: 'bg-rose-50 text-rose-600',
    },
  },
];

export default function TheatreQuickLinks({ theatreId }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const { accent } = link;

        return (
          <Link
            key={link.label}
            href={link.href(theatreId)}
            className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:shadow-lg ${accent.hover} hover:-translate-y-0.5`}
          >

            <div className="flex items-start gap-4 px-6 py-5">
              <div
                className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-100 ${accent.iconBg} shadow-sm transition group-hover:scale-105`}
              >
                <Icon size={20} strokeWidth={1.75} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-black tracking-tight text-slate-900">
                    {link.label}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${accent.badge}`}
                  >
                    Manage
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {link.description}
                </p>
              </div>
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition duration-200 ${accent.arrow} group-hover:text-white`}
              >
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}