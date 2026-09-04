const HEADER = 'x-idempotency-key';

export function newIdempotencyKey(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function idempotencyHeaders(request?: Request): Record<string, string> {
  const incoming = request?.headers.get(HEADER)?.trim();
  const headers: Record<string, string> = {
    [HEADER]: incoming || newIdempotencyKey(),
  };

  return headers;
}

export function ensureIdempotencyKey(init: RequestInit): RequestInit {
  const headers = new Headers(init.headers);
  if (!headers.has(HEADER)) headers.set(HEADER, newIdempotencyKey());
  return { ...init, headers };
}
