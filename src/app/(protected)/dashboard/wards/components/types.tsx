import { BedClass } from "@/shared/graphql/generated/graphql";
import { Crown, Sparkles, ShieldCheck, Bed } from "lucide-react";

export const STATUS_COLORS: Record<string, string> = {
    AVAILABLE:
        'border-emerald-200 bg-emerald-50 text-emerald-700',

    OCCUPIED:
        'border-red-200 bg-red-50 text-red-700',

    CLEANING:
        'border-amber-200 bg-amber-50 text-amber-700',

    MAINTENANCE:
        'border-slate-200 bg-slate-100 text-slate-700',

    BLOCKED:
        'border-orange-200 bg-orange-50 text-orange-700',

    ISOLATION:
        'border-purple-200 bg-purple-50 text-purple-700',

    RESERVED:
        'border-blue-200 bg-blue-50 text-blue-700',

    DECOMMISSIONED:
        'border-zinc-200 bg-zinc-100 text-zinc-600',
};

export const CLASS_STYLES: Record<string, string> = {
    STANDARD:
        'bg-slate-100 text-slate-700 border-slate-200',

    PREMIUM:
        'bg-cyan-50 text-cyan-700 border-cyan-200',

    VIP:
        'bg-amber-50 text-amber-700 border-amber-200',

    ISOLATION:
        'bg-purple-50 text-purple-700 border-purple-200',
};

export function getClassIcon(bedClass: BedClass) {
    switch (bedClass) {
        case BedClass.Vip:
            return <Crown size={13} />;

        case BedClass.Premium:
            return <Sparkles size={13} />;

        case BedClass.Isolation:
            return <ShieldCheck size={13} />;

        default:
            return <Bed size={13} />;
    }
}