import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  FindBedAllocationByIdDocument,
  FindBedAllocationByIdQuery,
  FindBedAllocationByIdQueryVariables,
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing bed allocation ID' },
        { status: 400 }
      );
    }

    const variables: FindBedAllocationByIdQueryVariables = { id };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(FindBedAllocationByIdDocument),
        variables,
      }),
    });

    const json: {
      data?: FindBedAllocationByIdQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.bedAllocationById) {
      return NextResponse.json(
        { error: 'Failed to fetch bed allocation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      bedAllocation: json.data.bedAllocationById,
    });
  } catch (error) {
    console.error('FindBedAllocationById API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}