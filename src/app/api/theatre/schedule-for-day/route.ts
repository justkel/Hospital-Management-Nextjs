import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  TheatreScheduleForDayDocument,
  TheatreScheduleForDayQuery,
  TheatreScheduleForDayQueryVariables,
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

  const date =
    searchParams.get('date');

  if (!theatreId || !date) {
    return NextResponse.json(
      {
        error:
          'theatreId and date are required',
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
          TheatreScheduleForDayDocument,
        ),
        variables: {
          theatreId,
          date,
        } satisfies TheatreScheduleForDayQueryVariables,
      }),
    });

    const json: {
      data?: TheatreScheduleForDayQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (!json.data?.theatreScheduleForDay) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch theatre schedule',
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      json.data.theatreScheduleForDay,
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}