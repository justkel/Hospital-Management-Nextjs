'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function loginAction(input: {
    userCode: string;
    password: string;
}) {
    const res = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
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

    if (!res.ok) {
        throw new Error('Login failed');
    }

    const json = await res.json();

    if (json.errors?.length) {
        throw new Error(json.errors[0].message || 'Login failed');
    }
    const tokens = json.data?.staffLogin;

    if (!tokens) {
        throw new Error('Invalid credentials');
    }

    const cookieStore = cookies();

    (await cookieStore).set('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    (await cookieStore).set('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });

    redirect('/dashboard');
}
