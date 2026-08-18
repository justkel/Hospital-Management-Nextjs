'use client';

import Link from 'next/link';
import {
  KeyRound,
  Flag,
  Bell,
  ShieldCheck,
  ChevronRight,
  Settings as SettingsIcon,
} from 'lucide-react';

interface SettingsItem {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  available: boolean;
}

const settingsItems: SettingsItem[] = [
  {
    title: 'Profile & password',
    description:
      'Update your personal details and change your account password.',
    href: '/dashboard/profile',
    icon: KeyRound,
    available: true,
  },
  {
    title: 'Feature flags',
    description:
      'Turn optional capabilities on or off for your organization.',
    href: '/dashboard/settings/feature-flags',
    icon: Flag,
    available: true,
  },
  {
    title: 'Notifications',
    description: 'Manage how and when you receive alerts.',
    href: '#',
    icon: Bell,
    available: false,
  },
  {
    title: 'Security',
    description: 'Two-factor authentication and active sessions.',
    href: '#',
    icon: ShieldCheck,
    available: false,
  },
];

export default function SettingsClient() {
  return (
    <div className="min-h-screen !bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
            <SettingsIcon size={13} />
            Account & organization
          </div>
          <h1 className="text-2xl font-semibold tracking-tight !text-slate-900 sm:text-3xl">
            Settings
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-slate-500">
            Manage your account and the capabilities available across your
            organization.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const card = (
              <div
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border !border-slate-200/70 !bg-white/90 p-5 shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition-all duration-300 ${
                  item.available
                    ? 'cursor-pointer hover:-translate-y-0.5 hover:!bg-white hover:shadow-[0_16px_50px_rgba(15,23,42,0.10)]'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border !border-blue-100 !bg-blue-50">
                    <Icon size={19} className="!text-blue-600" />
                  </div>
                  {item.available ? (
                    <ChevronRight
                      size={16}
                      className="!text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:!text-slate-500"
                    />
                  ) : (
                    <span className="rounded-full border !border-slate-200 !bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide !text-slate-400">
                      Soon
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h2 className="text-base font-bold !text-slate-900">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed !text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            );

            return item.available ? (
              <Link key={item.title} href={item.href} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={item.title} className="h-full">
                {card}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}