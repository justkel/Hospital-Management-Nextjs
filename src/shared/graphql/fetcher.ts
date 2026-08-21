import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { FORCE_LOGOUT_CODES, REFRESHABLE_AUTH_CODES } from '@/lib/auth/auth-error-codes';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export class AuthError extends Error {
  constructor() {
    super('UNAUTHENTICATED');
  }
}

type GraphQLErrorItem = {
  message: string;
  extensions?: {
    code?: string;
    originalError?: {
      statusCode?: number;
    };
  };
};

export type AuthOutcome = 'ok' | 'refresh' | 'logout';

export async function graphqlFetch<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<{ data: TData | null; authOutcome: AuthOutcome; message?: string }> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({ query: print(document), variables }),
    cache: 'no-store',
  });

  const json: { data?: TData; errors?: GraphQLErrorItem[] } = await res.json();

  if (!json.errors) return { data: json.data!, authOutcome: 'ok' };

  const code = json.errors[0]?.extensions?.code;

  const isNotFound = json.errors.some(
    (e) =>
      e.extensions?.code === 'NOT_FOUND' ||
      e.extensions?.originalError?.statusCode === 404 ||
      e.message?.toLowerCase().includes('not found')
  );
  if (isNotFound) notFound();

  if (code && FORCE_LOGOUT_CODES.includes(code as any)) {
    // Terminal: refreshing the token cannot fix an inactive account or
    // revoked/expired guest access, so don't waste a round trip on it.
    return { data: null, authOutcome: 'logout', message: json.errors[0].message };
  }

  if (code && REFRESHABLE_AUTH_CODES.includes(code as any)) {
    return { data: null, authOutcome: 'refresh' };
  }

  // Genuinely unexpected server error — this is the only case that should
  // still surface as a real crash/error boundary.
  throw new Error(json.errors[0].message);
}
