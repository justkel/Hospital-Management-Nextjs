// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { RefreshTokenDocument, RefreshTokenMutation } from '@/shared/graphql/generated/graphql';
// import { print } from 'graphql';
// import { setAccessToken } from '@/shared/graphql/tokenStore';

// const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

// type GraphQLError = {
//   message: string;
//   extensions?: { code?: string };
// };

// export async function POST() {
//   const cookieStore = cookies();

//   const refreshToken = (await cookieStore).get('refresh_token')?.value;

//   if (!refreshToken) {
//     return NextResponse.json({ success: false }, { status: 401 });
//   }

//   const res = await fetch(GATEWAY_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${refreshToken}`,
//     },
//     body: JSON.stringify({
//       query: print(RefreshTokenDocument),
//     }),
//   });

//   const json: {
//     data?: RefreshTokenMutation;
//     errors?: GraphQLError[];
//   } = await res.json();

//   const tokenData = json.data?.refreshToken;

//   console.log('New tokens returned:', tokenData);

//   if (!tokenData?.accessToken || !tokenData?.refreshToken) {
//     return NextResponse.json({ success: false }, { status: 401 });
//   }

//   (await cookieStore).set('access_token', tokenData.accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//   });

//   (await cookieStore).set('refresh_token', tokenData.refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//   });

//   setAccessToken(tokenData.accessToken);

//   return NextResponse.json({
//     success: true,
//     accessToken: tokenData.accessToken,
//     refreshToken: tokenData.refreshToken,
//   });
// }

import { NextResponse } from 'next/server';
import { RefreshTokenDocument, RefreshTokenMutation } from '@/shared/graphql/generated/graphql';
import { print } from 'graphql';
import { setAccessToken } from '@/shared/graphql/tokenStore';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

type GraphQLError = {
  message: string;
  extensions?: { code?: string };
};

export async function POST() {
  const refreshToken = (await (await import('next/headers')).cookies()).get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({ query: print(RefreshTokenDocument) }),
  });

  const json: { data?: RefreshTokenMutation; errors?: GraphQLError[] } = await res.json();
  const tokenData = json.data?.refreshToken;

  console.log('New tokens returned:', tokenData);

  if (!tokenData?.accessToken || !tokenData?.refreshToken) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  setAccessToken(tokenData.accessToken);

  const response = NextResponse.json({
    success: true,
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
  });

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

