import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { print } from 'graphql';
import {
  LogoutDocument,
  LogoutMutation,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type GraphQLError = {
  message: string;
  extensions?: { code?: string };
};

export async function POST() {
  const cookieStore = await cookies();
  const headerStore = headers();

  const accessToken = cookieStore.get('access_token')?.value;
  const rawCookie = (await headerStore).get('cookie');

  if (!accessToken) {
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json({ success: true });
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...(rawCookie ? { cookie: rawCookie } : {}),
      },
      body: JSON.stringify({
        query: print(LogoutDocument),
      }),
    });

    const json: { data?: LogoutMutation; errors?: GraphQLError[] } =
      await res.json();

    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    if (json.errors?.length) {
      return NextResponse.json(
        { success: false, reason: 'LOGOUT_FAILED' },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    return NextResponse.json(
      { success: false, reason: 'NETWORK_ERROR' },
      { status: 200 }
    );
  }
}