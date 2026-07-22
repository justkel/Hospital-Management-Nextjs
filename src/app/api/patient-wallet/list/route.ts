import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetPatientWalletTransactionsDocument,
  GetPatientWalletTransactionsQuery,
  GetPatientWalletTransactionsQueryVariables,
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

    const variables: GetPatientWalletTransactionsQueryVariables = {
      patientId,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetPatientWalletTransactionsDocument),
        variables,
      }),
    });

    const json: {
      data?: GetPatientWalletTransactionsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.patientWalletTransactions) {
      return NextResponse.json(
        { error: 'Failed to fetch patient wallet transactions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactions: json.data.patientWalletTransactions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}