'use client';

import { useEffect, useState } from 'react';
import {
  AuditDateFilter,
  AuditDistinctField,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

type Props = {
  filters: {
    action?: string;
    actorId?: string;
    entity?: string;
    dateFilter?: AuditDateFilter;
    startDate?: string;
    endDate?: string;
  };
  onChange: (filters: Props['filters']) => void;
};

export default function AuditFilters({
  filters,
  onChange,
}: Props) {
  const [actions, setActions] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [entities, setEntities] = useState<string[]>([]);

  async function fetchDistinct(field: AuditDistinctField) {
    const res = await clientFetch(`/api/audit/distinct?field=${field}`);
    if (!res.ok) return [];
    const json: { values: string[] } = await res.json();
    return json.values;
  }

  useEffect(() => {
    async function load() {
      const [a, b, c] = await Promise.all([
        fetchDistinct(AuditDistinctField.Action),
        fetchDistinct(AuditDistinctField.ActorId),
        fetchDistinct(AuditDistinctField.Entity),
      ]);

      setActions(a);
      setActors(b);
      setEntities(c);
    }
    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        className="border rounded-lg p-2"
        value={filters.action ?? ''}
        onChange={e =>
          onChange({ ...filters, action: e.target.value || undefined })
        }
      >
        <option value="">All Actions</option>
        {actions.map(a => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className="border rounded-lg p-2"
        value={filters.actorId ?? ''}
        onChange={e =>
          onChange({ ...filters, actorId: e.target.value || undefined })
        }
      >
        <option value="">All Actors</option>
        {actors.map(a => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select
        className="border rounded-lg p-2"
        value={filters.entity ?? ''}
        onChange={e =>
          onChange({ ...filters, entity: e.target.value || undefined })
        }
      >
        <option value="">All Entities</option>
        {entities.map(e => (
          <option key={e} value={e}>
            {e}
          </option>
        ))}
      </select>
    </div>
  );
}