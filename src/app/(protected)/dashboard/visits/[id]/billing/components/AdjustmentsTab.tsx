'use client';

import { useEffect, useMemo, useState } from 'react';
import { Modal, Select, Radio, Input, message } from 'antd';
import {
  AlertTriangle,
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
import { HasRoles, useHasRoles } from '@/components/auth/HasRoles';
import { Roles } from '@/shared/utils/enums/roles';

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
];

const REDUCING_TYPES = ['DISCOUNT', 'WAIVER', 'WRITE_OFF', 'INSURANCE'];

function wouldBeReducing(type: string, direction?: string): boolean {
  if (type === 'CORRECTION' || type === 'ADJUSTMENT_REVERSAL') {
    return direction === 'DECREASE';
  }
  return REDUCING_TYPES.includes(type);
}

interface FormState {
  appliedOn: 'CHARGE' | 'MULTIPLE_CHARGES';
  visitChargeId?: string;
  visitChargeIds?: string[];
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
  appliedOn: 'CHARGE',
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

interface CurrentTotals {
  outstandingBalance: number;
}

interface SettlementImpact {
  fullySettles: boolean;
  createsCredit: boolean;
  creditAmount: number;
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
  const hasAdmin = useHasRoles([Roles.ADMIN, Roles.DOCTOR]);

  const [rejectTarget, setRejectTarget] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [confirmApplyTarget, setConfirmApplyTarget] = useState<string | null>(null);
  const [confirmApplyImpact, setConfirmApplyImpact] = useState<SettlementImpact | null>(null);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const [balances, setBalances] = useState<Record<string, ChargeBalance>>({});
  const [currentTotals, setCurrentTotals] = useState<CurrentTotals | null>(null);

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

