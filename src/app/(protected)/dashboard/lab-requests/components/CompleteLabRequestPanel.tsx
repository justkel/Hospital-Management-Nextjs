'use client';

import { useState } from 'react';
import { clientFetch } from '@/lib/clientFetch';
import { CheckCircleFilled } from '@ant-design/icons';

type Props = {
    labRequestId: string;
    onCompleted?: () => void;
};

export default function CompleteLabRequestPanel({
    labRequestId,
    onCompleted,
}: Props) {
    const [showModal, setShowModal] = useState(false);
    const [completing, setCompleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const completeLabRequest = async () => {
        try {
            setCompleting(true);
            setError(null);

            const res = await clientFetch('/api/lab-request/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ labRequestId }),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Failed to complete request');
            }

            setShowModal(false);
            onCompleted?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Completion failed');
        } finally {
            setCompleting(false);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-green-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-sm sm:text-base font-semibold text-green-800">
                        Lab Ready for Finalization
                    </h3>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                        All tests have been completed and verified. You can now finalize this request.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-600 !text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition cursor-pointer"
                >
                    <CheckCircleFilled className="text-white text-base" />
                    Complete Request
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-5 space-y-4 animate-in fade-in zoom-in duration-200">

                        <h2 className="text-lg font-bold text-slate-800">
                            Finalize Lab Request
                        </h2>

                        <p className="text-sm text-slate-600 leading-relaxed">
                            You are about to complete this lab request.
                            This action <span className="font-semibold text-red-600">cannot be reversed</span>.
                            Ensure all results have been reviewed for accuracy.
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs p-3 rounded-xl">
                            ⚠ After completion, all results will become read-only.
                        </div>

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-100 p-2 rounded-xl">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-50 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={completeLabRequest}
                                disabled={completing}
                                className="px-4 py-2 rounded-xl bg-red-600 !text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition cursor-pointer"
                            >
                                {completing ? 'Completing...' : 'Confirm Completion'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}