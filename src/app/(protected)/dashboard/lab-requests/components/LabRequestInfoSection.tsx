'use client';

import { FindLabRequestByIdQuery } from '@/shared/graphql/generated/graphql';
import { formatDateTime } from '@/utils/formatDateTime';
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Activity,
  CalendarDays,
  Stethoscope,
  ShieldAlert,
  Clock,
} from 'lucide-react';
import { Card, DetailRow, PRIORITY_CONFIG, STATUS_CONFIG, StatusPill, TestChip } from './typess';

type LabRequest =
  FindLabRequestByIdQuery['labRequestById'];

type Props = {
  labRequest: LabRequest;
};

export default function LabRequestInfoSection({ labRequest }: Props) {
  const priority = PRIORITY_CONFIG[labRequest.priority] ?? {
    label: labRequest.priority,
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  };

  const status = STATUS_CONFIG[labRequest.status] ?? {
    label: labRequest.status,
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 py-6 px-4 sm:px-0">

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lab Request</h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of the laboratory request and associated details.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill dotClass={priority.dot} badge={priority.badge} label={priority.label} />
          <StatusPill dotClass={status.dot} badge={status.badge} label={status.label} />
        </div>
      </div>

      <Card title="Visit Details">
        <DetailRow
          icon={Stethoscope}
          label="Visit Type"
          value={labRequest.visit?.visitType}
        />
        <DetailRow
          icon={CalendarDays}
          label="Visit Date & Time"
          value={formatDateTime(labRequest.visit?.visitDateTime)}
        />
        <DetailRow
          icon={Clock}
          label="Request Created"
          value={formatDateTime(labRequest.createdAt)}
        />
      </Card>

      <Card title="Request Status">
        <DetailRow
          icon={ShieldAlert}
          label="Priority"
          value={labRequest.priority}
        />
        <DetailRow
          icon={Activity}
          label="Status"
          value={labRequest.status}
        />
      </Card>

      <Card title="Requested Tests">
        <div className="py-4">
          {labRequest.tests?.length ? (
            <div className="flex flex-wrap gap-2">
              {labRequest.tests.map(
                (test: {
                  chargeCatalogId: string;
                  testName: string;
                }) => (
                  <TestChip
                    key={test.chargeCatalogId}
                    name={test.testName}
                  />
                )
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No tests associated with this request.
            </p>
          )}
        </div>
      </Card>

    </div>
  );
}