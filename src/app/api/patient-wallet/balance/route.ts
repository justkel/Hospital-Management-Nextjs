import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetPatientWalletBalanceDocument,
  GetPatientWalletBalanceQuery,
  GetPatientWalletBalanceQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json(
        { error: 'Missing patientId' },
        { status: 400 }
      );
    }

    const variables: GetPatientWalletBalanceQueryVariables = { patientId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetPatientWalletBalanceDocument),
        variables,
      }),
    });

    const json: {
      data?: GetPatientWalletBalanceQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (json.data?.patientWalletBalance === undefined) {
      return NextResponse.json(
        { error: 'Failed to fetch patient wallet balance' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      balance: json.data.patientWalletBalance,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}