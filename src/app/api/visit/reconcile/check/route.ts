import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  CanReconcileVisitDocument,
  CanReconcileVisitQuery,
  CanReconcileVisitQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const visitId = searchParams.get('visitId');

  if (!visitId) {
    return NextResponse.json({ error: 'visitId is required' }, { status: 400 });
  }

  const variables: CanReconcileVisitQueryVariables = {
    visitId,
  };

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CanReconcileVisitDocument),
        variables,
      }),
    });

    const json: {
      data?: CanReconcileVisitQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.canReconcileVisit) {
      return NextResponse.json(
        { error: 'Failed to check reconciliation eligibility' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      result: json.data.canReconcileVisit,
    });
  } catch (err) {
    console.error('Error checking visit reconciliation eligibility:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}