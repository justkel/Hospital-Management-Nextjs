'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useState } from 'react';

interface Props {
  visitId: string;
  onCreated: () => void;
}

export default function VisitComplaintCreate({
  visitId,
  onCreated,
}: Props) {
  const [complaint, setComplaint] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createComplaint = async () => {
    if (!complaint.trim()) {
      setError('Complaint cannot be empty');
      return;
    }

    try {
      setCreating(true);
      setError(null);

      const res = await clientFetch('/api/visit-complaints/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId,
          complaint,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create complaint');
      }

      setComplaint('');
      setError(null);
      onCreated();
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to create complaint');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <textarea
        value={complaint}
        onChange={(e) => {
          setComplaint(e.target.value);
          if (error) setError(null);
        }}
        placeholder="Enter patient's complaint..."
        className="
          w-full
          min-h-27.5
          resize-none
          rounded-xl
          border border-gray-300
          px-4 py-3
          text-sm sm:text-base
          shadow-sm
          focus:ring-2 focus:ring-indigo-500
          focus:border-indigo-500
          outline-none
        "
      />

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          onClick={createComplaint}
          disabled={creating || !complaint.trim()}
          className="
            w-full sm:w-auto
            px-6 py-3
            rounded-xl
            bg-indigo-600
            text-white!
            text-sm sm:text-base
            font-medium
            shadow
            hover:bg-indigo-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            cursor-pointer
          "
        >
          {creating ? 'Saving...' : 'Add Complaint'}
        </button>
      </div>
    </div>
  );
}