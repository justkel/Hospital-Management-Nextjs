import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetBedAllocationsByWardDocument,
  GetBedAllocationsByWardQuery,
  GetBedAllocationsByWardQueryVariables,
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
    const wardId = searchParams.get('wardId');

    if (!wardId) {
      return NextResponse.json(
        { error: 'Missing ward ID' },
        { status: 400 }
      );
    }

    const variables: GetBedAllocationsByWardQueryVariables = { wardId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetBedAllocationsByWardDocument),
        variables,
      }),
    });

    const json: {
      data?: GetBedAllocationsByWardQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitBedAllocationsByWard) {
      return NextResponse.json(
        { error: 'Failed to fetch bed allocations' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bedAllocations: json.data.visitBedAllocationsByWard,
    });
  } catch (error) {
    console.error('GetBedAllocationsByWard API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}