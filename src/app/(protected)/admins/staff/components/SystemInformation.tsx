'use client';

import { useEffect, useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';

interface Props {
  staffId?: string | null;
}

interface Staff {
  fullName?: string;
  userCode?: string;
  email?: string;
}

export default function SystemInformation({ staffId }: Props) {
  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!staffId) return;

    const fetchStaff = async () => {
      try {
        setLoading(true);
        const res = await clientFetch(
          `/api/staff/get-by-id?id=${staffId}`
        );
        const json = await res.json();
        setStaff(json?.staff ?? null);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId]);

  return (
    <div className="bg-white rounded-3xl shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">System Information</h2>

      <Info label="Created By Staff ID" value={staffId} />

      {loading ? (
        <p className="text-sm text-gray-500">Loading staff details...</p>
      ) : (
        <>
          <Info label="Staff Name" value={staff?.fullName} />
          <Info label="Staff Code" value={staff?.userCode} />
          <Info label="Staff Email" value={staff?.email} />
        </>
      )}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Info({ label, value }: { label: string; value?: any }) {
  return (
    <div className="text-sm mb-3">
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value ?? '—'}</p>
    </div>
  );
}
