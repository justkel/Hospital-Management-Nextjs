'use client';

let refreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  if (refreshing && refreshPromise) return refreshPromise;

  refreshing = true;
  refreshPromise = fetch('/api/refresh', { method: 'POST' })
    .then(res => res.json())
    .then(json => {
      if (!json.success) {
        window.location.href = '/login';
        return false;
      }
      return true;
    })
    .finally(() => {
      refreshing = false;
    });

  return refreshPromise;
}

export async function clientFetch(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: 'include',
  });

  console.log('RES', res);

  if (res.status !== 401) {
    return res;
  }

  const ok = await refreshSession();
  if (!ok) throw new Error('Unauthenticated');

  return fetch(input, {
    ...init,
    credentials: 'include',
  });
}
