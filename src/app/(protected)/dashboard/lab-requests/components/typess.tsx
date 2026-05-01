import { FlaskConical } from 'lucide-react';

export const PRIORITY_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  STAT: {
    label: 'STAT',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
  URGENT: {
    label: 'URGENT',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  ROUTINE: {
    label: 'ROUTINE',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
};

export const STATUS_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  COMPLETED: {
    label: 'Completed',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  PENDING: {
    label: 'Pending',
    dot: 'bg-yellow-400',
    badge: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  },
};

export function StatusPill({
  dotClass,
  badge,
  label,
}: {
  dotClass: string;
  badge: string;
  label: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}

export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-slate-100 last:border-0">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-4 w-4 text-slate-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-slate-800 break-words">
          {value ?? <span className="text-slate-400 italic">Not set</span>}
        </p>
      </div>
    </div>
  );
}

export function TestChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-200">
      <FlaskConical className="h-3.5 w-3.5 shrink-0" />
      {name}
    </span>
  );
}

export function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {title && (
        <div className="border-b border-slate-100 px-5 py-3.5">
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
      )}
      <div className="px-5">{children}</div>
    </div>
  );
}