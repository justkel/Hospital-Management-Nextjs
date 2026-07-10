'use client';

import { useEffect, useMemo, useState } from 'react';
import { Select, Segmented, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Tag as TagIcon, Database, UserRound, RotateCcw, X } from 'lucide-react';

import {
  AuditDateFilter,
  AuditDistinctField,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import { Filters } from '../AuditManagementClient';

const { RangePicker } = DatePicker;

export type StaffById = {
  id: string;
  userCode: string;
  fullName: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
};

const DATE_OPTIONS = [
  { label: 'All time', value: '' },
  { label: 'Today', value: AuditDateFilter.Today },
  { label: 'This week', value: AuditDateFilter.ThisWeek },
  { label: 'This month', value: AuditDateFilter.ThisMonth },
  { label: 'Custom', value: AuditDateFilter.Custom },
];

export default function AuditFilters({ filters, onChange }: Props) {
  const [actions, setActions] = useState<string[]>([]);
  const [entities, setEntities] = useState<string[]>([]);
  const [actorIds, setActorIds] = useState<string[]>([]);
  const [staffMap, setStaffMap] = useState<Record<string, StaffById>>({});

  const [loadingActions, setLoadingActions] = useState(true);
  const [loadingEntities, setLoadingEntities] = useState(true);
  const [loadingActors, setLoadingActors] = useState(true);

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
    fetchDistinct(AuditDistinctField.Action)
      .then(setActions)
      .finally(() => setLoadingActions(false));

    fetchDistinct(AuditDistinctField.Entity)
      .then(setEntities)
      .finally(() => setLoadingEntities(false));
  }, []);

  useEffect(() => {
    async function load() {
      const ids = await fetchDistinct(AuditDistinctField.ActorId);
      setActorIds(ids);
      const resolved = await Promise.all(ids.map(fetchStaffById));
      const map: Record<string, StaffById> = {};
      resolved.forEach(staff => {
        if (staff) map[staff.id] = staff;
      });

      setStaffMap(map);
      setLoadingActors(false);
    }

    load();
  }, []);

  const activeChips = useMemo(() => {
    const chips: { key: keyof Filters; label: string }[] = [];

    if (filters.action) chips.push({ key: 'action', label: `Action: ${filters.action}` });
    if (filters.entity) chips.push({ key: 'entity', label: `Entity: ${filters.entity}` });

    if (filters.actorId) {
      const staff = staffMap[filters.actorId];
      chips.push({
        key: 'actorId',
        label: `Actor: ${staff ? staff.fullName : filters.actorId}`,
      });
    }

    if (filters.dateFilter) {
      chips.push({
        key: 'dateFilter',
        label:
          filters.dateFilter === AuditDateFilter.Custom
            ? `Date: ${filters.startDate ?? '…'} → ${filters.endDate ?? '…'}`
            : `Date: ${DATE_OPTIONS.find(d => d.value === filters.dateFilter)?.label}`,
      });
    }

    return chips;
  }, [filters, staffMap]);

  function clearOne(key: keyof Filters) {
    const next = { ...filters };
    delete next[key];

    if (key === 'dateFilter') {
      delete next.startDate;
      delete next.endDate;
    }

    onChange(next);
  }

  function clearAll() {
    onChange({});
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FilterField label="Action" icon={<TagIcon size={12} />}>
          <Select
            allowClear
            showSearch
            loading={loadingActions}
            placeholder="All actions"
            className="w-full"
            value={filters.action}
            onChange={value => onChange({ ...filters, action: value || undefined })}
            options={actions.map(a => ({ label: a, value: a }))}
            optionFilterProp="label"
          />
        </FilterField>

        <FilterField label="Entity" icon={<Database size={12} />}>
          <Select
            allowClear
            showSearch
            loading={loadingEntities}
            placeholder="All entities"
            className="w-full"
            value={filters.entity}
            onChange={value => onChange({ ...filters, entity: value || undefined })}
            options={entities.map(e => ({ label: e, value: e }))}
            optionFilterProp="label"
          />
        </FilterField>

        <FilterField label="Actor" icon={<UserRound size={12} />}>
          <Select
            allowClear
            showSearch
            loading={loadingActors}
            placeholder="All actors"
            className="w-full"
            value={filters.actorId}
            onChange={value => onChange({ ...filters, actorId: value || undefined })}
            optionFilterProp="label"
            options={actorIds.map(id => {
              const staff = staffMap[id];
              return {
                value: id,
                label: staff ? `${staff.userCode} · ${staff.fullName}` : id,
              };
            })}
          />
        </FilterField>

        <FilterField label="Date range">
          <Segmented
            block
            className="w-full"
            value={filters.dateFilter ?? ''}
            onChange={value =>
              onChange({
                ...filters,
                dateFilter: (value as AuditDateFilter) || undefined,
                ...(value !== AuditDateFilter.Custom
                  ? { startDate: undefined, endDate: undefined }
                  : {}),
              })
            }
            options={DATE_OPTIONS}
          />
        </FilterField>
      </div>

      {filters.dateFilter === AuditDateFilter.Custom && (
        <div className="mt-4">
          <RangePicker
            className="w-full sm:w-auto"
            value={[
              filters.startDate ? dayjs(filters.startDate) : null,
              filters.endDate ? dayjs(filters.endDate) : null,
            ]}
            onChange={dates =>
              onChange({
                ...filters,
                startDate: dates?.[0] ? dates[0].format('YYYY-MM-DD') : undefined,
                endDate: dates?.[1] ? dates[1].format('YYYY-MM-DD') : undefined,
              })
            }
          />
        </div>
      )}

      {activeChips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          {activeChips.map(chip => (
            <button
              key={chip.key}
              onClick={() => clearOne(chip.key)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-100"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}

          <button
            onClick={clearAll}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-blue-600 transition hover:text-blue-800"
          >
            <RotateCcw size={12} />
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}