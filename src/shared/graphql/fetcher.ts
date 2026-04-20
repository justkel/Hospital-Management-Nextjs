import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { cookies } from 'next/headers';
import { AUTH_ERROR_CODES } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export class AuthError extends Error {
  constructor() {
    super('UNAUTHENTICATED');
  }
}

export async function graphqlFetch<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables
): Promise<TData | null> { // <- allow null if unauthenticated
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({
      query: print(document),
      variables,
    }),
    cache: 'no-store',
  });

  const json: {
    data?: TData;
    errors?: { message: string; extensions?: { code?: string } }[];
  } = await res.json();

  if (!json.errors) return json.data!;

  const unauthenticated = json.errors.some(
    (e) => AUTH_ERROR_CODES.includes(
      e.extensions?.code as (typeof AUTH_ERROR_CODES)[number]
    )
  );

  if (unauthenticated) {
    // let client handle refresh
    console.log('Access token expired → returning null to server');
    return null;
  }

  throw new Error(json.errors[0].message);
}
