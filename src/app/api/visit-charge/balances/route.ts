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
const GATEWAY_TIMEOUT_MS = 10_000;

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
      signal: AbortSignal.timeout(GATEWAY_TIMEOUT_MS),
      body: JSON.stringify({
        query: print(GetVisitChargeBalancesDocument),
        variables,
      }),
    });

    if (!res.ok) {
      console.error('Gateway request failed for visit charge balances', {
        status: res.status,
        visitId,
      });
      return NextResponse.json(
        { error: 'Billing service is temporarily unavailable' },
        { status: res.status >= 500 ? 503 : 502 }
      );
    }

    const json: {
      data?: GetVisitChargeBalancesQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitChargeBalances) {
      return NextResponse.json(
        { error: 'Billing service returned no charge balances' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      balances: json.data.visitChargeBalances,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Billing service is temporarily unavailable' },
      { status: 503 }
    );
  }
}