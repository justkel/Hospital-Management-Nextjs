import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  ApproveWalletGrantDocument,
  ApproveWalletGrantMutation,
  ApproveWalletGrantMutationVariables,
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

    const variables: ApproveWalletGrantMutationVariables = {
      transactionId,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(ApproveWalletGrantDocument),
        variables,
      }),
    });

    const json: {
      data?: ApproveWalletGrantMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.approveWalletGrant) {
      return NextResponse.json(
        { error: 'Failed to approve wallet grant' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      grant: json.data.approveWalletGrant,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}