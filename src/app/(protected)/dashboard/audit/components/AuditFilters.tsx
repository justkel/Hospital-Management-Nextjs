'use client';

import {
  AuditDateFilter,
  AuditDistinctField,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { Filters } from '../AuditManagementClient';

export type StaffById = {
  id: string;
  userCode: string;
  fullName: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

export default function AuditFilters({ filters, onChange }: Props) {
  const [actions, setActions] = useState<string[]>([]);
  const [actorIds, setActorIds] = useState<string[]>([]);
  const [entities, setEntities] = useState<string[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, StaffById>>({});

  async function fetchDistinct(field: AuditDistinctField) {
    const res = await clientFetch(`/api/audit/distinct?field=${field}`);
    if (!res.ok) return [];
    const json: { values: string[] } = await res.json();
    return json.values;
  }

  async function fetchStaffById(id: string): Promise<StaffById | null> {
    const res = await clientFetch(`/api/staff/get-by-id?id=${id}`);
    if (!res.ok) return null;

    const json: { staff: StaffById | null } = await res.json();
    return json.staff;
  }

  useEffect(() => {
    async function load() {
      const [a, actorIdsResult, e] = await Promise.all([
        fetchDistinct(AuditDistinctField.Action),
        fetchDistinct(AuditDistinctField.ActorId),
        fetchDistinct(AuditDistinctField.Entity),
      ]);

      setActions(a);
      setActorIds(actorIdsResult);
      setEntities(e);

      const resolved = await Promise.all(
        actorIdsResult.map(id => fetchStaffById(id))
      );

      const map: Record<string, StaffById> = {};
      resolved.forEach(staff => {
        if (staff) {
          map[staff.id] = staff;
        }
      });

      setStaffMap(map);
    }

    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <select
        className="border rounded-lg p-2"
        value={filters.action ?? ''}
        onChange={e =>
          onChange({ ...filters, action: e.target.value || undefined })
        }
      >
        <option value="">All Actions</option>
        {actions.map(a => (
          <option key={a} value={a}>{a}</option>
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
        {actorIds.map(id => {
          const staff = staffMap[id];
          const label = staff
            ? `${staff.userCode} - ${staff.fullName}`
            : id;

          return (
            <option key={id} value={id}>
              {label}
            </option>
          );
        })}
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
          <option key={e} value={e}>{e}</option>
        ))}
      </select>

      <select
        className="border rounded-lg p-2"
        value={filters.dateFilter ?? ''}
        onChange={e =>
          onChange({
            ...filters,
            dateFilter:
              (e.target.value as AuditDateFilter) || undefined,
          })
        }
      >
        <option value="">All Dates</option>
        <option value={AuditDateFilter.Today}>Today</option>
        <option value={AuditDateFilter.ThisWeek}>This Week</option>
        <option value={AuditDateFilter.ThisMonth}>This Month</option>
        <option value={AuditDateFilter.Custom}>Custom</option>
      </select>

      {filters.dateFilter === AuditDateFilter.Custom && (
        <>
          <input
            type="date"
            className="border rounded-lg p-2"
            value={filters.startDate ?? ''}
            onChange={e =>
              onChange({ ...filters, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="border rounded-lg p-2"
            value={filters.endDate ?? ''}
            onChange={e =>
              onChange({ ...filters, endDate: e.target.value })
            }
          />
        </>
      )}
    </div>
  );
}