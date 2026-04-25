'use client';

import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

export default function DuplicateConfirmationModal({
  duplicates,
  onCancel,
  onConfirm,
}: any) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
            <ExclamationCircleOutlined className="text-xl text-amber-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Duplicate Request Detected
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              These tests were already requested within the last 24 hours.
            </p>
          </div>
        </div>

        <div className="p-6 max-h-72 overflow-y-auto space-y-3">
          {duplicates.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3"
            >
              <p className="font-medium text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-6 py-3 rounded-2xl bg-green-600 text-white hover:bg-green-700 shadow-md"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
}