import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  RefundVisitBalancePaymentDocument,
  RefundVisitBalancePaymentMutation,
  RefundVisitBalancePaymentMutationVariables,
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
    const { id, reason } = await req.json();

    if (!id || !reason) {
      return NextResponse.json(
        { error: 'Missing id or reason' },
        { status: 400 }
      );
    }

    const variables: RefundVisitBalancePaymentMutationVariables = {
      id,
      reason,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(RefundVisitBalancePaymentDocument),
        variables,
      }),
    });

    const json: {
      data?: RefundVisitBalancePaymentMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.refundVisitBalancePayment) {
      return NextResponse.json(
        { error: 'Failed to refund balance payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payment: json.data.refundVisitBalancePayment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}