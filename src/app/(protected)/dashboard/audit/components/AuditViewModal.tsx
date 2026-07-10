'use client';

import { useEffect, useState } from 'react';
import { Modal, Skeleton, Tooltip } from 'antd';
import { AppWindow, Check, Clock, Copy, Layers, UserRound, X } from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import { StaffById } from './AuditFilters';
import {
  formatAbsolute,
  formatRelative,
  getActionStyle,
  getInitials,
} from './auditVisuals';

type AuditDetails = {
  id: string;
  organizationId: string;
  actorId?: string;
  actorType?: string;
  actorDescription?: string;
  action: string;
  entity: string;
  appName: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export default function AuditViewModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const [audit, setAudit] = useState<AuditDetails | null>(null);
  const [staff, setStaff] = useState<StaffById | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const res = await clientFetch(`/api/audit/get-by-id?id=${id}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }

      const json: { audit: AuditDetails | null } = await res.json();
      setAudit(json.audit);

      if (json.audit?.actorId) {
        const staffRes = await clientFetch(
          `/api/staff/get-by-id?id=${json.audit.actorId}`
        );

        if (staffRes.ok) {
          const staffJson: { staff: StaffById } = await staffRes.json();
          setStaff(staffJson.staff);
        }
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function copyMetadata() {
    if (!audit?.metadata) return;
    await navigator.clipboard.writeText(JSON.stringify(audit.metadata, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const style = audit ? getActionStyle(audit.action) : null;

  return (
    <Modal
      open
      onCancel={onClose}
      footer={null}
      width={560}
      title={null}
      closeIcon={null}
      className="[&_.ant-modal-content]:overflow-hidden [&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0"
    >
      {loading ? (
        <div className="p-6">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : audit && style ? (
        <div>
          <div className="border-b border-gray-100 bg-gray-50/60 px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${style.bg} ${style.text} ${style.border}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                  {audit.action}
                </span>
                <p className="mt-2 text-sm text-gray-500">
                  on <span className="font-mono text-gray-700">{audit.entity}</span>
                </p>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="grid grid-cols-2 gap-4">
              <InfoTile
                icon={<UserRound size={13} />}
                label="Actor"
                value={
                  staff ? (
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-semibold text-blue-700">
                        {getInitials(staff.fullName)}
                      </span>
                      <span className="truncate">{staff.fullName}</span>
                    </span>
                  ) : (
                    audit.actorId ?? 'N/A'
                  )
                }
              />
              <InfoTile
                icon={<AppWindow size={13} />}
                label="Application"
                value={audit.appName ?? 'N/A'}
              />
              <InfoTile
                icon={<Layers size={13} />}
                label="Actor type"
                value={audit.actorType ?? 'N/A'}
              />
              <InfoTile
                icon={<Clock size={13} />}
                label="Date"
                value={
                  <Tooltip title={formatAbsolute(audit.createdAt)}>
                    <span>{formatRelative(audit.createdAt)}</span>
                  </Tooltip>
                }
              />
            </div>

            {audit.actorDescription && (
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Description
                </p>
                <p className="text-sm text-gray-600">{audit.actorDescription}</p>
              </div>
            )}

            {audit.metadata && Object.keys(audit.metadata).length > 0 && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Metadata
                  </p>
                  <button
                    onClick={copyMetadata}
                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition hover:text-gray-700"
                  >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="max-h-64 overflow-auto rounded-xl bg-gray-900 p-4 text-xs leading-relaxed text-gray-100">
                  {JSON.stringify(audit.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 text-sm text-gray-500">Audit log not found.</div>
      )}
    </Modal>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </p>
      <div className="text-sm font-medium text-gray-800">{value}</div>
    </div>
  );
}