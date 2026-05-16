'use client';

import { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { useRouter } from 'next/navigation';

import {
  AlertTriangle,
  Loader2,
  ShieldAlert,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';

type Props = {
  open: boolean;
  onClose: () => void;
  procedureId: string;
};

type FeedbackState = {
  type: 'success' | 'error' | null;
  message: string | null;
};

export default function CancelVisitProcedureModal({
  open,
  onClose,
  procedureId,
}: Props) {
  const router = useRouter();

  const [reason, setReason] =
    useState('');

  const [step, setStep] = useState<
    'reason' | 'confirm'
  >('reason');

  const [loading, setLoading] =
    useState(false);

  const [feedback, setFeedback] =
    useState<FeedbackState>({
      type: null,
      message: null,
    });

  useEffect(() => {
    if (!open) {
      setReason('');
      setStep('reason');
      setLoading(false);

      setFeedback({
        type: null,
        message: null,
      });
    }
  }, [open]);

  const handleContinue = () => {
    if (!reason.trim()) {
      setFeedback({
        type: 'error',
        message:
          'Cancellation reason is required.',
      });

      return;
    }

    setFeedback({
      type: null,
      message: null,
    });

    setStep('confirm');
  };

  const handleCancelProcedure =
    async () => {
      try {
        setLoading(true);

        setFeedback({
          type: null,
          message: null,
        });

        const res = await clientFetch(
          '/api/visit-procedure/cancel',
          {
            method: 'PUT',
            headers: {
              'Content-Type':
                'application/json',
            },
            body: JSON.stringify({
              procedureId,
              cancellationReason:
                reason.trim(),
            }),
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.error ||
              'Failed to cancel procedure'
          );
        }

        setFeedback({
          type: 'success',
          message:
            'Procedure cancelled successfully.',
        });

        setTimeout(() => {
          onClose();

          router.refresh();
        }, 900);
      } catch (err) {
        setFeedback({
          type: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'Something went wrong.',
        });
      } finally {
        setLoading(false);
      }
    };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      destroyOnHidden
      onCancel={() => {
        if (!loading) {
          onClose();
        }
      }}
      width={560}
      className="[&_.ant-modal-content]:rounded-[2rem] [&_.ant-modal-content]:p-0 overflow-hidden"
    >
      <div className="relative overflow-hidden">

        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-orange-500 p-6 sm:p-7 text-white">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Cancel Procedure
              </h2>

              <p className="mt-2 text-sm text-red-50/90 leading-relaxed">
                This action permanently cancels
                the procedure and cannot be
                reversed.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-7">

          {step === 'reason' && (
            <>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />

                  <div>
                    <h3 className="font-bold text-amber-900">
                      Cancellation Reason Required
                    </h3>

                    <p className="mt-1 text-sm text-amber-700">
                      Please provide a clear
                      explanation for why this
                      procedure is being
                      cancelled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">
                  Cancellation Reason
                </label>

                <Input.TextArea
                  value={reason}
                  onChange={e =>
                    setReason(e.target.value)
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Enter cancellation reason..."
                  className="!rounded-2xl !py-3"
                />

                <div className="text-right text-xs text-slate-400">
                  {reason.length}/500
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="
                    h-12 px-5 rounded-2xl
                    border border-slate-200
                    bg-white
                    text-slate-700
                    font-semibold
                    transition-all
                    hover:bg-slate-50
                  "
                >
                  Close
                </button>

                <button
                  onClick={handleContinue}
                  disabled={!reason.trim()}
                  className="
                    h-12 px-5 rounded-2xl
                    bg-gradient-to-r from-red-600 to-rose-600
                    !text-white
                    font-bold
                    shadow-lg shadow-red-600/20
                    transition-all
                    hover:scale-[1.01]
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                  "
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <div className="flex gap-3">
                  <XCircle className="mt-0.5 h-6 w-6 text-red-600" />

                  <div>
                    <h3 className="font-black text-red-900">
                      Final Confirmation
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-red-700">
                      You are about to cancel
                      this procedure.
                    </p>

                    <p className="mt-2 text-sm leading-relaxed text-red-700">
                      This operation cannot be
                      undone after confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Cancellation Reason
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                  {reason}
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() =>
                    setStep('reason')
                  }
                  disabled={loading}
                  className="
                    h-12 px-5 rounded-2xl
                    border border-slate-200
                    bg-white
                    text-slate-700
                    font-semibold
                    transition-all
                    hover:bg-slate-50
                  "
                >
                  Go Back
                </button>

                <button
                  onClick={
                    handleCancelProcedure
                  }
                  disabled={loading}
                  className="
                    inline-flex items-center justify-center gap-2
                    h-12 px-5 rounded-2xl
                    bg-gradient-to-r from-red-600 to-rose-600
                    !text-white
                    font-bold
                    shadow-lg shadow-red-600/20
                    transition-all
                    hover:scale-[1.01]
                  "
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {loading
                    ? 'Cancelling...'
                    : 'Yes, Cancel Procedure'}
                </button>
              </div>
            </>
          )}

          {feedback.message && (
            <div
              className={`
                rounded-2xl border px-4 py-3 text-sm font-medium
                ${
                  feedback.type ===
                  'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700'
                }
              `}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}