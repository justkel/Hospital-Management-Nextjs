'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus, LabResult } from '@/shared/graphql/generated/graphql';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { useHasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

type Item = {
  id?: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  interpretation?: string;
};

export default function ResultCard({
  result,
  onUpdated,
  status,
}: {
  result: LabResult;
  onUpdated: () => void;
  status: LabRequestStatus;
}) {
  const canEditLab = useHasRoles([Roles.LAB_TECH]);
  const isLocked =
    status === LabRequestStatus.Completed ||
    status === LabRequestStatus.Cancelled;

  const canInteract = canEditLab && !isLocked;

  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState<Item[]>(
    (result.items ?? []).map(i => ({
      id: i.id,
      parameter: i.parameter,
      value: i.value,
      unit: i.unit ?? undefined,
      referenceRange: i.referenceRange ?? undefined,
      interpretation: i.interpretation ?? undefined,
    }))
  );
  const [loading, setLoading] = useState(false);

  const updateItem = (i: number, key: keyof Item, value: string) => {
    if (!canInteract) return;

    const copy = [...items];
    copy[i] = { ...copy[i], [key]: value };
    setItems(copy);
  };

  const save = async () => {
    if (!canInteract) return;

    setLoading(true);

    await clientFetch('/api/lab-result/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        labResultId: result.id,
        items: items.map(i => ({
          parameter: i.parameter,
          value: i.value,
          unit: i.unit || undefined,
          referenceRange: i.referenceRange || undefined,
          interpretation: i.interpretation || undefined,
        })),
      }),
    });

    setLoading(false);
    setEditing(false);
    onUpdated();
  };

  if (!items.length) return null;

  const input =
    'w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500/30 outline-none';

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-slate-800 text-sm">
          {result.testName}
        </h4>

        {canInteract && (
          <button
            onClick={() => setEditing(v => !v)}
            className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            {editing ? (
              <>
                <CloseOutlined />
                Cancel
              </>
            ) : (
              <>
                <EditOutlined />
                Edit
              </>
            )}
          </button>
        )}

        {!canInteract && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">
            Read-only
          </span>
        )}
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div
            key={item.id ?? i}
            className="border rounded-xl p-3 space-y-2 bg-slate-50"
          >
            {editing && canInteract ? (
              <div className="grid sm:grid-cols-2 gap-2">
                <input
                  value={item.parameter}
                  onChange={e =>
                    updateItem(i, 'parameter', e.target.value)
                  }
                  className={input}
                  placeholder="Parameter"
                />
                <input
                  value={item.value}
                  onChange={e =>
                    updateItem(i, 'value', e.target.value)
                  }
                  className={input}
                  placeholder="Value"
                />
                <input
                  value={item.unit || ''}
                  onChange={e =>
                    updateItem(i, 'unit', e.target.value)
                  }
                  className={input}
                  placeholder="Unit"
                />
                <input
                  value={item.referenceRange || ''}
                  onChange={e =>
                    updateItem(i, 'referenceRange', e.target.value)
                  }
                  className={input}
                  placeholder="Reference Range"
                />
                <input
                  value={item.interpretation || ''}
                  onChange={e =>
                    updateItem(i, 'interpretation', e.target.value)
                  }
                  className="sm:col-span-2 w-full border rounded-xl px-3 py-2 text-sm"
                  placeholder="Interpretation"
                />
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <div className="text-slate-500">{item.parameter}</div>
                <div className="font-semibold text-slate-800">
                  {item.value}{' '}
                  <span className="text-xs text-slate-500">
                    {item.unit}
                  </span>
                </div>
                {item.referenceRange && (
                  <div className="text-xs text-slate-500">
                    Ref: {item.referenceRange}
                  </div>
                )}
                {item.interpretation && (
                  <div className="text-xs text-slate-600 italic">
                    {item.interpretation}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editing && canInteract && (
        <button
          onClick={save}
          disabled={loading}
          className="w-full bg-green-600 !text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}