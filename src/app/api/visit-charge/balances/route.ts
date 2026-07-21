import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetVisitChargeBalancesDocument,
  GetVisitChargeBalancesQuery,
  GetVisitChargeBalancesQueryVariables,
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
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json(
        { error: 'Missing visitId' },
        { status: 400 }
      );
    }

    const variables: GetVisitChargeBalancesQueryVariables = { visitId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetVisitChargeBalancesDocument),
        variables,
      }),
    });

    const json: {
      data?: GetVisitChargeBalancesQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitChargeBalances) {
      return NextResponse.json(
        { error: 'Failed to fetch visit charge balances' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      balances: json.data.visitChargeBalances,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}