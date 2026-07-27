import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  FailVisitBalancePaymentDocument,
  FailVisitBalancePaymentMutation,
  FailVisitBalancePaymentMutationVariables,
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

    const variables: FailVisitBalancePaymentMutationVariables = {
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
        query: print(FailVisitBalancePaymentDocument),
        variables,
      }),
    });

    const json: {
      data?: FailVisitBalancePaymentMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.failVisitBalancePayment) {
      return NextResponse.json(
        { error: 'Failed to update balance payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payment: json.data.failVisitBalancePayment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}