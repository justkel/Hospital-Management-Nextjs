'use client';

import { useEffect, useState } from 'react';
import { Drawer, Input, Select, Button, message, Divider } from 'antd';

import {
    WardIncidentSeverity,
    WardIncidentStatus,
} from '@/shared/graphql/generated/graphql';

import { clientFetch } from '@/lib/clientFetch';

type EditableWardIncident = {
    id: string;
    notes?: string | null;
    severity?: WardIncidentSeverity | null;
    status?: WardIncidentStatus | null;
};

type UpdateWardIncidentDrawerProps = {
    open: boolean;
    incident: EditableWardIncident | null;
    onClose?: () => void;
    onUpdated?: () => void;
};

export default function UpdateWardIncidentDrawer({
    open,
    incident,
    onClose,
    onUpdated,
}: UpdateWardIncidentDrawerProps) {
    const [notes, setNotes] = useState('');
    const [severity, setSeverity] = useState<WardIncidentSeverity | ''>('');
    const [status, setStatus] = useState<WardIncidentStatus | ''>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !incident) return;

        setNotes(incident.notes ?? '');
        setSeverity(incident.severity ?? '');
        setStatus(incident.status ?? '');
    }, [open, incident]);

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
            size="default"
            className="md:!max-w-[600px]"
            styles={{ body: { background: '#FAFAF8' } }}
            title={
                <div className="flex flex-col">
                    <span className="text-lg font-semibold !text-[#16211B]">
                        Update ward incident
                    </span>
                    <span className="text-xs !text-[#767570]">
                        Edit severity, status, and clinical notes
                    </span>
                </div>
            }
        >
            {incident && (
                <div className="mb-6 rounded-xl border !border-[#E8E6E0] !bg-white p-4">
                    <p className="text-xs !text-[#B4B2A9]">
                        Incident ID
                    </p>
                    <p className="break-all text-sm font-medium !text-[#16211B]">
                        {incident.id}
                    </p>
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label className="text-sm font-medium !text-[#5F5E5A]">
                        Severity level
                    </label>

                    <Select
                        value={severity}
                        onChange={setSeverity}
                        className="mt-2 w-full"
                        size="large"
                        options={severityOptions}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium !text-[#5F5E5A]">
                        Incident status
                    </label>

                    <Select
                        value={status}
                        onChange={setStatus}
                        className="mt-2 w-full"
                        size="large"
                        options={statusOptions}
                    />
                </div>

                <Divider className="!my-2" />

                <div>
                    <label className="text-sm font-medium !text-[#5F5E5A]">
                        Clinical notes
                    </label>

                    <p className="mb-2 text-xs !text-[#B4B2A9]">
                        Add observations, actions taken, or escalation details
                    </p>

                    <Input.TextArea
                        rows={6}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Enter detailed clinical notes…"
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
                        className="!h-12 !rounded-xl !bg-[#0c1a12] !font-medium hover:!bg-[#16211B]"
                    >
                        Save updates
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