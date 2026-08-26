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

  const [reason, setReason] = useState('');
  const [step, setStep] = useState<'reason' | 'confirm'>('reason');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>({
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
        message: 'Cancellation reason is required.',
      });
      return;
    }

    setFeedback({
      type: null,
      message: null,
    });

    setStep('confirm');
  };

  const handleCancelProcedure = async () => {
    try {
      setLoading(true);
      setFeedback({
        type: null,
        message: null,
      });

      const res = await clientFetch('/api/visit-procedure/cancel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procedureId,
          cancellationReason: reason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to cancel procedure');
      }

      setFeedback({
        type: 'success',
        message: 'Procedure cancelled successfully.',
      });

      setTimeout(() => {
        onClose();
        router.refresh();
      }, 900);
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong.',
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
      className="[&_.ant-modal-content]:rounded-2xl [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:!bg-[#FAFAF8] overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <div className="!bg-[#FEF2F2] border-b !border-[#FBD5D5] p-6 sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl !bg-[#FEF2F2] !border !border-[#FBD5D5]">
              <AlertTriangle className="h-6 w-6 !text-[#DC2626]" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight !text-[#16211B] sm:text-2xl">
                Cancel Procedure
              </h2>
              <p className="mt-1 text-sm !text-[#767570] leading-relaxed">
                This action permanently cancels the procedure and cannot be reversed.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-7">
          {step === 'reason' && (
            <>
              <div className="rounded-xl border !border-[#F5E3C0] !bg-[#FFF8EC] p-4">
                <div className="flex gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 !text-[#B9770E]" />
                  <div>
                    <h3 className="text-sm font-semibold !text-[#B9770E]">
                      Cancellation Reason Required
                    </h3>
                    <p className="mt-1 text-sm !text-[#B9770E]/80">
                      Please provide a clear explanation for why this procedure is being cancelled.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Cancellation Reason
                </label>
                <Input.TextArea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  rows={5}
                  maxLength={500}
                  placeholder="Enter cancellation reason..."
                  className="!rounded-xl !border-[#E8E6E0] !bg-white !py-2.5 !px-3.5 !text-sm !text-[#16211B] placeholder:!text-[#D3D1C7] focus:!border-[#1D9E75] focus:!ring-2 focus:!ring-[#1D9E75]/20"
                />
                <div className="text-right text-xs !text-[#B4B2A9]">
                  {reason.length}/500
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  onClick={handleContinue}
                  disabled={!reason.trim()}
                  className="h-10 w-full sm:w-auto rounded-xl !bg-[#DC2626] px-5 text-xs font-semibold !text-white transition hover:!bg-[#C11F1F] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 'confirm' && (
            <>
              <div className="rounded-xl border !border-[#FBD5D5] !bg-[#FEF2F2] p-4">
                <div className="flex gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 !text-[#DC2626]" />
                  <div>
                    <h3 className="text-sm font-semibold !text-[#DC2626]">
                      Final Confirmation
                    </h3>
                    <p className="mt-1 text-sm !text-[#DC2626]/80">
                      You are about to cancel this procedure.
                    </p>
                    <p className="mt-1 text-sm !text-[#DC2626]/80">
                      This operation cannot be undone after confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border !border-[#E8E6E0] !bg-[#FAFAF8] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] !text-[#B4B2A9]">
                  Cancellation Reason
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm !text-[#16211B]">
                  {reason}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setStep('reason')}
                  disabled={loading}
                  className="h-10 w-full sm:w-auto rounded-xl border !border-[#E8E6E0] !bg-white px-5 text-xs font-semibold !text-[#5F5E5A] transition hover:!bg-[#F7F7F5] disabled:opacity-40"
                >
                  Go Back
                </button>

                <button
                  onClick={handleCancelProcedure}
                  disabled={loading}
                  className="inline-flex h-10 w-full sm:w-auto items-center justify-center gap-2 rounded-xl !bg-[#DC2626] px-5 text-xs font-semibold !text-white transition hover:!bg-[#C11F1F] disabled:opacity-50"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Cancelling...' : 'Yes, Cancel Procedure'}
                </button>
              </div>
            </>
          )}

          {feedback.message && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                feedback.type === 'success'
                  ? '!border-[#CFF0E1] !bg-[#ECFBF5] !text-[#1D9E75]'
                  : '!border-[#FBD5D5] !bg-[#FEF2F2] !text-[#DC2626]'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}