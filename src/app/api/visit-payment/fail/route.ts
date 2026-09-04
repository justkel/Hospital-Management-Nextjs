import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  FailVisitPaymentDocument,
  FailVisitPaymentMutation,
  FailVisitPaymentMutationVariables,
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
    const body = await req.json();

    const variables: FailVisitPaymentMutationVariables = {
      paymentId: body.paymentId,
      reason: body.reason,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(FailVisitPaymentDocument),
        variables,
      }),
    });

    const json: {
      data?: FailVisitPaymentMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.failVisitPayment) {
      return NextResponse.json(
        { error: 'Failed to mark visit payment as failed' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      payment: json.data.failVisitPayment,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}