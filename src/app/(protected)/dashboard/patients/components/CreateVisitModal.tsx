'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VisitType } from '@/shared/graphql/generated/graphql';
import { clientFetch } from '@/lib/clientFetch';
import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ClipboardDocumentCheckIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';

interface Props {
  patientId: string;
}

interface VisitOutstandingBalance {
  visitId: string;
  visitDate: string;
  visitType?: string;
  outstandingBalance: number;
  totalCharges: number;
  totalPaid: number;
  totalAdjustments?: number;
  status: string;
}

interface PatientOutstandingBalance {
  patientId: string;
  patientName: string;
  patientUserCode?: number;
  totalOutstandingBalance: number;
  totalChargesAcrossAllVisits: number;
  totalPaidAcrossAllVisits: number;
  visitOutstandings: VisitOutstandingBalance[];
}

interface CreateVisitResponse {
  visit: {
    id: string;
    status: string;
    visitType: string;
    visitDateTime: string;
  };
  patientOutstandingBalance: PatientOutstandingBalance;
}

export default function CreateVisitModal({ patientId }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [visitType, setVisitType] = useState<VisitType>(VisitType.Opd);
  const [loading, setLoading] = useState(false);
  const [createdVisitId, setCreatedVisitId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outstandingBalance, setOutstandingBalance] =
    useState<PatientOutstandingBalance | null>(null);

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

      const data = json as CreateVisitResponse;
      setCreatedVisitId(data.visit.id);
      setOutstandingBalance(data.patientOutstandingBalance);
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
    setOutstandingBalance(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLastVisit = () => {
    if (!outstandingBalance) return null;

    if (outstandingBalance.visitOutstandings.length < 2) return null;
    return outstandingBalance.visitOutstandings[1];
  };

  const lastVisit = getLastVisit();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white! font-medium shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center gap-2"
      >
        <ClipboardDocumentCheckIcon className="w-5 h-5" />
        Create Visit
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl">
                  <ClipboardDocumentCheckIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {!createdVisitId ? 'Create New Visit' : 'Visit Created!'}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {!createdVisitId ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visit Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.values(VisitType).map((type) => (
                        <button
                          key={type}
                          onClick={() => setVisitType(type)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${visitType === type
                              ? 'bg-emerald-600 text-white! shadow-md shadow-emerald-200 scale-[1.02]'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                          {type.replace(/_/g, ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={closeModal}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreate}
                      disabled={loading}
                      className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white! py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Creating...
                        </>
                      ) : (
                        'Create Visit'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 pb-2">
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex-shrink-0">
                    <CheckCircleIcon className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">
                        Visit created successfully!
                      </p>
                      <p className="text-xs text-emerald-600">
                        {outstandingBalance?.patientName}&apos;s visit has been created.
                      </p>
                    </div>
                  </div>

                  {outstandingBalance && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="w-5 h-5 text-gray-600" />
                        <h3 className="text-sm font-semibold text-gray-700">
                          Financial Summary
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                          <p className="text-xs text-amber-600 font-medium uppercase tracking-wider">
                            Total Outstanding
                          </p>
                          <p className="text-2xl font-bold text-amber-700 mt-1">
                            {formatCurrency(
                              outstandingBalance.totalOutstandingBalance
                            )}
                          </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200">
                          <p className="text-xs text-emerald-600 font-medium uppercase tracking-wider">
                            Total Paid
                          </p>
                          <p className="text-2xl font-bold text-emerald-700 mt-1">
                            {formatCurrency(
                              outstandingBalance.totalPaidAcrossAllVisits
                            )}
                          </p>
                        </div>
                      </div>

                      {lastVisit && (
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-700">
                              Last Visit
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(lastVisit.visitDate)}
                            </span>
                          </div>

                          <div
                            className={`p-4 rounded-xl border transition-all duration-200 ${lastVisit.outstandingBalance > 0
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-gray-50/50 border-gray-200'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm font-medium text-gray-800">
                                    {lastVisit.visitType || 'Visit'}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${lastVisit.status === 'OPEN'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : lastVisit.status === 'CLOSED'
                                          ? 'bg-gray-100 text-gray-600'
                                          : 'bg-yellow-100 text-yellow-700'
                                      }`}
                                  >
                                    {lastVisit.status}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span>
                                    Paid: {formatCurrency(lastVisit.totalPaid)}
                                  </span>
                                  {lastVisit.totalAdjustments !== undefined &&
                                    lastVisit.totalAdjustments > 0 && (
                                      <>
                                        <span>·</span>
                                        <span>
                                          Adjustments:{' '}
                                          {formatCurrency(
                                            lastVisit.totalAdjustments
                                          )}
                                        </span>
                                      </>
                                    )}
                                </div>
                              </div>
                              <div className="ml-3 flex-shrink-0">
                                {lastVisit.outstandingBalance > 0 ? (
                                  <div className="text-right">
                                    <p className="text-xs text-amber-600 font-medium">
                                      Outstanding
                                    </p>
                                    <p className="text-sm font-bold text-amber-700">
                                      {formatCurrency(
                                        lastVisit.outstandingBalance
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-emerald-600">
                                    <CheckCircleIcon className="w-4 h-4" />
                                    <span className="text-xs font-medium">
                                      Paid
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {createdVisitId && (
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() =>
                      router.push(`/dashboard/visits/${createdVisitId}`)
                    }
                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white! py-2.5 text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 group"
                  >
                    <span>Proceed to Visit</span>
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}