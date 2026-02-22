'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VisitType } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

interface Props {
  patientId: string;
}

export default function CreateVisitModal({ patientId }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [visitType, setVisitType] = useState<VisitType>(VisitType.Opd);
  const [loading, setLoading] = useState(false);
  const [createdVisitId, setCreatedVisitId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await clientFetch('/api/visit/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          visitType,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to create visit');
      }

      setCreatedVisitId(json.visit.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setOpen(false);
    setCreatedVisitId(null);
    setError(null);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-2xl bg-green-700 text-white! font-medium shadow-sm hover:bg-emerald-700 transition cursor-pointer"
      >
        Create Visit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 sm:p-8 animate-in fade-in zoom-in-95">

            {!createdVisitId ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Create New Visit
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Visit Type
                    </label>

                    <select
                      value={visitType}
                      onChange={(e) =>
                        setVisitType(e.target.value as VisitType)
                      }
                      className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.values(VisitType).map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 rounded-xl px-3 py-2">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-sm hover:bg-gray-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleCreate}
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-emerald-600 text-white! py-2.5 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition cursor-pointer"
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-emerald-700 mb-4">
                  Visit Created Successfully
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                  The visit has been created successfully.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-2xl border border-gray-200 py-2.5 text-sm hover:bg-gray-50 transition"
                  >
                    Close
                  </button>

                  <button
                    onClick={() =>
                      router.push(
                        `/dashboard/visits/${createdVisitId}`
                      )
                    }
                    className="flex-1 rounded-2xl bg-emerald-600 text-white! py-2.5 text-sm font-medium hover:bg-emerald-700 transition"
                  >
                    Proceed to Visit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
