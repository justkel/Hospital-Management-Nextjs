'use client';

import { useMemo, useState } from 'react';
import { message } from 'antd';
import {
    CreateVisitProcedureEventInput,
    VisitProcedureEventType,
    VisitProcedureStatus,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import {
    CheckCircle2,
    XCircle,
} from 'lucide-react';
import { EVENT_OPTIONS } from '../types/procedure-functions';

type Props = {
    procedureId: string;
    status: VisitProcedureStatus;
    onCreated?: () => void;
};

export default function CreateVisitProcedureEventCard({
    procedureId,
    status,
    onCreated,
}: Props) {
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedType, setSelectedType] = useState<VisitProcedureEventType>(
        VisitProcedureEventType.Note
    );
    const [messageValue, setMessageValue] = useState('');
    const [loading, setLoading] = useState(false);

    const isCancelled = status === VisitProcedureStatus.Cancelled;
    const isCompleted = status === VisitProcedureStatus.Completed;
    const disabled = isCancelled || isCompleted;

    const selected = useMemo(
        () => EVENT_OPTIONS.find(item => item.type === selectedType),
        [selectedType]
    );

    async function submit() {
        if (!messageValue.trim()) {
            messageApi.warning('Please enter an event message');
            return;
        }

        setLoading(true);
        try {
            const payload: CreateVisitProcedureEventInput = {
                procedureId,
                type: selectedType,
                message: messageValue,
            };

            const res = await clientFetch('/api/visit-procedure/create-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const json = await res.json();

            if (!res.ok) {
                messageApi.error(json.error ?? 'Failed to create event');
                return;
            }

            messageApi.success('Event recorded successfully');
            setMessageValue('');
            onCreated?.();
        } catch (error) {
            console.error(error);
            messageApi.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {contextHolder}

            <div className="overflow-hidden rounded-2xl border !border-[#E8E6E0] !bg-white">
                <div className="border-b !border-[#E8E6E0] !bg-[#FAFAF8] px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] !text-[#B4B2A9]">
                                Procedure Events
                            </p>
                            <h3 className="mt-0.5 truncate text-base font-semibold !text-[#16211B]">
                                Record event
                            </h3>
                        </div>

                        <div
                            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                                disabled
                                    ? isCompleted
                                        ? '!bg-[#EFF5FF] !text-[#1D6FE0]'
                                        : '!bg-[#FEF2F2] !text-[#DC2626]'
                                    : '!bg-[#ECFBF5] !text-[#1D9E75]'
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                                    disabled
                                        ? isCompleted
                                            ? '!bg-[#1D6FE0]'
                                            : '!bg-[#DC2626]'
                                        : 'animate-pulse !bg-[#1D9E75]'
                                }`}
                            />
                            {isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : 'Active'}
                        </div>
                    </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    {isCancelled && (
                        <div className="flex items-start gap-2.5 rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] px-4 py-3">
                            <XCircle className="h-4 w-4 shrink-0 !text-[#DC2626]" />
                            <p className="text-sm font-medium !text-[#DC2626]">
                                This procedure has been cancelled. Event creation is disabled.
                            </p>
                        </div>
                    )}

                    {isCompleted && (
                        <div className="flex items-start gap-2.5 rounded-xl border !border-[#D6E4FB] !bg-[#EFF5FF] px-4 py-3">
                            <CheckCircle2 className="h-4 w-4 shrink-0 !text-[#1D6FE0]" />
                            <p className="text-sm font-medium !text-[#1D6FE0]">
                                This procedure has been completed. Event creation is disabled.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold uppercase tracking-wider !text-[#B4B2A9]">
                            Event type
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {EVENT_OPTIONS.map(option => {
                                const Icon = option.icon;
                                const isActive = selectedType === option.type;

                                return (
                                    <button
                                        key={option.type}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => setSelectedType(option.type)}
                                        className={`relative min-w-0 rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                            isActive
                                                ? `${option.activeClass}`
                                                : '!border-[#E8E6E0] !bg-white hover:!bg-[#FAFAF8]'
                                        }`}
                                    >
                                        <div
                                            className={`mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                                                isActive
                                                    ? `${option.activeBg} !text-white`
                                                    : '!bg-[#F7F7F5] !text-[#767570]'
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <p
                                            className={`truncate text-xs font-semibold leading-tight ${
                                                isActive ? option.activeText : '!text-[#5F5E5A]'
                                            }`}
                                        >
                                            {option.label}
                                        </p>

                                        <p
                                            className={`mt-0.5 line-clamp-2 text-[10px] leading-tight ${
                                                isActive ? `${option.activeText}/80` : '!text-[#B4B2A9]'
                                            }`}
                                        >
                                            {option.description}
                                        </p>

                                        {isActive && (
                                            <span
                                                className={`absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full ${option.activeBg}`}
                                            >
                                                <CheckCircle2 className="h-3 w-3 !text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="event-message"
                            className="block text-xs font-semibold uppercase tracking-wider !text-[#B4B2A9]"
                        >
                            Message
                        </label>
                        <textarea
                            id="event-message"
                            value={messageValue}
                            disabled={disabled}
                            onChange={e => setMessageValue(e.target.value)}
                            rows={4}
                            placeholder="Document the clinical update, milestone, observation, or outcome…"
                            className="w-full resize-none rounded-xl border !border-[#E8E6E0] !bg-white px-4 py-3 text-sm !text-[#16211B] outline-none transition placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] disabled:cursor-not-allowed disabled:!bg-[#F7F7F5] disabled:!text-[#B4B2A9]"
                        />
                        {messageValue.length > 0 && (
                            <p className="text-right text-[10px] !text-[#D3D1C7]">
                                {messageValue.length} character{messageValue.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                        {!disabled && selected ? (
                            <div className="flex min-w-0 items-center gap-2 text-xs !text-[#767570]">
                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md !text-white ${selected.activeBg}`}
                                >
                                    <selected.icon className="h-3 w-3" />
                                </div>
                                <span className="truncate">
                                    Recording as{' '}
                                    <span className={`font-semibold ${selected.activeText}`}>
                                        {selected.label}
                                    </span>
                                </span>
                            </div>
                        ) : (
                            <div />
                        )}

                        <button
                            type="button"
                            disabled={disabled || loading || !messageValue.trim()}
                            onClick={submit}
                            className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold !text-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                selected ? `${selected.activeBg}` : '!bg-[#0c1a12]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 !border-white/30 !border-t-white" />
                                    Recording…
                                </>
                            ) : (
                                <>
                                    {selected && <selected.icon className="h-3.5 w-3.5" />}
                                    Record event
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}