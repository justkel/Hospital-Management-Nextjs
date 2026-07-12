'use client';

import { DownOutlined } from '@ant-design/icons';
import { WardClass, WardDepartment } from '@/shared/graphql/generated/graphql';
import { BedOption, WardOption } from './useWardBedPicker';

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

function SelectField({
  value,
  onChange,
  disabled,
  children,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value)}
        className="appearance-none w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 shadow-sm transition focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-100 disabled:bg-slate-50 disabled:text-slate-400"
      >
        {children}
      </select>
      <DownOutlined className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-400" />
    </div>
  );
}

interface Props {
  department: WardDepartment | '';
  onDepartmentChange: (value: WardDepartment | '') => void;
  wardClass: WardClass | '';
  onWardClassChange: (value: WardClass | '') => void;

  wards: WardOption[];
  loadingWards: boolean;
  selectedWardId: string;
  onWardChange: (value: string) => void;

  beds: BedOption[];
  loadingBeds: boolean;
  selectedBedId: string;
  onBedChange: (value: string) => void;
}

export default function WardBedPickerFields({
  department,
  onDepartmentChange,
  wardClass,
  onWardClassChange,
  wards,
  loadingWards,
  selectedWardId,
  onWardChange,
  beds,
  loadingBeds,
  selectedBedId,
  onBedChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SelectField
          value={department}
          onChange={v => onDepartmentChange(v as WardDepartment | '')}
        >
          <option value="">All departments</option>
          {Object.values(WardDepartment).map(d => (
            <option key={d} value={d}>
              {d.replace(/_/g, ' ')}
            </option>
          ))}
        </SelectField>

        <SelectField
          value={wardClass}
          onChange={v => onWardClassChange(v as WardClass | '')}
        >
          <option value="">All classes</option>
          {Object.values(WardClass).map(c => (
            <option key={c} value={c}>
              {c.replace(/_/g, ' ')}
            </option>
          ))}
        </SelectField>
      </div>

      <SelectField
        value={selectedWardId}
        onChange={onWardChange}
        disabled={loadingWards}
      >
        <option value="">
          {loadingWards ? 'Loading wards…' : 'Select a ward'}
        </option>
        {wards.map(ward => (
          <option key={ward.id} value={ward.id}>
            {ward.name} ({ward.code}) — {ward.department}, {ward.wardClass}
          </option>
        ))}
      </SelectField>

      {selectedWardId && (
        <SelectField
          value={selectedBedId}
          onChange={onBedChange}
          disabled={loadingBeds}
        >
          <option value="">
            {loadingBeds
              ? 'Loading beds…'
              : beds.length === 0
                ? 'No available beds in this ward'
                : 'Select an available bed'}
          </option>
          {beds.map(bed => (
            <option key={bed.id} value={bed.id}>
              {bed.name} ({bed.bedCode}) — {bed.class}
            </option>
          ))}
        </SelectField>
      )}
    </div>
  );
}