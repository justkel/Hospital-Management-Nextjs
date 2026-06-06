import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  ActiveBlocksForTheatreDocument,
  ActiveBlocksForTheatreQuery,
  ActiveBlocksForTheatreQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken =
    (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);

  const theatreId =
    searchParams.get('theatreId');

  if (!theatreId) {
    return NextResponse.json(
      {
        error: 'Theatre ID is required',
      },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(
          ActiveBlocksForTheatreDocument,
        ),
        variables: {
          theatreId,
        } satisfies ActiveBlocksForTheatreQueryVariables,
      }),
    });

    const json: {
      data?: ActiveBlocksForTheatreQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (
      !json.data?.activeBlocksForTheatre
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch active theatre blocks',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      json.data.activeBlocksForTheatre,
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}