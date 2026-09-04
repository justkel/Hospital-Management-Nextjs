import { NextResponse } from 'next/server';

type OriginalError = {
  message?: string;
  code?: string;
};

export type GraphQLErrorShape = {
  message: string;
  extensions?: {
    code?: string;
    originalError?: OriginalError;
    retryAfter?: number;
  };
};

export const AUTH_ERROR_CODES = [
  'UNAUTHENTICATED',
  'ACCOUNT_INACTIVE',
  'TOKEN_REVOKED',
  'PASSWORD_CHANGED',
  'GUEST_INVALID',
  'GUEST_BLOCKED',
  'GUEST_ACCESS_DENIED',
  'GUEST_ACCESS_EXPIRED',
  'GUEST_ACCESS_DISABLED',
  'GUEST_ACCESS_UNVERIFIABLE',
] as const;

const CONFLICT_ERROR_CODES = [
  'IDEMPOTENCY_CONFLICT',
  'RECORD_VERSION_CONFLICT',
] as const;

export function handleGraphQLError(
  errors?: GraphQLErrorShape[]
): NextResponse | null {
  const error = errors?.[0];
  if (!error) return null;

  const code = error.extensions?.code;

  const isAuthError =
    (typeof code === 'string' &&
      AUTH_ERROR_CODES.includes(
        code as (typeof AUTH_ERROR_CODES)[number]
      )) ||
    error.message?.toLowerCase().includes('unauthorized');
  const isConflict = typeof code === 'string' &&
    CONFLICT_ERROR_CODES.includes(
      code as (typeof CONFLICT_ERROR_CODES)[number]
    );

  return NextResponse.json(
    {
      error: error.message,
      code,
      ...(error.extensions?.retryAfter !== undefined
        ? { retryAfter: error.extensions.retryAfter }
        : {}),
    },
    {
      status: isAuthError ? 401 : isConflict ? 409 : 400,
    }
  );
}