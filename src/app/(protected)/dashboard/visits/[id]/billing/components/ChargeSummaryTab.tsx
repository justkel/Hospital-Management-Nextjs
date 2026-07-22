'use client';

import { useEffect, useState } from 'react';
import { message } from 'antd';
import {
  CheckCircle2,
  Lock,
  Loader2,
  Pencil,
  Pill,
  X,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import StatusBadge from './StatusBadge';
import type { ChargeRow, ChargeSummary, UnbilledPrescription } from '../billing-client';

function formatCurrency(amount: number | string | null | undefined) {
  const n = Number(amount ?? 0);
  return `₦${n.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

interface ChargeBalance {
  visitChargeId: string;
  totalAmount: number;
  effectiveTotal: number;
  amountPaid: number;
  remaining: number;
}

export default function ChargeSummaryTab({
  visitId,
  summary,
  unbilled,
  onSummaryChange,
  onUnbilledChange,
}: {
  visitId: string;
  summary: ChargeSummary;
  unbilled: UnbilledPrescription[];
  onSummaryChange: (summary: ChargeSummary) => void;
  onUnbilledChange: (unbilled: UnbilledPrescription[]) => void;
}) {
  const [refreshing, setRefreshing] = useState(false);

  const [balances, setBalances] = useState<Record<string, ChargeBalance>>({});

  const [editingChargeId, setEditingChargeId] = useState<string | null>(null);
  const [editUnitPrice, setEditUnitPrice] = useState('');
  const [editReason, setEditReason] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [pricingPrescriptionId, setPricingPrescriptionId] = useState<
    string | null
  >(null);
  const [priceInput, setPriceInput] = useState('');
  const [savingPrice, setSavingPrice] = useState(false);

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

  const refreshAll = async () => {
    setRefreshing(true);

    try {
      const [summaryRes, unbilledRes] = await Promise.all([
        clientFetch(`/api/visit-charge/summary?visitId=${visitId}`, {
          cache: 'no-store',
        }),
        clientFetch(
          `/api/visit-prescription/unbilled?visitId=${visitId}`,
          { cache: 'no-store' }
        ),
      ]);

      const summaryJson = await summaryRes.json();
      const unbilledJson = await unbilledRes.json();

      if (summaryRes.ok && summaryJson.summary) {
        onSummaryChange(summaryJson.summary);
      }

      if (unbilledRes.ok && unbilledJson.prescriptions) {
        onUnbilledChange(unbilledJson.prescriptions);
      }

      await refreshBalances();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId]);

  const startEdit = (charge: ChargeRow) => {
    setEditingChargeId(charge.id);
    setEditUnitPrice(String(charge.unitPrice));
    setEditReason('');
  };

  const cancelEdit = () => {
    setEditingChargeId(null);
    setEditUnitPrice('');
    setEditReason('');
  };

  const saveEdit = async () => {
    if (!editingChargeId) return;

    if (!editReason.trim()) {
      message.error('A reason is required to change a charge\'s price');
      return;
    }

    setSavingEdit(true);

    try {
      const res = await clientFetch('/api/visit-charge/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitChargeId: editingChargeId,
          unitPrice: Number(editUnitPrice),
          overrideReason: editReason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to update charge');
        return;
      }

      message.success('Charge updated');
      cancelEdit();
      await refreshAll();
    } finally {
      setSavingEdit(false);
    }
  };

  const startPricing = (prescriptionId: string) => {
    setPricingPrescriptionId(prescriptionId);
    setPriceInput('');
  };

  const cancelPricing = () => {
    setPricingPrescriptionId(null);
    setPriceInput('');
  };

  const savePricing = async () => {
    if (!pricingPrescriptionId) return;

    const unitPrice = Number(priceInput);

    if (!priceInput || Number.isNaN(unitPrice) || unitPrice <= 0) {
      message.error('Enter a valid price');
      return;
    }

    setSavingPrice(true);

    try {
      const res = await clientFetch('/api/visit-prescription/create-charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prescriptionId: pricingPrescriptionId,
          unitPrice,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to create charge');
        return;
      }

      message.success('Charge created from prescription');
      cancelPricing();
      await refreshAll();
    } finally {
      setSavingPrice(false);
    }
  };

  const renderBalanceNote = (chargeId: string) => {
    const b = balances[chargeId];
    if (!b) return null;

    const adjusted = Math.abs(b.effectiveTotal - b.totalAmount) > 0.01;
    const hasPayment = b.amountPaid > 0.01;

    if (!adjusted && !hasPayment) return null;

    return (
      <p className="mt-1 text-xs">
        {adjusted && (
          <span className="!text-blue-600">
            Effective: {formatCurrency(b.effectiveTotal)} (after adjustment)
          </span>
        )}
        {adjusted && hasPayment && <span className="!text-slate-300"> · </span>}
        {hasPayment && (
          <span className="!text-emerald-600">
            {formatCurrency(b.amountPaid)} paid ·{' '}
            {formatCurrency(b.remaining)} remaining
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="space-y-8 py-5">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={refreshAll}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-2xl border !border-slate-200 !bg-white px-4 py-2.5 text-sm font-medium !text-slate-600 shadow-sm transition-all hover:!bg-slate-50 disabled:opacity-60"
        >
          {refreshing && <Loader2 size={14} className="animate-spin" />}
          Refresh
        </button>
      </div>

      {unbilled.length > 0 && (
        <div className="rounded-2xl border !border-amber-200 !bg-amber-50/50">
          <div className="flex items-center gap-2 border-b !border-amber-200 px-5 py-4">
            <Pill size={16} className="!text-amber-600" />
            <h3 className="text-sm font-bold !text-amber-900">
              {unbilled.length} in-house prescription
              {unbilled.length === 1 ? '' : 's'} still need pricing
            </h3>
          </div>

          <div className="divide-y !divide-amber-100">
            {unbilled.map((p) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-semibold !text-slate-800">{p.drug}</p>
                  <p className="text-xs !text-slate-500">
                    {[p.dose, p.route, p.frequency].filter(Boolean).join(' · ') ||
                      'No dosage details'}
                    {' · '}
                    Prescribed by {p.prescribingDoctor?.fullName ?? 'Unknown'}
                  </p>
                </div>

                {pricingPrescriptionId === p.id ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      autoFocus
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="Unit price"
                      className="w-32 rounded-lg border !border-slate-300 px-3 py-2 text-sm focus:!border-blue-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={savePricing}
                      disabled={savingPrice}
                      className="inline-flex items-center gap-1.5 rounded-lg !bg-emerald-600 px-3 py-2 text-sm font-medium !text-white transition hover:!bg-emerald-700 disabled:opacity-60"
                    >
                      {savingPrice ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={14} />
                      )}
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={cancelPricing}
                      disabled={savingPrice}
                      className="inline-flex items-center rounded-lg border !border-slate-200 px-3 py-2 text-sm font-medium !text-slate-600 transition hover:!bg-slate-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startPricing(p.id)}
                    className="inline-flex items-center gap-1.5 self-start rounded-lg border !border-amber-300 !bg-white px-3 py-2 text-sm font-medium !text-amber-700 transition hover:!bg-amber-50 sm:self-auto"
                  >
                    <Pencil size={14} />
                    Set price &amp; bill
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Lock size={15} className="!text-slate-400" />
          <h3 className="text-sm font-bold !text-slate-800">
            Locked charges ({summary.lockedCharges.length})
          </h3>
        </div>

        {summary.lockedCharges.length === 0 ? (
          <p className="rounded-xl border !border-slate-100 !bg-slate-50/60 px-4 py-6 text-center text-sm !text-slate-400">
            No fixed charges recorded yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border !border-slate-200">
            <div className="divide-y !divide-slate-100">
              {summary.lockedCharges.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium !text-slate-800">{c.chargeName}</p>
                    <p className="text-xs !text-slate-500">
                      {c.chargeDomain} · Qty {c.quantity} ·{' '}
                      {formatCurrency(c.unitPrice)} each
                    </p>
                    {renderBalanceNote(c.id)}
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={c.status} />
                    <span className="font-semibold !text-slate-900">
                      {formatCurrency(c.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="mb-3 flex items-center gap-2">
          <Pencil size={15} className="!text-blue-500" />
          <h3 className="text-sm font-bold !text-slate-800">
            Editable charges ({summary.editableCharges.length})
          </h3>
        </div>

        {summary.editableCharges.length === 0 ? (
          <p className="rounded-xl border !border-slate-100 !bg-slate-50/60 px-4 py-6 text-center text-sm !text-slate-400">
            No variable charges recorded yet.
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border !border-slate-200">
            <div className="divide-y !divide-slate-100">
              {summary.editableCharges.map((c) => (
                <div key={c.id} className="px-4 py-3.5">
                  {editingChargeId === c.id ? (
                    <div className="flex flex-col gap-2">
                      <p className="font-medium !text-slate-800">
                        {c.chargeName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="number"
                          autoFocus
                          value={editUnitPrice}
                          onChange={(e) => setEditUnitPrice(e.target.value)}
                          className="w-32 rounded-lg border !border-slate-300 px-3 py-2 text-sm focus:!border-blue-400 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={editReason}
                          onChange={(e) => setEditReason(e.target.value)}
                          placeholder="Reason for price change"
                          className="min-w-[220px] flex-1 rounded-lg border !border-slate-300 px-3 py-2 text-sm focus:!border-blue-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={savingEdit}
                          className="inline-flex items-center gap-1.5 rounded-lg !bg-emerald-600 px-3 py-2 text-sm font-medium !text-white transition hover:!bg-emerald-700 disabled:opacity-60"
                        >
                          {savingEdit ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle2 size={14} />
                          )}
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          disabled={savingEdit}
                          className="inline-flex items-center rounded-lg border !border-slate-200 px-3 py-2 text-sm font-medium !text-slate-600 transition hover:!bg-slate-50"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium !text-slate-800">
                          {c.chargeName}
                        </p>
                        <p className="text-xs !text-slate-500">
                          {c.chargeDomain} · Qty {c.quantity} ·{' '}
                          {formatCurrency(c.unitPrice)} each
                        </p>
                        {renderBalanceNote(c.id)}
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={c.status} />
                        <span className="font-semibold !text-slate-900">
                          {formatCurrency(c.totalAmount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => startEdit(c)}
                          className="inline-flex items-center gap-1.5 rounded-lg border !border-slate-200 px-3 py-1.5 text-xs font-medium !text-slate-600 transition hover:!border-blue-300 hover:!bg-blue-50 hover:!text-blue-700"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border !border-slate-200 !bg-slate-50 px-5 py-4">
        <span className="text-sm font-semibold !text-slate-600">
          Running total
        </span>
        <span className="text-xl font-bold !text-slate-900">
          {formatCurrency(summary.total)}
        </span>
      </div>
    </div>
  );
}