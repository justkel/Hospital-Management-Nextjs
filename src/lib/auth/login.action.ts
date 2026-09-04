'use server';

import { cookies } from 'next/headers';
import { idempotencyHeaders } from '@/lib/idempotency';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;
const REQUEST_TIMEOUT_MS = 10_000;

type StaffLoginData = {
  staffLogin?: {
    accessToken: string;
    refreshToken: string;
    forcePasswordChange: boolean;
  };
};

type GraphQLErrorExtension = {
  code?: string;
  status?: string;
};

type GraphQLErrorResponse = {
  message: string;
  extensions?: GraphQLErrorExtension;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLErrorResponse[];
};

export async function loginAction(input: {
  userCode: string;
  password: string;
}) {
  let json: GraphQLResponse<StaffLoginData>;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(),
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        query: `
          mutation StaffLogin($input: StaffLoginInput!) {
            staffLogin(input: $input) {
              accessToken
              refreshToken
              forcePasswordChange
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

    if (!res.ok) {
      return {
        success: false,
        message: `Authentication server error (${res.status})`,
      } as const;
    }

    json = (await res.json()) as GraphQLResponse<StaffLoginData>;
  } catch (err) {
    const timedOut = err instanceof DOMException && err.name === 'TimeoutError';

    return {
      success: false,
      message: timedOut
        ? 'The server is taking too long to respond. Please try again.'
        : 'Unable to reach authentication server',
    } as const;
  }

  if (json.errors?.length) {
    const err = json.errors[0];

    return {
      success: false,
      message: err.message || 'Login failed',
      code: err.extensions?.code,
      status: err.extensions?.status,
    } as const;
  }

  const tokens = json.data?.staffLogin;

  if (!tokens) {
    return {
      success: false,
      message: 'Invalid credentials',
    } as const;
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

  return {
    success: true,
    forcePasswordChange: tokens.forcePasswordChange,
  } as const;
}
