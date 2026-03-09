'use client';

import { clientFetch } from '@/lib/clientFetch';
import { useEffect, useState } from 'react';

interface Complaint {
  id: string;
  complaint: string;
  createdAt: string;
}

interface Props {
  visitId: string;
  refreshKey: number;
}

export default function VisitComplaintList({ visitId, refreshKey }: Props) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const res = await clientFetch(`/api/visit-complaints/by-visit/${visitId}`);
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'Failed to fetch complaints');
        }

        setComplaints(json.complaints ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (visitId) {
      fetchComplaints();
    }
  }, [visitId, refreshKey]);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading complaints...</p>;
  }

  if (!complaints.length) {
    return (
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
        No complaints recorded for this visit yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {complaints.map((c) => (
        <div
          key={c.id}
          className="w-full p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-2"
        >
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            {c.complaint}
          </p>

          <span className="text-xs text-gray-400">
            {new Date(c.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}