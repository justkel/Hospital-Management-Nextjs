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
  };
};

export const AUTH_ERROR_CODES = [
  'UNAUTHENTICATED',
  'ACCOUNT_INACTIVE',
  'TOKEN_REVOKED',
  'PASSWORD_CHANGED',
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

  return NextResponse.json(
    {
      error: error.message,
      code,
    },
    {
      status: isAuthError ? 401 : 400,
    }
  );
}