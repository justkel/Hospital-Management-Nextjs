import { LucideIcon } from "lucide-react";

export const STATUS_CONFIG: Record<
    string,
    {
        label: string;
        dot: string;
        badge: string;
    }
> = {
    PENDING: {
        label: 'Pending',
        dot: 'bg-amber-400',
        badge:
            'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    },

    IN_PROGRESS: {
        label: 'In Progress',
        dot: 'bg-blue-500',
        badge:
            'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    },

    COMPLETED: {
        label: 'Completed',
        dot: 'bg-emerald-500',
        badge:
            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    },

    CANCELLED: {
        label: 'Cancelled',
        dot: 'bg-red-500',
        badge:
            'bg-red-50 text-red-700 ring-1 ring-red-200',
    },
};

export const PRIORITY_CONFIG: Record<
    string,
    {
        label: string;
        dot: string;
        badge: string;
    }
> = {
    LOW: {
        label: 'Low',
        dot: 'bg-slate-400',
        badge:
            'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
    },

    NORMAL: {
        label: 'Normal',
        dot: 'bg-blue-400',
        badge:
            'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    },

    HIGH: {
        label: 'High',
        dot: 'bg-orange-500',
        badge:
            'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    },

    URGENT: {
        label: 'Urgent',
        dot: 'bg-red-500',
        badge:
            'bg-red-50 text-red-700 ring-1 ring-red-200',
    },
};

export const OUTCOME_CONFIG: Record<
    string,
    {
        label: string;
        dot: string;
        badge: string;
    }
> = {
    SUCCESS: {
        label: 'Success',
        dot: 'bg-emerald-500',
        badge:
            'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    },

    FAILED: {
        label: 'Failed',
        dot: 'bg-red-500',
        badge:
            'bg-red-50 text-red-700 ring-1 ring-red-200',
    },

    PARTIAL: {
        label: 'Partial',
        dot: 'bg-amber-500',
        badge:
            'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    },

    COMPLICATION: {
        label: 'Complication',
        dot: 'bg-rose-500',
        badge:
            'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
    },
};

export function StatusPill({
    label,
    dotClass,
    badge,
}: {
    label: string;
    dotClass: string;
    badge: string;
}) {
    return (
        <div
            className={`
                inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold
                ${badge}
            `}
        >
            <span
                className={`h-2 w-2 rounded-full ${dotClass}`}
            />

            {label}
        </div>
    );
}

export function ProcedureCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h3 className="text-sm font-bold tracking-wide text-slate-700 uppercase">
                    {title}
                </h3>
            </div>

            <div className="divide-y divide-slate-100">
                {children}
            </div>
        </div>
    );
}

export function DetailRow({
    icon: Icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: string;
    value?: string | number | null;
}) {
    return (
        <div className="flex items-start gap-4 px-5 py-4 sm:px-6">
            <div className="rounded-2xl bg-slate-100 p-2">
                <Icon className="h-4 w-4 text-slate-600" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-slate-800">
                    {value || '—'}
                </p>
            </div>
        </div>
    );
}

export function StatCard({
    title,
    value,
    subtitle,
    gradient,
}: {
    title: string;
    value: number;
    subtitle: string;
    gradient: string;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} p-6 text-white shadow-xl`}
        >
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />

            <div className="relative z-10">
                <p className="text-sm text-white/80 font-medium">
                    {title}
                </p>

                <h3 className="mt-3 text-4xl font-black tracking-tight">
                    {value}
                </h3>

                <p className="mt-2 text-sm text-white/80">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}

export function StatusBadge({ status }: { status?: string | null }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
        IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-200',
        COMPLETED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${styles[status || 'PENDING']
                }`}
        >
            {(status || 'PENDING').replace(/_/g, ' ')}
        </span>
    );
}

export function PriorityBadge({ priority }: { priority?: string | null }) {
    const styles: Record<string, string> = {
        LOW: 'bg-slate-100 text-slate-700 border-slate-200',
        NORMAL: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
        URGENT: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${styles[priority || 'NORMAL']
                }`}
        >
            {priority || 'NORMAL'}
        </span>
    );
}