  const refreshCurrentTotals = async () => {
    const res = await clientFetch(
      `/api/visit-invoice/current-totals?visitId=${visitId}`,
      { cache: 'no-store' }
    );
    const json = await res.json();
    if (res.ok && json.totals) {
      setCurrentTotals(json.totals);
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
    refreshCurrentTotals();
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

  const selectedSingleCharge = useMemo(
    () => payableCharges.find((c) => c.id === form.visitChargeId),
    [payableCharges, form.visitChargeId]
  );

  const singleChargeRemaining = selectedSingleCharge
    ? getRemaining(selectedSingleCharge.id, Number(selectedSingleCharge.totalAmount ?? 0))
    : 0;

  const singleResolvedAmount = useMemo(() => {
    if (form.appliedOn !== 'CHARGE' || !selectedSingleCharge) {
      return 0;
    }

    const rawTotal = Number(selectedSingleCharge.totalAmount ?? 0);

    return form.method === AdjustmentMethod.Flat
      ? Number(form.amount || 0)
      : (Number(form.value || 0) / 100) * rawTotal;
  }, [form.appliedOn, form.method, form.amount, form.value, selectedSingleCharge]);

  const exceedsSingleChargeCeiling =
    form.appliedOn === 'CHARGE' &&
    !!selectedSingleCharge &&
    wouldBeReducing(form.type, form.direction) &&
    singleResolvedAmount > singleChargeRemaining + 0.01;

  const selectedMultiCharges = useMemo(
    () =>
      payableCharges.filter((c) => form.visitChargeIds?.includes(c.id)),
    [payableCharges, form.visitChargeIds]
  );

  const combinedRemaining = useMemo(
    () =>
      selectedMultiCharges.reduce(
        (sum, c) => sum + getRemaining(c.id, Number(c.totalAmount ?? 0)),
        0
      ),
    [selectedMultiCharges, balances]
  );

  const combinedRawTotal = useMemo(
    () =>
      selectedMultiCharges.reduce(
        (sum, c) => sum + Number(c.totalAmount ?? 0),
        0
      ),
    [selectedMultiCharges]
  );

  const previewResolvedTotal =
    combinedRawTotal > 0
      ? form.method === AdjustmentMethod.Flat
        ? Number(form.amount || 0)
        : (Number(form.value || 0) / 100) * combinedRawTotal
      : 0;

  const sharePreview = (charge: ChargeRow): number => {
    if (combinedRemaining <= 0) return 0;
    const chargeRemaining = getRemaining(charge.id, Number(charge.totalAmount ?? 0));
    return previewResolvedTotal * (chargeRemaining / combinedRemaining);
  };

  const exceedsMultiChargeCeiling =
    form.appliedOn === 'MULTIPLE_CHARGES' &&
    selectedMultiCharges.length > 0 &&
    wouldBeReducing(form.type, form.direction) &&
    previewResolvedTotal > combinedRemaining + 0.01;

  const exceedsVisitOutstandingCeiling = useMemo(() => {
    if (!currentTotals || !wouldBeReducing(form.type, form.direction)) {
      return false;
    }

    if (form.appliedOn === 'CHARGE') {
      return (
        !!selectedSingleCharge &&
        singleResolvedAmount > currentTotals.outstandingBalance + 0.01
      );
    }

    if (form.appliedOn === 'MULTIPLE_CHARGES') {
      return (
        selectedMultiCharges.length > 0 &&
        previewResolvedTotal > currentTotals.outstandingBalance + 0.01
      );
    }

    return false;
  }, [
    currentTotals,
    form.type,
    form.direction,
    form.appliedOn,
    selectedSingleCharge,
    singleResolvedAmount,
    selectedMultiCharges,
    previewResolvedTotal,
  ]);

  const ceilingExceeded =
    exceedsSingleChargeCeiling ||
    exceedsMultiChargeCeiling ||
    exceedsVisitOutstandingCeiling;

  const ceilingWarningText = (): string | null => {
    if (exceedsSingleChargeCeiling && selectedSingleCharge) {
      return `This would exceed the remaining balance of ${formatCurrency(
        singleChargeRemaining
      )} on "${selectedSingleCharge.chargeName}".`;
    }

    if (exceedsMultiChargeCeiling) {
      return (
        `This would exceed the combined remaining balance of ` +
        `${formatCurrency(combinedRemaining)} across the selected charges.`
      );
    }

    if (exceedsVisitOutstandingCeiling && currentTotals) {
      return (
        `This would exceed the visit's actual outstanding balance of ` +
        `${formatCurrency(currentTotals.outstandingBalance)}. The selected ` +
        `charge${form.appliedOn === 'MULTIPLE_CHARGES' ? 's show' : ' shows'
        } more remaining on its own, but existing credit elsewhere on this ` +
        `visit means less is genuinely still owed.`
      );
    }

    return null;
  };

  const reversibleAdjustments = useMemo(
    () =>
      adjustments.filter(
        (a) =>
          a.status === 'APPLIED' &&
          a.type !== 'ADJUSTMENT_REVERSAL' &&
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

  const getMultiChargeNames = (a: Adjustment): string[] => {
    const links = (a as { chargeLinks?: { visitCharge?: { chargeName?: string } }[] })
      .chargeLinks;
    if (!links || links.length === 0) return [];
    return links.map((l) => l.visitCharge?.chargeName ?? 'Unknown charge');
  };

  const resolveAdjustmentAmount = (a: Adjustment): number => {
    let baseAmount = 0;

    if (a.appliedOn === 'CHARGE') {
      const charge = charges.find((c) => c.id === a.visitChargeId);
      baseAmount = Number(charge?.totalAmount ?? 0);
    } else if (a.appliedOn === 'MULTIPLE_CHARGES') {
      const links = (a as { chargeLinks?: { visitCharge?: { totalAmount?: number } }[] })
        .chargeLinks ?? [];
      baseAmount = links.reduce(
        (sum, l) => sum + Number(l.visitCharge?.totalAmount ?? 0),
        0
      );
    }

    return a.method === 'FLAT'
      ? Number(a.amount ?? 0)
      : (Number(a.value ?? 0) / 100) * baseAmount;
  };

  const getSettlementImpact = (a: Adjustment): SettlementImpact | null => {
    if (!currentTotals) return null;

    const resolved = resolveAdjustmentAmount(a);
    const reducing = wouldBeReducing(a.type, a.direction ?? undefined);

    const resultingOutstanding = reducing
      ? currentTotals.outstandingBalance - resolved
      : currentTotals.outstandingBalance + resolved;

    const fullySettles =
      resultingOutstanding <= 0.01 && resultingOutstanding > -0.01;
    const createsCredit = resultingOutstanding < -0.01;

    if (!fullySettles && !createsCredit) return null;

    return {
      fullySettles,
      createsCredit,
      creditAmount: createsCredit ? Math.abs(resultingOutstanding) : 0,
    };
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

    if (
      form.type !== 'ADJUSTMENT_REVERSAL' &&
      form.appliedOn === 'CHARGE' &&
      !form.visitChargeId
    ) {
      message.error('Select which charge this applies to');
      return;
    }

    if (
      form.type !== 'ADJUSTMENT_REVERSAL' &&
      form.appliedOn === 'MULTIPLE_CHARGES' &&
      (!form.visitChargeIds || form.visitChargeIds.length === 0)
    ) {
      message.error('Select at least one charge');
      return;
    }

    if (ceilingExceeded) {
      message.error(
        ceilingWarningText() ?? 'This exceeds the remaining balance'
      );
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
      visitChargeIds:
        form.appliedOn === 'MULTIPLE_CHARGES' ? form.visitChargeIds : undefined,
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
      await Promise.all([refresh(), refreshBalances(), refreshCurrentTotals()]);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApplyClick = (a: Adjustment) => {
    const impact = getSettlementImpact(a);
    if (impact) {
      setConfirmApplyImpact(impact);
      setConfirmApplyTarget(a.id);
    } else {
      runAction(a.id, 'apply');
    }
  };

  const confirmApply = async () => {
    if (!confirmApplyTarget) return;
    const id = confirmApplyTarget;
    setConfirmApplyTarget(null);
    setConfirmApplyImpact(null);
    await runAction(id, 'apply');
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
        <h3 className="text-sm font-bold !text-slate-800">
          {adjustments.length} adjustment{adjustments.length === 1 ? '' : 's'}
        </h3>

        <button
          type="button"
          onClick={openRequestForm}
          className="inline-flex items-center gap-2 rounded-2xl !bg-blue-600 px-4 py-2.5 text-sm font-medium !text-white shadow-sm transition hover:!bg-blue-700"
        >
          <FileText size={15} />
          Request adjustment
        </button>
      </div>

      {adjustments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border !border-slate-100 !bg-slate-50/60 px-6 py-16 text-center">
          <FileText size={32} className="!text-slate-300" />
          <h3 className="mt-4 text-base font-bold !text-slate-700">
            No adjustments yet
          </h3>
          <p className="mt-1 max-w-sm text-sm !text-slate-500">
            Discounts, waivers, and write-offs for this visit will appear
            here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border !border-slate-200">
          <div className="divide-y !divide-slate-100">
            {adjustments.map((a) => {
              const alreadyReversed = adjustments.some(
                (other) => other.reversesAdjustmentId === a.id
              );

              const chargeName =
                a.appliedOn === 'CHARGE'
                  ? getChargeName(a.visitChargeId)
                  : null;

              const multiChargeNames =
                a.appliedOn === 'MULTIPLE_CHARGES'
                  ? getMultiChargeNames(a)
                  : [];

              return (
                <div key={a.id} className="px-4 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold !text-slate-800">
                          {a.type.replace(/_/g, ' ')}
                        </span>
                        <StatusBadge status={a.status} />
                        {a.direction && (
                          <span className="rounded-full border !border-slate-200 !bg-white px-2 py-0.5 text-[11px] font-bold uppercase !text-slate-500">
                            {a.direction}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm !text-slate-600">
                        {a.method === 'FLAT'
                          ? formatCurrency(a.amount)
                          : `${a.value}%`}{' '}
                        · Applied on{' '}
                        {a.appliedOn === 'CHARGE' && chargeName
                          ? `charge: ${chargeName}`
                          : a.appliedOn === 'MULTIPLE_CHARGES'
                            ? multiChargeNames.length > 0
                              ? `${multiChargeNames.length} charges: ${multiChargeNames.join(', ')}`
                              : `${a.chargeLinks?.length ?? 0} charges`
                            : 'whole invoice'}
                      </p>

                      <p className="mt-1 text-sm !text-slate-500">
                        {a.reason}
                      </p>

                      {a.reversesAdjustment && (
                        <p className="mt-1 text-xs !text-slate-400">
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
                          <HasRoles roles={[Roles.ADMIN, Roles.DOCTOR]}>
                            <button
                              type="button"
                              disabled={actionLoadingId === a.id}
                              onClick={() => runAction(a.id, 'approve')}
                              className="inline-flex items-center gap-1.5 rounded-lg border !border-emerald-300 !bg-emerald-50 px-3 py-2 text-xs font-bold !text-emerald-700 transition hover:!bg-emerald-100 disabled:opacity-60"
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
                              className="inline-flex items-center gap-1.5 rounded-lg border !border-red-300 !bg-red-50 px-3 py-2 text-xs font-bold !text-red-700 transition hover:!bg-red-100 disabled:opacity-60"
                            >
                              <ThumbsDown size={13} />
                              Reject
                            </button>
                          </HasRoles>
                          {!hasAdmin && a.status === 'REQUESTED' && <span>Submitted for review</span>}
                        </>
                      )}

                      {a.status === 'APPROVED' && (
                        <button
                          type="button"
                          disabled={actionLoadingId === a.id}
                          onClick={() => handleApplyClick(a)}
                          className="inline-flex items-center gap-1.5 rounded-lg !bg-blue-600 px-3 py-2 text-xs font-bold !text-white transition hover:!bg-blue-700 disabled:opacity-60"
                        >
                          {actionLoadingId === a.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={13} />
                          )}
                          Apply
                        </button>
                      )}

                      {a.status === 'APPLIED' &&
                        !alreadyReversed &&
                        a.type !== 'ADJUSTMENT_REVERSAL' && (
                          <button
                            type="button"
                            onClick={() => openReversalForm(a.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 px-3 py-2 text-xs font-bold !text-slate-600 transition hover:!border-orange-300 hover:!bg-orange-50 hover:!text-orange-700"
                          >
                            <RotateCcw size={13} />
                            Reverse
                          </button>
                        )}

                      {a.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 text-xs !text-slate-400">
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
        okButtonProps={{ disabled: ceilingExceeded }}
        width={form.appliedOn === 'MULTIPLE_CHARGES' ? 640 : undefined}
      >
        <div className="space-y-4 py-2">
          {form.type !== AdjustmentType.AdjustmentReversal && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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
                <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
                  Applied on
                </label>
                <Radio.Group
                  value={form.appliedOn}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, appliedOn: e.target.value }))
                  }
                >
                  <Radio.Button value="CHARGE">Specific charge</Radio.Button>
                  <Radio.Button value="MULTIPLE_CHARGES">
                    Multiple charges
                  </Radio.Button>
                </Radio.Group>
              </div>

              {form.appliedOn === 'CHARGE' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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

              {form.appliedOn === 'MULTIPLE_CHARGES' && (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
                    Charges
                  </label>
                  <Select
                    mode="multiple"
                    className="w-full"
                    placeholder="Select two or more charges"
                    value={form.visitChargeIds}
                    onChange={(v) =>
                      setForm((f) => ({ ...f, visitChargeIds: v }))
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

                  {selectedMultiCharges.length > 0 && (
                    <div className="mt-2.5 rounded-lg border !border-slate-200 !bg-slate-50 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold !text-slate-600">
                          Combined remaining
                        </span>
                        <span className="font-bold !text-slate-800">
                          {formatCurrency(combinedRemaining)}
                        </span>
                      </div>

                      {previewResolvedTotal > 0 && (
                        <div className="mt-2 space-y-1 border-t !border-slate-200 pt-2">
                          <p className="text-[11px] font-medium uppercase !text-slate-400">
                            Preview — how this splits across the selected charges
                          </p>
                          {selectedMultiCharges.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-center justify-between text-xs !text-slate-600"
                            >
                              <span>{c.chargeName}</span>
                              <span className="font-medium !text-blue-700">
                                {formatCurrency(sharePreview(c))}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
                    Amount{' '}
                    {form.appliedOn === 'MULTIPLE_CHARGES' && '(combined, across all selected charges)'}
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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

              {ceilingExceeded && (
                <div className="flex items-start gap-2.5 rounded-lg border !border-red-200 !bg-red-50 px-3.5 py-3">
                  <AlertTriangle
                    size={15}
                    className="mt-0.5 shrink-0 !text-red-600"
                  />
                  <p className="text-xs !text-red-700">{ceilingWarningText()}</p>
                </div>
              )}
            </>
          )}

          {form.type === AdjustmentType.AdjustmentReversal && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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
                  label: `${a.type.replace(/_/g, ' ')} · ${a.method === 'FLAT'
                    ? formatCurrency(a.amount)
                    : `${a.value}%`
                    } · ${a.reason}`,
                }))}
              />
              <p className="mt-1.5 text-xs !text-slate-400">
                Method, amount, direction, and (for multi-charge originals)
                the linked charges are all derived automatically from the
                adjustment being reversed.
              </p>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
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
        <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
          Reason
        </label>
        <Input.TextArea
          rows={2}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      <Modal
        title={
          confirmApplyImpact?.createsCredit
            ? 'This will create a credit balance'
            : 'This will fully settle the visit'
        }
        open={!!confirmApplyTarget}
        onCancel={() => {
          setConfirmApplyTarget(null);
          setConfirmApplyImpact(null);
        }}
        onOk={confirmApply}
        okText={confirmApplyImpact?.createsCredit ? 'Yes, proceed' : 'Yes, apply it'}
        okButtonProps={{ danger: true }}
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 !text-red-600" />
          {confirmApplyImpact?.createsCredit ? (
            <p className="text-sm !text-slate-700">
              Applying this adjustment will overshoot past zero, leaving a
              credit balance of {formatCurrency(confirmApplyImpact.creditAmount)}{' '}
              owed back to the patient. This does not get refunded
              automatically — it will need to be processed separately once
              applied. Please confirm you want to proceed.
            </p>
          ) : (
            <p className="text-sm !text-slate-700">
              Applying this adjustment will bring this visit's outstanding
              balance to ₦0.00. There is no direct way to undo this — the
              only path back is a separate, tracked reversal. Please confirm
              you want to proceed.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}