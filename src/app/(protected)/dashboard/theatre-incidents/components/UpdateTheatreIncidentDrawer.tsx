'use client';

import { useEffect, useState } from 'react';

import {
    Drawer,
    Input,
    Select,
    Button,
    message,
    Divider,
} from 'antd';

import {
    GetTheatreIncidentByIdQuery,
    TheatreIncidentSeverity,
    TheatreIncidentStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';
import { useAppProps } from 'antd/es/app/context';

type Incident = GetTheatreIncidentByIdQuery['theatreIncidentById'];

type UpdateTheatreIncidentDrawerProps = {
    open: boolean;
    incident: Incident | null;
    onClose?: () => void;
    onUpdated?: () => void;
};

export default function UpdateTheatreIncidentDrawer({
    open,
    incident,
    onClose,
    onUpdated,
}: UpdateTheatreIncidentDrawerProps) {
    const [notes, setNotes] =
        useState('');

    const [severity, setSeverity] =
        useState<
            TheatreIncidentSeverity | ''
        >('');

    const [status, setStatus] =
        useState<
            TheatreIncidentStatus | ''
        >('');

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        if (!open || !incident) return;

        setNotes(incident.notes ?? '');

        setSeverity(
            incident.severity ?? '',
        );

        setStatus(
            incident.status ?? '',
        );
    }, [open, incident?.id]);

    function reset() {
        setNotes('');

        setSeverity('');

        setStatus('');
    }

    async function submit() {
        if (!incident) return;

        setLoading(true);

        try {
            const res = await clientFetch(
                '/api/theatre-incident/update',
                {
                    method: 'POST',

                    body: JSON.stringify({
                        incidentId:
                            incident.id,

                        notes,

                        severity,

                        status,
                    }),
                },
            );

            if (!res.ok) {
                let errorMessage =
                    'Unknown error';

                try {
                    const errorBody =
                        await res.json();

                    errorMessage =
                        errorBody?.message ||
                        errorBody?.error ||
                        JSON.stringify(
                            errorBody,
                        );
                } catch {
                    errorMessage =
                        await res.text();
                }

                throw new Error(
                    errorMessage,
                );
            }

            message.success(
                'Theatre incident updated successfully',
            );

            onUpdated?.();

            onClose?.();

            reset();
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to update incident';

            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    const severityOptions =
        Object.values(
            TheatreIncidentSeverity,
        ).map(v => ({
            value: v,

            label: v.replace(
                /_/g,
                ' ',
            ),
        }));

    const statusOptions =
        Object.values(
            TheatreIncidentStatus,
        ).map(v => ({
            value: v,

            label: v.replace(
                /_/g,
                ' ',
            ),
        }));

    return (
        <Drawer
            open={open}
            onClose={() => {
                onClose?.();

                reset();
            }}
            placement="right"
            size="default"
            className="md:!max-w-[600px]"
            title={
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-slate-900">
                        Update Theatre Incident
                    </span>

                    <span className="text-xs text-slate-500">
                        Edit severity,
                        status, and surgical
                        incident notes
                    </span>
                </div>
            }
        >
            {incident && (
                <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                        Incident ID
                    </p>

                    <p className="break-all text-sm font-medium text-slate-900">
                        {incident.id}
                    </p>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Severity Level
                    </label>

                    <Select
                        value={severity}
                        onChange={
                            setSeverity
                        }
                        className="mt-2 w-full"
                        size="large"
                        options={
                            severityOptions
                        }
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Incident Status
                    </label>

                    <Select
                        value={status}
                        onChange={
                            setStatus
                        }
                        className="mt-2 w-full"
                        size="large"
                        options={
                            statusOptions
                        }
                    />
                </div>

                <Divider className="!my-2" />

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Surgical Notes
                    </label>

                    <p className="mb-2 text-xs text-slate-500">
                        Add observations,
                        actions taken, or
                        escalation details
                    </p>

                    <Input.TextArea
                        rows={6}
                        value={notes}
                        onChange={e =>
                            setNotes(
                                e.target
                                    .value,
                            )
                        }
                        placeholder="Enter detailed surgical incident notes..."
                        className="rounded-xl"
                    />
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        onClick={submit}
                        className="!h-12 !rounded-xl !bg-cyan-600 !font-medium hover:!bg-cyan-700"
                    >
                        Save Updates
                    </Button>

                    <Button
                        block
                        size="large"
                        onClick={() => {
                            onClose?.();

                            reset();
                        }}
                        className="!h-12 !rounded-xl"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}