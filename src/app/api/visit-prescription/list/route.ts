import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  FindVisitPrescriptionsDocument,
  FindVisitPrescriptionsQuery,
  FindVisitPrescriptionsQueryVariables,
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

  const { searchParams } = new URL(req.url);
  const visitId = searchParams.get('visitId');

  if (!visitId) {
    return NextResponse.json(
      { error: 'visitId is required' },
      { status: 400 }
    );
  }

  const variables: FindVisitPrescriptionsQueryVariables = {
    visitId,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(FindVisitPrescriptionsDocument),
      variables,
    }),
  });

  const json: {
    data?: FindVisitPrescriptionsQuery;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.visitPrescriptions) {
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    prescriptions: json.data.visitPrescriptions,
  });
}