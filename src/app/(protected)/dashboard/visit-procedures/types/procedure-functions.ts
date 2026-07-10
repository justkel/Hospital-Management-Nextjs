import { VisitProcedureEventType } from "@/shared/graphql/generated/graphql";
import { FileText, PlayCircle, CheckCircle2, PauseCircle, Sparkles, ShieldAlert, Activity } from "lucide-react";

export function formatDuration(minutes?: number | null) {
    if (!minutes) return null;

    if (minutes < 60) {
        return `${minutes} min${minutes === 1 ? '' : 's'}`;
    }

    const hours = minutes / 60;
    const formattedHours =
        hours % 1 === 0 ? hours : Number(hours.toFixed(1));

    return `${formattedHours} hour${formattedHours === 1 ? '' : 's'
        }`;
}

type EventOption = {
    type: VisitProcedureEventType;
    label: string;
    description: string;
    icon: any;
    activeClass: string;
    activeBg: string;
    activeText: string;
    activeBorder: string;
};

export const EVENT_OPTIONS: EventOption[] = [
    {
        type: VisitProcedureEventType.Note,
        label: 'Clinical Note',
        description: 'Log observation or update',
        icon: FileText,
        activeClass: 'border-violet-500 bg-violet-50',
        activeBg: 'bg-violet-500',
        activeText: 'text-violet-700',
        activeBorder: 'border-violet-500',
    },
    {
        type: VisitProcedureEventType.Started,
        label: 'Start Procedure',
        description: 'Begin procedure execution',
        icon: PlayCircle,
        activeClass: 'border-blue-500 bg-blue-50',
        activeBg: 'bg-blue-500',
        activeText: 'text-blue-700',
        activeBorder: 'border-blue-500',
    },
    {
        type: VisitProcedureEventType.StepCompleted,
        label: 'Step Completed',
        description: 'Mark a step as done',
        icon: CheckCircle2,
        activeClass: 'border-emerald-500 bg-emerald-50',
        activeBg: 'bg-emerald-500',
        activeText: 'text-emerald-700',
        activeBorder: 'border-emerald-500',
    },
    {
        type: VisitProcedureEventType.Paused,
        label: 'Pause',
        description: 'Temporarily halt procedure',
        icon: PauseCircle,
        activeClass: 'border-amber-500 bg-amber-50',
        activeBg: 'bg-amber-500',
        activeText: 'text-amber-700',
        activeBorder: 'border-amber-500',
    },
    {
        type: VisitProcedureEventType.Resumed,
        label: 'Resume',
        description: 'Continue after pause',
        icon: Activity,
        activeClass: 'border-indigo-500 bg-indigo-50',
        activeBg: 'bg-indigo-500',
        activeText: 'text-indigo-700',
        activeBorder: 'border-indigo-500',
    },
    {
        type: VisitProcedureEventType.Completed,
        label: 'Mark Complete',
        description: 'Procedure successfully done',
        icon: Sparkles,
        activeClass: 'border-green-500 bg-green-50',
        activeBg: 'bg-green-500',
        activeText: 'text-green-700',
        activeBorder: 'border-green-500',
    },
    {
        type: VisitProcedureEventType.Complication,
        label: 'Complication',
        description: 'Flag an adverse event',
        icon: ShieldAlert,
        activeClass: 'border-orange-500 bg-orange-50',
        activeBg: 'bg-orange-500',
        activeText: 'text-orange-700',
        activeBorder: 'border-orange-500',
    },
];