'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clientFetch } from '@/lib/clientFetch';
import { LabRequestStatus } from '@/shared/graphql/generated/graphql';

type FeedbackState = {
  type: 'success' | 'error' | null;
  message: string | null;
};

export default function StartLabRequestAction({
  labRequestId,
  status,
}: {
  labRequestId: string;
  status: LabRequestStatus;
}) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
    type: null,
    message: null,
  });

  const [currentStatus, setCurrentStatus] = useState(status);

  const router = useRouter();

  const isStartable = currentStatus === LabRequestStatus.Pending;

  useEffect(() => {
    setCurrentStatus(status);
  }, [status]);

  const clearFeedbackLater = () => {
    setTimeout(() => {
      setFeedback({ type: null, message: null });
    }, 4000);
  };

  const handleStart = async () => {
    try {
      setLoading(true);
      setFeedback({ type: null, message: null });

      const res = await clientFetch('/api/lab-request/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ labRequestId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to start lab request');
      }

      setCurrentStatus(LabRequestStatus.InProgress);

      setFeedback({
        type: 'success',
        message: 'Lab request successfully started.',
      });

      router.refresh();
      clearFeedbackLater();
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error
            ? err.message
            : 'Something went wrong while starting the request.',
      });

      clearFeedbackLater();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Start Lab Request
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Move this request into processing. Only pending requests can be started.
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!isStartable || loading}
          className={`
            w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer
            ${
              isStartable
                ? 'bg-green-600 !text-white hover:bg-green-700'
                : 'bg-gray-200 !text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {loading ? 'Starting...' : 'Start Request'}
        </button>
      </div>

      {feedback.message && (
        <div
          className={`
            rounded-xl px-4 py-3 text-sm font-medium border
            ${
              feedback.type === 'success'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }
          `}
        >
          {feedback.message}
        </div>
      )}
    </div>
  );
}