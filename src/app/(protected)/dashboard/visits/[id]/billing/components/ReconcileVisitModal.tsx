'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Loader2,
  CircleDollarSign,
  RefreshCcw,
} from 'lucide-react';

import {
  CanReconcileVisitQuery,
  ReconcileVisitMutation,
} from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export type CanReconcileResult = CanReconcileVisitQuery['canReconcileVisit'];
export type ReconciledVisitResult = ReconcileVisitMutation['reconcileVisit'];

interface ReconcileVisitModalProps {
  visitId: string;
  open: boolean;
  onClose: () => void;
  onReconciled: (visit: ReconciledVisitResult) => void;
}

export default function ReconcileVisitModal({
  visitId,
  open,
  onClose,
  onReconciled,
}: ReconcileVisitModalProps) {
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<CanReconcileResult | null>(
    null
  );

  const [reconciling, setReconciling] = useState(false);
  const [reconcileError, setReconcileError] = useState<string | null>(null);
  const [reconciled, setReconciled] = useState<ReconciledVisitResult | null>(
    null
  );

  const runCheck = useCallback(async () => {
    setChecking(true);
    setCheckError(null);
    setCheckResult(null);
    try {
      const res = await clientFetch(
        `/api/visit/reconcile/check?visitId=${encodeURIComponent(visitId)}`
      );
      const json = await res.json();

      if (!res.ok) {
        setCheckError(json?.error || 'Failed to check reconciliation eligibility');
        return;
      }

      setCheckResult(json.result as CanReconcileResult);
    } catch {
      setCheckError('Something went wrong while checking this visit');
    } finally {
      setChecking(false);
    }
  }, [visitId]);

  useEffect(() => {
    if (open) {
      setReconciled(null);
      setReconcileError(null);
      runCheck();
    }
  }, [open, runCheck]);

  const handleConfirm = async () => {
    setReconciling(true);
    setReconcileError(null);
    try {
      const res = await clientFetch('/api/visit/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitId }),
      });
      const json = await res.json();

      if (!res.ok) {
        setReconcileError(json?.error || 'Failed to reconcile visit');
        return;
      }

      const visit = json.visit as ReconciledVisitResult;
      setReconciled(visit);
      onReconciled(visit);
    } catch {
      setReconcileError('Something went wrong while reconciling this visit');
    } finally {
      setReconciling(false);
    }
  };

  if (!open) return null;

  const outstandingBalance = checkResult?.outstandingBalance ?? 0;
  const hasOutstanding = outstandingBalance > 0.01;
  const canCloseVisit = checkResult?.canClose ?? false;
  const canReconcile = checkResult?.canReconcile ?? false;
  const blockingReasons = checkResult?.blockingReasons ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 !bg-slate-900/50 backdrop-blur-sm"
        onClick={reconciling ? undefined : onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl !bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b !border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl !bg-slate-900 !text-white">
              <RefreshCcw size={16} />
            </div>
            <h2 className="text-base font-semibold !text-slate-900 sm:text-lg">
              Reconcile visit
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={reconciling}
            className="rounded-lg p-1.5 !text-slate-400 transition hover:!bg-slate-100 hover:!text-slate-600 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6">
          {reconciled ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full !bg-emerald-50 !text-emerald-600">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-sm font-bold !text-slate-900">
                  Visit reconciled successfully
                </p>
                <p className="mt-1 text-xs !text-slate-500">
                  {reconciled.patient?.fullName
                    ? `${reconciled.patient.fullName}'s visit`
                    : 'This visit'}{' '}
                  has been marked as reconciled.
                </p>
              </div>
            </div>
          ) : checking ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Loader2 size={26} className="animate-spin !text-slate-400" />
              <p className="text-sm font-medium !text-slate-500">
                Checking reconciliation eligibility…
              </p>
            </div>
          ) : checkError ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full !bg-red-50 !text-red-600">
                <XCircle size={24} />
              </div>
              <p className="text-sm font-semibold !text-slate-900">
                {checkError}
              </p>
              <button
                type="button"
                onClick={runCheck}
                className="mt-1 rounded-lg border !border-slate-200 px-3 py-1.5 text-xs font-bold !text-slate-600 transition hover:!bg-slate-50"
              >
                Try again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm !text-slate-500">
                Reconciling this visit will close billing permanently. This
                cannot be easily undone.
              </p>

              <div className="rounded-xl !bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold !text-slate-500">
                    <CircleDollarSign size={14} />
                    Outstanding balance
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      hasOutstanding ? '!text-red-600' : '!text-emerald-600'
                    }`}
                  >
                    {formatCurrency(outstandingBalance)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div
                  className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 ${
                    hasOutstanding
                      ? '!border-red-200 !bg-red-50'
                      : '!border-emerald-200 !bg-emerald-50'
                  }`}
                >
                  {hasOutstanding ? (
                    <XCircle size={16} className="mt-0.5 shrink-0 !text-red-600" />
                  ) : (
                    <ShieldCheck
                      size={16}
                      className="mt-0.5 shrink-0 !text-emerald-600"
                    />
                  )}
                  <p
                    className={`text-xs font-medium ${
                      hasOutstanding ? '!text-red-700' : '!text-emerald-700'
                    }`}
                  >
                    {hasOutstanding
                      ? 'Visit must be fully paid before it can be reconciled.'
                      : 'Visit is fully paid.'}
                  </p>
                </div>

                <div
                  className={`rounded-xl border px-3.5 py-3 ${
                    canCloseVisit
                      ? '!border-emerald-200 !bg-emerald-50'
                      : '!border-red-200 !bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {canCloseVisit ? (
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 !text-emerald-600"
                      />
                    ) : (
                      <XCircle
                        size={16}
                        className="mt-0.5 shrink-0 !text-red-600"
                      />
                    )}
                    <p
                      className={`text-xs font-medium ${
                        canCloseVisit ? '!text-emerald-700' : '!text-red-700'
                      }`}
                    >
                      {canCloseVisit
                        ? 'Visit closure requirements are met.'
                        : blockingReasons.length > 0
                        ? 'Visit cannot be closed. The following need to be resolved first:'
                        : 'Visit cannot be closed. Resolve blocking issues first.'}
                    </p>
                  </div>

                  {!canCloseVisit &&
                    blockingReasons.length > 0 && (
                      <ul className="mt-2.5 space-y-1.5 pl-[26px]">
                        {blockingReasons.map((reason, i) => (
                          <li
                            key={i}
                            className="text-xs font-medium leading-relaxed !text-red-700"
                          >
                            {reason.replace(/^•\s*/, '')}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              </div>

              {checkResult?.message && (
                <div className="flex items-start gap-2.5 rounded-xl border !border-amber-200 !bg-amber-50 px-3.5 py-3">
                  <AlertTriangle
                    size={16}
                    className="mt-0.5 shrink-0 !text-amber-600"
                  />
                  <p className="text-xs font-medium !text-amber-700">
                    {checkResult.message}
                  </p>
                </div>
              )}

              {reconcileError && (
                <div className="flex items-start gap-2.5 rounded-xl border !border-red-200 !bg-red-50 px-3.5 py-3">
                  <XCircle size={16} className="mt-0.5 shrink-0 !text-red-600" />
                  <p className="text-xs font-medium !text-red-700">
                    {reconcileError}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {!checking && !checkError && (
          <div className="flex flex-col-reverse gap-2.5 border-t !border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={reconciling}
              className="rounded-xl border !border-slate-200 px-4 py-2.5 text-sm font-bold !text-slate-600 transition hover:!bg-slate-50 disabled:opacity-50"
            >
              {reconciled ? 'Close' : 'Cancel'}
            </button>

            {!reconciled && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canReconcile || reconciling}
                className="inline-flex items-center justify-center gap-2 rounded-xl !bg-slate-900 px-4 py-2.5 text-sm font-bold !text-white transition hover:!bg-slate-800 disabled:cursor-not-allowed disabled:!bg-slate-300"
              >
                {reconciling ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Reconciling…
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Confirm reconciliation
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}