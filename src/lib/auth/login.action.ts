'use server';

import { cookies } from 'next/headers';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function loginAction(input: {
  userCode: string;
  password: string;
}) {
  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation StaffLogin($input: StaffLoginInput!) {
          staffLogin(input: $input) {
            accessToken
            refreshToken
          }
        }
      `,
      variables: {
        input: {
          userCode: Number(input.userCode),
          password: input.password,
        },
      },
    }),
  });

  const json = await res.json();

  if (json.errors?.length) {
    return {
      success: false,
      message: json.errors[0].message,
    };
  }

  const tokens = json.data?.staffLogin;

  if (!tokens) {
    return {
      success: false,
      message: 'Invalid credentials',
    };
  }

  const cookieStore = await cookies();

  cookieStore.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  cookieStore.set('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return { success: true };
}
