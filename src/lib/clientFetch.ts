'use client';

import { ensureIdempotencyKey } from '@/lib/idempotency';

type ErrorResponse = {
  error?: string;
  code?: string;
  retryAfter?: number;
};

const forceLogoutCodes = [
  'PASSWORD_CHANGED',
  'TOKEN_REVOKED',
  'ACCOUNT_INACTIVE',
  'GUEST_INVALID',
  'GUEST_BLOCKED',
  'GUEST_ACCESS_DENIED',
  'GUEST_ACCESS_UNVERIFIABLE',
  'GUEST_ACCESS_EXPIRED',
  'GUEST_ACCESS_DISABLED',
];

let logoutTriggered = false;
const inFlightGets = new Map<string, Promise<Response>>();

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;
let rateLimitResumeAt = 0;
let rateLimitRetryTail = Promise.resolve();
let nextRateLimitRetryAt = 0;
const RATE_LIMIT_RETRY_SPACING_MS = 100;
let transientRetryTail = Promise.resolve();
let nextTransientRetryAt = 0;
const TRANSIENT_RETRY_DELAYS_MS = [500, 1500] as const;
const TRANSIENT_RETRY_SPACING_MS = 150;

function handleForcedLogout(message: string) {
  if (logoutTriggered) return;
  logoutTriggered = true;

  window.dispatchEvent(
    new CustomEvent<{ message?: string }>('auth:logout', {
      detail: { message },
    })
  );
}

async function refreshSession(): Promise<boolean> {
  if (refreshing && refreshPromise) return refreshPromise;

  refreshing = true;

  refreshPromise = fetch('/api/refresh-test', {
    method: 'POST',
    credentials: 'include',
  })
    .then(res => res.json())
    .then(async json => {
      if (!json.success) {
        handleForcedLogout('Session expired');
        return false;
      }
      return true;
    })
    .catch(() => {
      handleForcedLogout('Session expired');
      return false;
    })
    .finally(() => {
      refreshing = false;
    });

  return refreshPromise;
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function scheduleRateLimitRetry(retryAfterMs: number): Promise<void> {
  rateLimitResumeAt = Math.max(rateLimitResumeAt, Date.now() + retryAfterMs);

  const retry = rateLimitRetryTail.then(async () => {
    const delay = Math.max(
      rateLimitResumeAt - Date.now(),
      nextRateLimitRetryAt - Date.now(),
      0
    );
    if (delay > 0) await wait(delay);
    nextRateLimitRetryAt = Date.now() + RATE_LIMIT_RETRY_SPACING_MS;
  });

  rateLimitRetryTail = retry.catch(() => {});
  return retry;
}

function scheduleTransientRetry(delayMs: number): Promise<void> {
  const retry = transientRetryTail.then(async () => {
    const delay = Math.max(
      delayMs,
      nextTransientRetryAt - Date.now(),
      0,
    );
    if (delay > 0) await wait(delay);
    nextTransientRetryAt = Date.now() + TRANSIENT_RETRY_SPACING_MS;
  });

  transientRetryTail = retry.catch(() => {});
  return retry;
}

const DEFAULT_RETRY_AFTER_SECONDS = 5;
const MAX_RETRY_AFTER_SECONDS = 30; // cap so a bad/huge value can't hang a request indefinitely

async function clientFetchUncached(
  input: RequestInfo,
  init: RequestInit = {},
  options: { skipRateLimitRetry?: boolean } = {}
): Promise<Response> {
  let res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (res.status === 429) {
    // Callers that manage their own coordinated backoff (e.g. the
    // request scheduler, which pauses ALL in-flight/queued requests
    // together rather than each retrying independently) opt out here.
    // Without this, concurrent calls would each wait and retry on
    // their own schedule, recreating the exact burst a coordinator
    // is meant to prevent.
    if (options.skipRateLimitRetry) return res;

    if ((init as RequestInit & { _retry429?: boolean })._retry429) {
      return res;
    }

    const json: ErrorResponse = await res
      .clone()
      .json()
      .catch(() => ({}));

    const retryAfterSeconds = Math.min(
      json.retryAfter ?? DEFAULT_RETRY_AFTER_SECONDS,
      MAX_RETRY_AFTER_SECONDS
    );

    await scheduleRateLimitRetry(retryAfterSeconds * 1000);

    return fetch(input, {
      ...init,
      credentials: 'include',
      _retry429: true,
    } as RequestInit);
  }

  if (!res.ok && res.status !== 401) {
    return res;
  }

  if (res.status !== 401) return res;

  const json: ErrorResponse = await res
    .clone()
    .json()
    .catch(() => ({}));

  if (json.code && forceLogoutCodes.includes(json.code)) {
    handleForcedLogout(json.error || 'Session expired');
    throw new Error(json.error || 'Force logout');
  }

  if ((init as RequestInit & { _retry?: boolean })._retry) {
    handleForcedLogout('Session expired');
    throw new Error('Retry failed');
  }

  const ok = await refreshSession();
  if (!ok) throw new Error('Unauthenticated');

  res = await fetch(input, {
    ...init,
    credentials: 'include',
    ...(init as object),
    _retry: true as unknown as boolean,
  } as RequestInit);

  return res;
}

export function clientFetch(
  input: RequestInfo,
  init: RequestInit = {},
  options: { skipRateLimitRetry?: boolean } = {}
): Promise<Response> {
  const method = (init.method ?? 'GET').toUpperCase();
  if (method !== 'GET') {
    return clientFetchUncached(input, ensureIdempotencyKey(init), options);
  }

  const requestWithTransientRetry = async (): Promise<Response> => {
    for (let attempt = 0; ; attempt += 1) {
      const response = await clientFetchUncached(input, init, options);
      if (
        ![500, 502, 503, 504].includes(response.status) ||
        attempt >= TRANSIENT_RETRY_DELAYS_MS.length
      ) {
        return response;
      }

      await scheduleTransientRetry(TRANSIENT_RETRY_DELAYS_MS[attempt]);
    }
  };

  const url =
    typeof input === 'string'
      ? input
      : input.url;
  const key = `${url}|${JSON.stringify(init.headers ?? {})}`;
  const existing = inFlightGets.get(key);
  if (existing) {
    return existing.then((response) => response.clone());
  }

  const request = requestWithTransientRetry().finally(() => {
    inFlightGets.delete(key);
  });
  inFlightGets.set(key, request);
  return request.then((response) => response.clone());
}