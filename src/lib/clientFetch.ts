'use client';

type ErrorResponse = {
  error?: string;
  code?: string;
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

  refreshPromise = fetch('/api/refresh', {
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

export async function clientFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  if (!res.ok && res.status !== 401) {
    const json: ErrorResponse = await res
      .clone()
      .json()
      .catch(() => ({}));

    throw new Error(json.error || 'Request failed');
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
