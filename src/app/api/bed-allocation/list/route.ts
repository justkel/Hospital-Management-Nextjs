import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetBedAllocationsByVisitDocument,
  GetBedAllocationsByVisitQuery,
  GetBedAllocationsByVisitQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json(
        { error: 'Missing visit ID' },
        { status: 400 }
      );
    }

    const variables: GetBedAllocationsByVisitQueryVariables = { visitId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetBedAllocationsByVisitDocument),
        variables,
      }),
    });

    const json: {
      data?: GetBedAllocationsByVisitQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.bedAllocationsByVisit) {
      return NextResponse.json(
        { error: 'Failed to fetch bed allocations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bedAllocations: json.data.bedAllocationsByVisit,
    });
  } catch (error) {
    console.error('GetBedAllocationsByVisit API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}