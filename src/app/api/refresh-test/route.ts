import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  RefreshTokenDocument,
  RefreshTokenMutation,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type GraphQLError = {
  message: string;
  extensions?: { code?: string };
};

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { success: false, reason: 'NO_REFRESH_TOKEN' },
      { status: 401 }
    );
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      query: print(RefreshTokenDocument),
    }),
  });

  const json: { data?: RefreshTokenMutation; errors?: GraphQLError[] } =
    await res.json();

  if (json.errors?.length) {
    const isInactiveAccount = json.errors.some(
      (err) => err.message === 'Account is not active'
    );

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      {
        success: false,
        reason: isInactiveAccount ? 'ACCOUNT_INACTIVE' : 'UNAUTHORIZED',
      },
      { status: 401 }
    );
  }

  const tokenData = json.data?.refreshToken;

  if (!tokenData?.accessToken || !tokenData?.refreshToken) {
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { success: false, reason: 'INVALID_REFRESH_RESPONSE' },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('access_token', tokenData.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  response.cookies.set('refresh_token', tokenData.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return response;
}
