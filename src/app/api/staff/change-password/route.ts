import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  ChangeStaffPasswordDocument,
  ChangeStaffPasswordMutation,
  ChangeStaffPasswordMutationVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const variables: ChangeStaffPasswordMutationVariables = {
    input: body,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
        ...idempotencyHeaders(req),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(ChangeStaffPasswordDocument),
      variables,
    }),
  });

  const json: {
    data?: ChangeStaffPasswordMutation;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  const tokens = json.data?.changeStaffPassword;

  if (!tokens) {
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }

  cookieStore.set('access_token', tokens.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  if (tokens.refreshToken) {
    cookieStore.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }

  return NextResponse.json({ success: true });
}