'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';

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

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

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
    <div className="w-full space-y-4 p-4 sm:p-5">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F0FAF5] text-[#1D9E75]">
          <MessageSquarePlus size={15} />
        </div>
        <div>
          <h3 className="text-[12px] font-extrabold text-[#14231A]">Record a complaint</h3>
          <p className="mt-0.5 text-[10px] font-medium text-[#8D9289]">Add the patient&apos;s concern to this visit</p>
        </div>
      </div>
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
          border border-[#E5EAE5]
          bg-[#FCFDFC]
          px-4 py-3
          text-[13px] text-[#353B34]
          shadow-sm
          transition
          focus:ring-2 focus:ring-[#1D9E75]/15
          focus:border-[#1D9E75]
          outline-none
        "
      />

      <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          onClick={createComplaint}
          disabled={creating || !complaint.trim()}
          className="
            w-full sm:w-auto
            px-5 py-2.5
            rounded-lg
            bg-[#1D9E75]
            text-white!
            text-[12px]
            font-semibold
            shadow-sm
            hover:bg-[#178664]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            cursor-pointer
          "
        >
          {creating ? 'Saving...' : 'Add Complaint'}
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}