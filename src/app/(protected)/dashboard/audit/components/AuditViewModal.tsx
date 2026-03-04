'use client';

import { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { clientFetch } from '@/lib/clientFetch';

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

  useEffect(() => {
    async function load() {
      const res = await clientFetch(
        `/api/audit/get-by-id?id=${id}`
      );
      if (!res.ok) return;

      const json: { audit: AuditDetails | null } =
        await res.json();

      setAudit(json.audit);
    }

    load();
  }, [id]);

  return (
    <Modal
      open
      title="Audit Log Details"
      onCancel={onClose}
      footer={null}
    >
      {audit ? (
        <div className="space-y-3 text-sm">
          <p><strong>Action:</strong> {audit.action}</p>
          <p><strong>Entity:</strong> {audit.entity}</p>
          <p><strong>Description:</strong> {audit.actorDescription ?? 'N/A'}</p>
          <p><strong>Actor ID:</strong> {audit.actorId ?? 'N/A'}</p>
          <p><strong>Entity:</strong> {audit.entity ?? 'N/A'}</p>
          <p><strong>Date:</strong> {new Date(audit.createdAt).toLocaleString()}</p>
          <div>
            <strong>Metadata:</strong>
            <pre className="bg-gray-100 p-3 rounded mt-2 text-xs overflow-auto">
              {JSON.stringify(audit.metadata ?? {}, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </Modal>
  );
}