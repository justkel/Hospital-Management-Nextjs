import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  RejectWalletGrantDocument,
  RejectWalletGrantMutation,
  RejectWalletGrantMutationVariables,
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
    const { transactionId, reason } = await req.json();

    if (!transactionId || !reason) {
      return NextResponse.json(
        { error: 'Missing transactionId or reason' },
        { status: 400 }
      );
    }

    const variables: RejectWalletGrantMutationVariables = {
      transactionId,
      reason,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(RejectWalletGrantDocument),
        variables,
      }),
    });

    const json: {
      data?: RejectWalletGrantMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.rejectWalletGrant) {
      return NextResponse.json(
        { error: 'Failed to reject wallet grant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      grant: json.data.rejectWalletGrant,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}