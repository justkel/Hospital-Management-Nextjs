'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CircleCheck,
  TriangleAlert,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { clientFetch } from '@/lib/clientFetch';
import { VisitStatus } from '@/shared/graphql/generated/graphql';
import { HasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

interface Props {
  visitId: string;
  status?: VisitStatus | null;
}

interface ValidationRequirement {
  name: string;
  met: boolean;
  message?: string;
  details?: string;
}

interface ValidationResult {
  canClose: boolean;
  requirements: ValidationRequirement[];
  summary?: string;
  blockingReasons?: string[];
}

type ModalMode = 'close' | 'reopen';

export default function VisitStatusButton({ visitId, status }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [mode, setMode] = useState<ModalMode>('close');

  const isClosed = status === VisitStatus.Closed;
  const isOpen = status === VisitStatus.Open;
  const isAdmitted = status === VisitStatus.Admitted;
  const isCancelled = status === VisitStatus.Cancelled;

  const canBeClosed = isOpen || isAdmitted;

  const canClose = validationResult?.canClose ?? true;

  const resetModal = () => {
    setOpen(false);
    setError(null);
    setValidationResult(null);
    setSubmitting(false);
  };

  const handleClose = async () => {
    setSubmitting(true);
    setError(null);
    setValidationResult(null);

    try {
      const res = await clientFetch('/api/visit/close', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.validation) {
          setValidationResult(json.validation);
          throw new Error(json.validation.summary || 'Visit cannot be closed');
        }
        throw new Error(json.error || 'Failed to close visit');
      }

      resetModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReopen = async () => {
    setSubmitting(true);
    setError(null);
    setValidationResult(null);

    try {
      const res = await clientFetch('/api/visit/reopen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Failed to reopen visit');
      }

      resetModal();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenClose = () => {
    setMode('close');
    setOpen(true);
    setError(null);
    setValidationResult(null);
  };

  const handleOpenReopen = () => {
    setMode('reopen');
    setOpen(true);
    setError(null);
    setValidationResult(null);
  };

  const handleConfirm = () => {
    if (mode === 'close') {
      handleClose();
    } else {
      handleReopen();
    }
  };

  if (isCancelled) {
    return null;
  }

  if (isClosed) {
    return (
      <HasRoles roles={[Roles.ADMIN]}>
        <>
          <button
            type="button"
            onClick={handleOpenReopen}
            className="inline-flex h-[38px] items-center gap-2.5 rounded-[9px] border border-[#E8E6E0] bg-white px-4 text-[13px] font-medium text-[#2C2C2A] transition hover:border-[#1D9E75]/40 hover:bg-[#F0FAF5] hover:text-[#1D9E75]"
          >
            <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#F0FAF5] text-[#1D9E75]">
              <RefreshCw size={13} />
            </div>
            Reopen visit
          </button>

          {open && mode === 'reopen' && (
            <div
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 backdrop-blur-[2px] sm:items-center sm:pb-0"
              onClick={() => !submitting && resetModal()}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="reopen-visit-title"
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-[#E8E6E0] bg-white p-6 shadow-xl duration-150"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0FAF5] text-[#1D9E75]">
                    <RefreshCw size={20} />
                  </div>
                  <button
                    type="button"
                    onClick={() => !submitting && resetModal()}
                    className="rounded-full p-1.5 text-[#B4B2A9] transition hover:bg-[#F5F4F1] hover:text-[#2C2C2A]"
                    aria-label="Close dialog"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h2
                  id="reopen-visit-title"
                  className="mt-4 text-[16px] font-semibold text-[#2C2C2A]"
                >
                  Reopen this visit?
                </h2>
                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B6960]">
                  This will reopen the visit and allow edits to vitals, complaints,
                  diagnoses, prescriptions and charges. The visit will become active again.
                </p>

                {error && (
                  <div className="mt-4 rounded-[9px] border border-[#F0D3D3] bg-[#FBF2F1] px-3.5 py-2.5 text-[12.5px] text-[#B3413E]">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => resetModal()}
                    className="inline-flex h-[38px] items-center justify-center rounded-[9px] border border-[#E8E6E0] bg-white px-4 text-[13px] font-medium text-[#2C2C2A] transition hover:bg-[#F5F4F1] disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleConfirm}
                    className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[9px] bg-[#1D9E75] px-4 text-[13px] font-medium !text-white transition hover:bg-[#16835E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    {submitting ? 'Reopening…' : 'Yes, reopen visit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      </HasRoles>
    );
  }

  if (canBeClosed) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpenClose}
          className="inline-flex h-[38px] items-center gap-2.5 rounded-[9px] border border-[#F0D3D3] bg-white px-4 text-[13px] font-medium text-[#B3413E] transition hover:border-[#B3413E]/40 hover:bg-[#FBF2F1]"
        >
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-[6px] bg-[#FBF2F1] text-[#B3413E]">
            <CircleCheck size={13} />
          </div>
          Close visit
        </button>

        {open && mode === 'close' && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-4 backdrop-blur-[2px] sm:items-center sm:pb-0"
            onClick={() => !submitting && resetModal()}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="close-visit-title"
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-2xl border border-[#E8E6E0] bg-white p-6 shadow-xl duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FBF2F1] text-[#B3413E]">
                  <TriangleAlert size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => !submitting && resetModal()}
                  className="rounded-full p-1.5 text-[#B4B2A9] transition hover:bg-[#F5F4F1] hover:text-[#2C2C2A]"
                  aria-label="Close dialog"
                >
                  <X size={16} />
                </button>
              </div>

              <h2
                id="close-visit-title"
                className="mt-4 text-[16px] font-semibold text-[#2C2C2A]"
              >
                Close this visit?
              </h2>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B6960]">
                This will mark the visit as closed. Vitals, complaints,
                diagnoses, prescriptions and charges tied to this visit will no
                longer be editable. This action cannot be undone.
              </p>

              {validationResult && !validationResult.canClose && (
                <div className="mt-4 space-y-2">
                  <div className="rounded-[9px] border border-[#F0D3D3] bg-[#FBF2F1] px-3.5 py-2.5">
                    <p className="text-[12.5px] font-medium text-[#B3413E]">
                      Cannot close visit - requirements not met:
                    </p>
                    <ul className="mt-1.5 space-y-1 text-[12.5px] text-[#6B6960]">
                      {validationResult.requirements
                        .filter((req) => !req.met)
                        .map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-[#B3413E]">•</span>
                            <span>
                              <strong>{req.name}</strong>
                              {req.details && (
                                <span className="block text-[#8A8880] text-[11.5px]">
                                  {req.details}
                                </span>
                              )}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}

              {error && !validationResult && (
                <div className="mt-4 rounded-[9px] border border-[#F0D3D3] bg-[#FBF2F1] px-3.5 py-2.5 text-[12.5px] text-[#B3413E]">
                  {error}
                </div>
              )}

              {validationResult?.canClose && (
                <div className="mt-4 rounded-[9px] border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] text-emerald-700">
                  ✓ All requirements met. Visit can be closed.
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => resetModal()}
                  className="inline-flex h-[38px] items-center justify-center rounded-[9px] border border-[#E8E6E0] bg-white px-4 text-[13px] font-medium text-[#2C2C2A] transition hover:bg-[#F5F4F1] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting || !canClose}
                  onClick={handleConfirm}
                  className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[9px] bg-[#B3413E] px-4 text-[13px] font-medium !text-white transition hover:bg-[#9A3532] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? 'Closing…' : 'Yes, close visit'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}