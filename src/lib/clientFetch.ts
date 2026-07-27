'use client';

type ErrorResponse = {
  error?: string;
  code?: string;
  retryAfter?: number;
};

const forceLogoutCodes = [
  'PASSWORD_CHANGED',
  'TOKEN_REVOKED',
  'ACCOUNT_INACTIVE',
];

let logoutTriggered = false;

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

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

const DEFAULT_RETRY_AFTER_SECONDS = 5;
const MAX_RETRY_AFTER_SECONDS = 30; // cap so a bad/huge value can't hang a request indefinitely

export async function clientFetch(
  input: RequestInfo,
  init: RequestInit = {},
  options: { skipRateLimitRetry?: boolean } = {}
): Promise<Response> {
  const res = await fetch(input, {
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

    await wait(retryAfterSeconds * 1000);

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

  return fetch(input, {
    ...init,
    credentials: 'include',
    ...(init as object),
    _retry: true as unknown as boolean,
  } as RequestInit);
}
