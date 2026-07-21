const STATUS_STYLES: Record<string, string> = {
  // VisitChargeStatus
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  BILLED: 'bg-blue-50 text-blue-700 border-blue-200',
  WAIVED: 'bg-slate-100 text-slate-600 border-slate-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',

  // AdjustmentStatus
  UNREQUESTED: 'bg-slate-100 text-slate-500 border-slate-200',
  REQUESTED: 'bg-amber-50 text-amber-700 border-amber-200',
  APPROVED: 'bg-blue-50 text-blue-700 border-blue-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
  APPLIED: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  // VisitInvoiceStatus
  DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
  ISSUED: 'bg-blue-50 text-blue-700 border-blue-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PARTIALLY_PAID: 'bg-orange-50 text-orange-700 border-orange-200',

  // PaymentStatus
  SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  REFUNDED: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function StatusBadge({ status }: { status: string }) {
  const style =
    STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${style}`}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}