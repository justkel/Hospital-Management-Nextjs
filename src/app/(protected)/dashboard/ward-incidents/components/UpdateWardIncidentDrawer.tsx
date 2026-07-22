'use client';

import { useEffect, useState } from 'react';
import { Drawer, Input, Select, Button, message, Divider } from 'antd';

import {
    WardIncidentSeverity,
    WardIncidentStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

export default function UpdateWardIncidentDrawer({
    open,
    incident,
    onClose,
    onUpdated,
}: any) {
    const [notes, setNotes] = useState('');
    const [severity, setSeverity] = useState<WardIncidentSeverity | ''>('');
    const [status, setStatus] = useState<WardIncidentStatus | ''>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !incident) return;

        setNotes(incident.notes ?? '');
        setSeverity(incident.severity ?? '');
        setStatus(incident.status ?? '');
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
            const res = await clientFetch('/api/ward-incident/update', {
                method: 'POST',
                body: JSON.stringify({
                    incidentId: incident.id,
                    notes,
                    severity,
                    status,
                }),
            });

            if (!res.ok) {
                let errorMessage = 'Unknown error';

                try {
                    const errorBody = await res.json();
                    errorMessage =
                        errorBody?.message ||
                        errorBody?.error ||
                        JSON.stringify(errorBody);
                } catch {
                    errorMessage = await res.text();
                }

                throw new Error(errorMessage);
            }

            message.success('Ward incident updated successfully');
            onUpdated?.();
            onClose?.();
            reset();
        } catch (err: any) {
            message.error(err?.message || 'Failed to update incident');
        } finally {
            setLoading(false);
        }
    }

    const severityOptions = Object.values(WardIncidentSeverity).map(v => ({
        value: v,
        label: v.replace(/_/g, ' '),
    }));

    const statusOptions = Object.values(WardIncidentStatus).map(v => ({
        value: v,
        label: v.replace(/_/g, ' '),
    }));

    return (
        <Drawer
            open={open}
            onClose={() => {
                onClose?.();
                reset();
            }}
            placement="right"
            size={520}
            className="md:!max-w-[600px]"
            title={
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-slate-900">
                        Update Ward Incident
                    </span>
                    <span className="text-xs text-slate-500">
                        Edit severity, status, and clinical notes
                    </span>
                </div>
            }
        >
            {incident && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-6">
                    <p className="text-xs text-slate-500">Incident ID</p>
                    <p className="text-sm font-medium text-slate-900 break-all">
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
                        onChange={setSeverity}
                        className="w-full mt-2"
                        size="large"
                        options={severityOptions}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Incident Status
                    </label>

                    <Select
                        value={status}
                        onChange={setStatus}
                        className="w-full mt-2"
                        size="large"
                        options={statusOptions}
                    />
                </div>

                <Divider className="!my-2" />

                <div>
                    <label className="text-sm font-medium text-slate-700">
                        Clinical Notes
                    </label>

                    <p className="text-xs text-slate-500 mb-2">
                        Add observations, actions taken, or escalation details
                    </p>

                    <Input.TextArea
                        rows={6}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Enter detailed clinical notes..."
                        className="rounded-xl"
                    />
                </div>

                <div className="pt-4 flex flex-col gap-3">
                    <Button
                        type="primary"
                        block
                        size="large"
                        loading={loading}
                        onClick={submit}
                        className="!rounded-xl !h-12 !font-medium"
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
                        className="!rounded-xl !h-12"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Drawer>
    );
}