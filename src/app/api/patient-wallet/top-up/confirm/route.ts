import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  ConfirmWalletTopUpDocument,
  ConfirmWalletTopUpMutation,
  ConfirmWalletTopUpMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json(
        { error: 'Missing transactionId' },
        { status: 400 }
      );
    }

    const variables: ConfirmWalletTopUpMutationVariables = { transactionId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(ConfirmWalletTopUpDocument),
        variables,
      }),
    });

    const json: {
      data?: ConfirmWalletTopUpMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.confirmWalletTopUp) {
      return NextResponse.json(
        { error: 'Failed to confirm top-up' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      topUp: json.data.confirmWalletTopUp,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}