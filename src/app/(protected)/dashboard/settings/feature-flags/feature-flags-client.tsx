'use client';

import { useState } from 'react';
import { Modal, Input, message, Switch } from 'antd';
import {
  ChevronDown,
  ChevronUp,
  History,
  Loader2,
  ShieldCheck,
  ToggleLeft,
} from 'lucide-react';

import { clientFetch } from '@/lib/clientFetch';
import type {
  GetOrganizationFeatureFlagsQuery,
  GetOrganizationFeatureFlagHistoryQuery,
} from '@/shared/graphql/generated/graphql';

export type FeatureFlagRow =
  GetOrganizationFeatureFlagsQuery['organizationFeatureFlags'][number];
export type FeatureFlagHistoryRow =
  GetOrganizationFeatureFlagHistoryQuery['organizationFeatureFlagHistory'][number];

function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const FLAG_METADATA: Record<string, { label: string; description: string }> = {
  PATIENT_WALLET: {
    label: 'Patient Wallet',
    description:
      'Allows visit credit to be transferred into a patient wallet, goodwill credit to be granted directly, and wallet balances to be spent toward future visit charges. When off, wallet-related options are hidden across billing and credit screens.',
  },
};

export default function FeatureFlagsClient({
  initialFlags,
}: {
  initialFlags: FeatureFlagRow[];
}) {
  const [flags, setFlags] = useState<FeatureFlagRow[]>(initialFlags);

  const [toggleTarget, setToggleTarget] = useState<FeatureFlagRow | null>(
    null
  );
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [historyByKey, setHistoryByKey] = useState<
    Record<string, FeatureFlagHistoryRow[]>
  >({});
  const [historyLoading, setHistoryLoading] = useState<string | null>(null);

  const refreshFlags = async () => {
    const res = await clientFetch('/api/feature-flag/list', {
      cache: 'no-store',
    });
    const json = await res.json();
    if (res.ok && json.flags) {
      setFlags(json.flags);
    }
  };

  const openToggle = (flag: FeatureFlagRow) => {
    setToggleTarget(flag);
    setReason('');
  };

  const submitToggle = async () => {
    if (!toggleTarget) return;

    if (!reason.trim()) {
      message.error('A reason is required');
      return;
    }

    setSubmitting(true);

    try {
      const res = await clientFetch('/api/feature-flag/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flagKey: toggleTarget.flagKey,
          enabled: !toggleTarget.enabled,
          reason: reason.trim(),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        message.error(json.error || 'Failed to update feature flag');
        return;
      }

      message.success('Feature flag updated');
      setToggleTarget(null);
      setReason('');
      await refreshFlags();

      if (historyByKey[toggleTarget.flagKey]) {
        await loadHistory(toggleTarget.flagKey, true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const loadHistory = async (flagKey: string, force = false) => {
    if (!force && historyByKey[flagKey]) return;

    setHistoryLoading(flagKey);

    try {
      const res = await clientFetch(
        `/api/feature-flag/history?flagKey=${flagKey}`,
        { cache: 'no-store' }
      );
      const json = await res.json();

      if (res.ok && json.history) {
        setHistoryByKey((prev) => ({ ...prev, [flagKey]: json.history }));
      }
    } finally {
      setHistoryLoading(null);
    }
  };

  const toggleExpanded = (flagKey: string) => {
    if (expandedKey === flagKey) {
      setExpandedKey(null);
      return;
    }

    setExpandedKey(flagKey);
    loadHistory(flagKey);
  };

  return (
    <div className="min-h-screen !bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border !border-blue-200 !bg-blue-50 px-3 py-1 text-xs font-medium !text-blue-700">
            <ShieldCheck size={13} />
            Organization settings
          </div>
          <h1 className="text-2xl font-semibold tracking-tight !text-slate-900 sm:text-3xl">
            Feature flags
          </h1>
          <p className="mt-1.5 max-w-lg text-sm leading-relaxed !text-slate-500">
            Turn optional capabilities on or off for this organization. Every
            change is recorded permanently, with who made it and why.
          </p>
        </div>

        <div className="space-y-4">
          {flags.map((flag) => {
            const meta = FLAG_METADATA[flag.flagKey] ?? {
              label: flag.flagKey,
              description: 'No description available for this flag.',
            };
            const isExpanded = expandedKey === flag.flagKey;
            const history = historyByKey[flag.flagKey];

            return (
              <div
                key={flag.flagKey}
                className="overflow-hidden rounded-2xl border !border-slate-200/70 !bg-white/90 shadow-[0_10px_40px_rgba(15,23,42,0.05)]"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-bold !text-slate-900">
                        {meta.label}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold uppercase ${
                          flag.enabled
                            ? '!bg-emerald-100 !text-emerald-700'
                            : '!bg-slate-100 !text-slate-500'
                        }`}
                      >
                        {flag.enabled ? 'On' : 'Off'}
                      </span>
                    </div>
                    <p className="mt-1.5 max-w-xl text-sm !text-slate-500">
                      {meta.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <Switch
                      checked={flag.enabled}
                      onChange={() => openToggle(flag)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleExpanded(flag.flagKey)}
                  className="flex w-full items-center justify-between border-t !border-slate-100 !bg-slate-50/60 px-5 py-2.5 text-xs font-semibold !text-slate-500 transition hover:!bg-slate-100"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <History size={13} />
                    History
                  </span>
                  {isExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t !border-slate-100 px-5 py-4">
                    {historyLoading === flag.flagKey ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2
                          size={18}
                          className="animate-spin !text-slate-400"
                        />
                      </div>
                    ) : !history || history.length === 0 ? (
                      <p className="py-2 text-center text-xs !text-slate-400">
                        No changes recorded yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {history.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start gap-3 text-xs"
                          >
                            <span
                              className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                                event.enabled
                                  ? '!bg-emerald-500'
                                  : '!bg-slate-400'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="font-semibold !text-slate-700">
                                Turned {event.enabled ? 'on' : 'off'} ·{' '}
                                {formatDateTime(event.createdAt)}
                              </p>
                              <p className="mt-0.5 !text-slate-500">
                                {event.reason}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Modal
        title={
          toggleTarget
            ? `Turn ${toggleTarget.enabled ? 'off' : 'on'} ${
                FLAG_METADATA[toggleTarget.flagKey]?.label ??
                toggleTarget.flagKey
              }`
            : 'Update feature flag'
        }
        open={!!toggleTarget}
        onCancel={() => setToggleTarget(null)}
        onOk={submitToggle}
        okText={toggleTarget?.enabled ? 'Turn off' : 'Turn on'}
        confirmLoading={submitting}
        okButtonProps={{ danger: toggleTarget?.enabled }}
      >
        <div className="space-y-3 py-2">
          <div className="flex items-start gap-2.5 rounded-lg border !border-slate-200 !bg-slate-50 px-3.5 py-3">
            <ToggleLeft size={16} className="mt-0.5 shrink-0 !text-slate-400" />
            <p className="text-xs !text-slate-600">
              This change takes effect immediately across the organization
              and is recorded permanently.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase !text-slate-500">
              Reason
            </label>
            <Input.TextArea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you making this change?"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}