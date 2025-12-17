import { print } from 'graphql';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { headers, cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAccessToken, setAccessToken } from './tokenStore';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

// type GraphQLError = { message: string; extensions?: { code?: string } };

export class AuthError extends Error {
  constructor() {
    super('UNAUTHENTICATED');
  }
}

export async function graphqlFetch<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables?: TVariables,
  retry = true
): Promise<TData> {
  const cookieStore = cookies();
  const cookieHeader = (await headers()).get('cookie') ?? '';
  const accessToken = getAccessToken() ?? (await cookieStore).get('access_token')?.value;

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

  const json: { data?: TData; errors?: { message: string; extensions?: { code?: string } }[] } = await res.json();

  if (!json.errors) return json.data!;

  const unauthenticated = json.errors.some((e) => e.extensions?.code === 'UNAUTHENTICATED');

  if (unauthenticated && retry) {
    console.log('Access token expired → refreshing...');

    const REFRESH_URL = process.env.NEXT_PUBLIC_BASE_URL + '/api/refresh';
    const refreshRes = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { Cookie: cookieHeader },
    });
    const refreshJson = await refreshRes.json();

    if (!refreshJson.success || !refreshJson.accessToken) {
      console.warn('Refresh failed → redirecting to login');
      redirect('/login');
    }

    const newAccessToken = refreshJson.accessToken;
    setAccessToken(newAccessToken);

    // Retry only once, using the new token
    return graphqlFetch(document, variables, false);
  }

  throw new Error(json.errors[0].message);
}

