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

    const disabled = status === VisitProcedureStatus.Cancelled;

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

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50 px-5 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                Procedure Events
                            </p>
                            <h3 className="mt-0.5 text-base font-bold text-slate-900">
                                Record Event
                            </h3>
                        </div>

                        <div
                            className={`
                                flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold
                                ${disabled
                                    ? 'bg-red-50 text-red-600'
                                    : 'bg-emerald-50 text-emerald-700'
                                }
                            `}
                        >
                            <span
                                className={`
                                    h-1.5 w-1.5 rounded-full
                                    ${disabled ? 'bg-red-500' : 'bg-emerald-500 animate-pulse'}
                                `}
                            />
                            {disabled ? 'Cancelled' : 'Active'}
                        </div>
                    </div>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    {disabled && (
                        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
                            <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                            <p className="text-sm font-medium text-red-700">
                                This procedure has been cancelled. Event creation is disabled.
                            </p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Event Type
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
                                        className={`
                                            group relative rounded-xl border p-3 text-left
                                            transition-all duration-150
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400
                                            disabled:cursor-not-allowed disabled:opacity-40
                                            ${isActive
                                                ? `${option.activeClass} shadow-sm`
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg
                                                transition-colors duration-150
                                                ${isActive
                                                    ? `${option.activeBg} text-white`
                                                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                                                }
                                            `}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <p
                                            className={`
                                                text-xs font-bold leading-tight
                                                ${isActive ? option.activeText : 'text-slate-700'}
                                            `}
                                        >
                                            {option.label}
                                        </p>

                                        <p
                                            className={`
                                                mt-0.5 text-[10px] leading-tight
                                                ${isActive ? option.activeText + '/80' : 'text-slate-400'}
                                            `}
                                        >
                                            {option.description}
                                        </p>

                                        {isActive && (
                                            <span
                                                className={`
                                                    absolute right-2 top-2 flex h-4 w-4 items-center justify-center
                                                    rounded-full ${option.activeBg}
                                                `}
                                            >
                                                <CheckCircle2 className="h-3 w-3 text-white" />
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
                            className="block text-xs font-bold uppercase tracking-wider text-slate-400"
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
                            className="
                                w-full resize-none rounded-xl border border-slate-200 bg-white
                                px-4 py-3 text-sm text-slate-800
                                placeholder:text-slate-300
                                transition-colors duration-150
                                focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100
                                disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400
                            "
                        />
                        {messageValue.length > 0 && (
                            <p className="text-right text-[10px] text-slate-300">
                                {messageValue.length} character{messageValue.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                        {!disabled && selected && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <div
                                    className={`
                                        flex h-5 w-5 items-center justify-center rounded-md ${selected.activeBg} text-white
                                    `}
                                >
                                    <selected.icon className="h-3 w-3" />
                                </div>
                                Recording as{' '}
                                <span className={`font-semibold ${selected.activeText}`}>
                                    {selected.label}
                                </span>
                            </div>
                        )}

                        {disabled && (
                            <div className="text-xs text-slate-400" />
                        )}

                        <button
                            type="button"
                            disabled={disabled || loading || !messageValue.trim()}
                            onClick={submit}
                            className={`
                                flex items-center justify-center gap-2
                                rounded-xl px-5 py-2.5
                                text-sm font-bold !text-white
                                transition-all duration-150
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-400
                                active:scale-[0.98]
                                disabled:cursor-not-allowed disabled:opacity-40
                                ${selected
                                    ? `${selected.activeBg} hover:opacity-90 shadow-sm`
                                    : 'bg-slate-900 hover:bg-slate-800 shadow-sm'
                                }
                            `}
                        >
                            {loading ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Recording…
                                </>
                            ) : (
                                <>
                                    {selected && <selected.icon className="h-3.5 w-3.5" />}
                                    Record Event
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}