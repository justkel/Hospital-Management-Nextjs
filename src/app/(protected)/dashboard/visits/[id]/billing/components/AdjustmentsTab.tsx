'use client';

import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Radio, Input, message } from 'antd';
import {
  CheckCircle2,
  FileText,
  Loader2,
  RotateCcw,
  ThumbsDown,
  ThumbsUp,
  XCircle,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from './StatusBadge';
import type { Adjustment, ChargeRow } from '../billing-client';
import { AdjustmentMethod, AdjustmentType } from '@/shared/graphql/generated/graphql';

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const TYPE_OPTIONS = [
  { value: 'DISCOUNT', label: 'Discount' },
  { value: 'WAIVER', label: 'Waiver' },
  { value: 'WRITE_OFF', label: 'Write-off' },
  { value: 'SURCHARGE', label: 'Surcharge' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CORRECTION', label: 'Correction' },
  { value: 'ADJUSTMENT_REVERSAL', label: 'Reversal (undo another adjustment)' },
];

interface FormState {
  appliedOn: 'INVOICE' | 'CHARGE';
  visitChargeId?: string;
  type: string;
  method: 'PERCENTAGE' | 'FLAT';
  value?: string;
  amount?: string;
  direction?: 'INCREASE' | 'DECREASE';
  reversesAdjustmentId?: string;
  reason: string;
  notes?: string;
}

const EMPTY_FORM: FormState = {
  appliedOn: 'INVOICE',
  type: 'DISCOUNT',
  method: 'FLAT',
  reason: '',
};

interface ChargeBalance {
  visitChargeId: string;
  totalAmount: number;
  effectiveTotal: number;
  amountPaid: number;
  remaining: number;
}

export default function AdjustmentsTab({
  visitId,
  adjustments,
  charges,
  onAdjustmentsChange,
}: {
  visitId: string;
  adjustments: Adjustment[];
  charges: ChargeRow[];
  onAdjustmentsChange: (adjustments: Adjustment[]) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [balances, setBalances] = useState<Record<string, ChargeBalance>>({});

  const refreshBalances = async () => {
    const res = await clientFetch(
      `/api/visit-charge/balances?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();

    if (res.ok && json.balances) {
      const map: Record<string, ChargeBalance> = {};
      for (const b of json.balances as ChargeBalance[]) {
        map[b.visitChargeId] = b;
      }
      setBalances(map);
    }
  };

  const refresh = async () => {
    const res = await clientFetch(
      `/api/billing-adjustment/list?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.adjustments) {
      onAdjustmentsChange(json.adjustments);
    }
  };

  useEffect(() => {
    refresh();
    refreshBalances();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const getRemaining = (chargeId: string, totalAmount: number): number => {
    const b = balances[chargeId];
    return b ? b.remaining : totalAmount;
  };

  const payableCharges = useMemo(
    () =>
      charges.filter(
        (c) => getRemaining(c.id, Number(c.totalAmount ?? 0)) > 0.01
      ),
    [charges, balances]
  );

  const reversibleAdjustments = useMemo(
    () =>
      adjustments.filter(
        (a) =>
          a.status === 'APPLIED' &&
          !adjustments.some((other) => other.reversesAdjustmentId === a.id)
      ),
    [adjustments]
  );

  const getChargeName = (visitChargeId?: string | null): string | null => {
    if (!visitChargeId) return null;
    return (
      charges.find((c) => c.id === visitChargeId)?.chargeName ??
      'Charge no longer available'
    );
  };

  const openRequestForm = () => {
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openReversalForm = (adjustmentId: string) => {
    setForm({
      ...EMPTY_FORM,
      type: 'ADJUSTMENT_REVERSAL',
      reversesAdjustmentId: adjustmentId,
    });
    setFormOpen(true);
  };

  const submitRequest = async () => {
    if (!form.reason.trim()) {
      message.error('A reason is required');
      return;
    }

    if (form.type === 'ADJUSTMENT_REVERSAL' && !form.reversesAdjustmentId) {
      message.error('Select which adjustment this reverses');
      return;
    }

    if (form.type === 'CORRECTION' && !form.direction) {
      message.error('Select a direction for the correction');
      return;
    }

    if (form.appliedOn === 'CHARGE' && !form.visitChargeId) {
      message.error('Select which charge this applies to');
      return;
    }

    const body: Record<string, unknown> = {
      visitId,
      appliedOn: form.appliedOn,
      type: form.type,
      reason: form.reason.trim(),
      notes: form.notes?.trim() || undefined,
      visitChargeId:
        form.appliedOn === 'CHARGE' ? form.visitChargeId : undefined,
    };

    if (form.type === AdjustmentType.AdjustmentReversal) {
      body.reversesAdjustmentId = form.reversesAdjustmentId;
      body.method = AdjustmentMethod.Flat;
    } else {
      body.method = form.method;

      if (form.method === AdjustmentMethod.Percentage) {
        body.value = Number(form.value);
      } else {
        body.amount = Number(form.amount);
      }

      if (form.type === AdjustmentType.Correction) {
        body.direction = form.direction;
      }
    }

    setSubmitting(true);

    try {
      const res = await clientFetch('/api/billing-adjustment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to request adjustment');
        return;
      }

      message.success('Adjustment requested');
      setFormOpen(false);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  };

  const runAction = async (
    adjustmentId: string,
    path: string,
    extra?: Record<string, unknown>
  ) => {
    setActionLoadingId(adjustmentId);

    try {
      const res = await clientFetch(`/api/billing-adjustment/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adjustmentId, ...extra }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || `Failed to ${path} adjustment`);
        return;
      }

      message.success('Done');
      await Promise.all([refresh(), refreshBalances()]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const submitReject = async () => {
    if (!rejectTarget) return;

    if (!rejectReason.trim()) {
      message.error('A reason is required to reject');
      return;
    }

    await runAction(rejectTarget, 'reject', { reason: rejectReason.trim() });
    setRejectTarget(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-5 py-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">
          {adjustments.length} adjustment{adjustments.length === 1 ? '' : 's'}
        </h3>

        <button
          type="button"
          onClick={openRequestForm}
          className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <FileText size={15} />
          Request adjustment
        </button>
      </div>

      {adjustments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-slate-50/60 px-6 py-16 text-center">
          <FileText size={32} className="text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-700">
            No adjustments yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Discounts, waivers, corrections, and reversals for this visit
            will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <div className="divide-y divide-slate-100">
            {adjustments.map((a) => {
              const alreadyReversed = adjustments.some(
                (other) => other.reversesAdjustmentId === a.id
              );

              const chargeName =
                a.appliedOn === 'CHARGE'
                  ? getChargeName(a.visitChargeId)
                  : null;

              return (
                <div key={a.id} className="px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-800">
                          {a.type.replace(/_/g, ' ')}
                        </span>
                        <StatusBadge status={a.status} />
                        {a.direction && (
                          <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold uppercase text-slate-500">
                            {a.direction}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600">
                        {a.method === 'FLAT'
                          ? formatCurrency(a.amount)
                          : `${a.value}%`}{' '}
                        · Applied on{' '}
                        {a.appliedOn === 'CHARGE' && chargeName
                          ? `charge: ${chargeName}`
                          : 'whole invoice'}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {a.reason}
                      </p>

                      {a.reversesAdjustment && (
                        <p className="mt-1 text-xs text-slate-400">
                          Reverses: {a.reversesAdjustment.type} ·{' '}
                          {a.reversesAdjustment.method === 'FLAT'
                            ? formatCurrency(a.reversesAdjustment.amount)
                            : `${a.reversesAdjustment.value}%`}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {a.status === 'REQUESTED' && (
                        <>
                          <button
                            type="button"
                            disabled={actionLoadingId === a.id}
                            onClick={() => runAction(a.id, 'approve')}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-60"
                          >
                            {actionLoadingId === a.id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <ThumbsUp size={13} />
                            )}
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={actionLoadingId === a.id}
                            onClick={() => setRejectTarget(a.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-60"
                          >
                            <ThumbsDown size={13} />
                            Reject
                          </button>
                        </>
                      )}

                      {a.status === 'APPROVED' && (
                        <button
                          type="button"
                          disabled={actionLoadingId === a.id}
                          onClick={() => runAction(a.id, 'apply')}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          {actionLoadingId === a.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Apply
                        </button>
                      )}

                      {a.status === 'APPLIED' && !alreadyReversed && (
                        <button
                          type="button"
                          onClick={() => openReversalForm(a.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                        >
                          <RotateCcw size={13} />
                          Reverse
                        </button>
                      )}

                      {a.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <XCircle size={13} />
                          Rejected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Modal
        title={
          form.type === AdjustmentType.AdjustmentReversal
            ? 'Reverse an adjustment'
            : 'Request billing adjustment'
        }
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={submitRequest}
        okText="Submit"
        confirmLoading={submitting}
      >
        <div className="space-y-4 py-2">
          {form.type !== AdjustmentType.AdjustmentReversal && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                  Type
                </label>
                <Select
                  className="w-full"
                  value={form.type}
                  onChange={(v) => setForm((f) => ({ ...f, type: v }))}
                  options={TYPE_OPTIONS}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                  Applied on
                </label>
                <Radio.Group
                  value={form.appliedOn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, appliedOn: e.target.value }))
                  }
                >
                  <Radio.Button value="INVOICE">Whole invoice</Radio.Button>
                  <Radio.Button value="CHARGE">Specific charge</Radio.Button>
                </Radio.Group>
              </div>

              {form.appliedOn === 'CHARGE' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                    Charge
                  </label>
                  <Select
                    className="w-full"
                    placeholder="Select a charge"
                    value={form.visitChargeId}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, visitChargeId: v }))
                    }
                    options={payableCharges.map((c) => ({
                      value: c.id,
                      label: `${c.chargeName} — ${formatCurrency(
                        getRemaining(c.id, Number(c.totalAmount ?? 0))
                      )} remaining`,
                    }))}
                    notFoundContent={
                      payableCharges.length === 0
                        ? 'All charges on this visit are fully paid'
                        : undefined
                    }
                  />
                </div>
              )}

              {form.type === AdjustmentType.Correction && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                    Direction
                  </label>
                  <Radio.Group
                    value={form.direction}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, direction: e.target.value }))
                    }
                  >
                    <Radio.Button value="INCREASE">Increase bill</Radio.Button>
                    <Radio.Button value="DECREASE">Decrease bill</Radio.Button>
                  </Radio.Group>
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                  Method
                </label>
                <Radio.Group
                  value={form.method}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, method: e.target.value }))
                  }
                >
                  <Radio.Button value="FLAT">Flat amount</Radio.Button>
                  <Radio.Button value="PERCENTAGE">Percentage</Radio.Button>
                </Radio.Group>
              </div>

              {form.method === AdjustmentMethod.Flat ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                    Amount
                  </label>
                  <Input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, amount: e.target.value }))
                    }
                  />
                </div>
              ) : (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                    Percentage
                  </label>
                  <Input
                    type="number"
                    suffix="%"
                    value={form.value}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, value: e.target.value }))
                    }
                  />
                </div>
              )}
            </>
          )}

          {form.type === AdjustmentType.AdjustmentReversal && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Adjustment to reverse
              </label>
              <Select
                className="w-full"
                placeholder="Select an applied adjustment"
                value={form.reversesAdjustmentId}
                onChange={(v) =>
                  setForm((f) => ({ ...f, reversesAdjustmentId: v }))
                }
                options={reversibleAdjustments.map((a) => ({
                  value: a.id,
                  label: `${a.type.replace(/_/g, ' ')} · ${
                    a.method === 'FLAT'
                      ? formatCurrency(a.amount)
                      : `${a.value}%`
                  } · ${a.reason}`,
                }))}
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Method, amount, and direction are derived automatically from
                the adjustment being reversed.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={form.reason}
              onChange={(e) =>
                setForm((f) => ({ ...f, reason: e.target.value }))
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        title="Reject adjustment"
        open={!!rejectTarget}
        onCancel={() => setRejectTarget(null)}
        onOk={submitReject}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}