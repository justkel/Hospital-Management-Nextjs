'use client';

import { clientFetch } from "@/lib/clientFetch";
import { LabResult } from "@/shared/graphql/generated/graphql";
import { useState } from "react";

export default function ResultCard({
  result,
  onUpdated,
}: {
  result: LabResult;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [items, setItems] = useState(result.items ?? []);
  const [loading, setLoading] = useState(false);

  const updateItem = (i: number, key: string, value: string) => {
    const copy = [...items];
    copy[i] = { ...copy[i], [key]: value };
    setItems(copy);
  };

  const save = async () => {
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

    setEditing(false);
    onUpdated();
    setLoading(false);
  };

  if (!items.length) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm">{result.testName}</h4>

        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-blue-600"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {items.map((item, i) => (
        <div key={item.id} className="text-sm space-y-1">
          {editing ? (
            <>
              <input
                value={item.parameter}
                onChange={e =>
                  updateItem(i, 'parameter', e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <input
                value={item.value}
                onChange={e =>
                  updateItem(i, 'value', e.target.value)
                }
                className="w-full border p-2 rounded"
              />
            </>
          ) : (
            <>
              <div>{item.parameter}</div>
              <div className="font-medium">{item.value}</div>
            </>
          )}
        </div>
      ))}

      {editing && (
        <button
          onClick={save}
          disabled={loading}
          className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}