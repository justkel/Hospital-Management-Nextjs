'use client';

type RequestFeedbackProps = {
  previousRequests?: any[];
  error?: string | null;
  success?: string | null;
};

export default function RequestFeedback({
  previousRequests = [],
  error,
  success,
}: RequestFeedbackProps) {
  return (
    <>
      {previousRequests.length > 0 && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 animate-fade-in">
          <p className="text-sm font-semibold text-blue-800">
            Similar tests were previously requested
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Older requests were found for this visit, but a new request was created.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <span className="text-red-600 text-sm">✕</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-red-800">
                Request Failed
              </p>
              <p className="text-sm text-red-700 mt-1 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-4 shadow-sm animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <span className="text-green-600 text-sm">✓</span>
            </div>

            <div>
              <p className="text-sm font-semibold text-green-800">
                Success
              </p>
              <p className="text-sm text-green-700 mt-1 leading-relaxed">
                {success}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}