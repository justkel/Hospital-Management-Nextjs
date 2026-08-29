export type BillingRefreshSource =
  | 'summary'
  | 'adjustments'
  | 'invoices'
  | 'payments'
  | 'credits';

const EVENT_NAME = 'billing:changed';
let pendingSources = new Set<BillingRefreshSource>();
let notifyTimer: ReturnType<typeof setTimeout> | null = null;

export function notifyBillingChanged(source: BillingRefreshSource) {
  pendingSources.add(source);
  if (notifyTimer) return;

  notifyTimer = setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent<{ sources: BillingRefreshSource[] }>(EVENT_NAME, {
        detail: { sources: [...pendingSources] },
      }),
    );
    pendingSources = new Set();
    notifyTimer = null;
  }, 0);
}

export function subscribeToBillingChanges(
  listener: (sources: BillingRefreshSource[]) => void,
) {
  const handler = (event: Event) => {
    const sources = (event as CustomEvent<{ sources: BillingRefreshSource[] }>)
      .detail?.sources;
    if (sources?.length) listener(sources);
  };

  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
