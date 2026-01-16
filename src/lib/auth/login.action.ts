'use server';

import { cookies } from 'next/headers';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type StaffLoginData = {
  staffLogin?: {
    accessToken: string;
    refreshToken: string;
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

    json = (await res.json()) as GraphQLResponse<StaffLoginData>;
  } catch {
    return {
      success: false,
      message: 'Unable to reach authentication server',
    };
  }

  if (json.errors?.length) {
    const err = json.errors[0];

    return {
      success: false,
      message: err.message || 'Login failed',
      code: err.extensions?.code,
      status: err.extensions?.status,
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
