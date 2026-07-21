import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetLatestVisitInvoiceDocument,
  GetLatestVisitInvoiceQuery,
  GetLatestVisitInvoiceQueryVariables,
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

    const variables: GetLatestVisitInvoiceQueryVariables = { visitId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetLatestVisitInvoiceDocument),
        variables,
      }),
    });

    const json: {
      data?: GetLatestVisitInvoiceQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    return NextResponse.json({
      invoice: json.data?.latestVisitInvoice ?? null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}