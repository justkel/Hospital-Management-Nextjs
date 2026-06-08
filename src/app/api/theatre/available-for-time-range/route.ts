import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  AvailableTheatresForTimeRangeDocument,
  AvailableTheatresForTimeRangeQuery,
  AvailableTheatresForTimeRangeQueryVariables,
  TheatreBookingPriority,
  TheatreDepartment,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(req.url);

  const startTime =
    searchParams.get('startTime');

  const endTime =
    searchParams.get('endTime');

  if (!startTime || !endTime) {
    return NextResponse.json(
      {
        error:
          'startTime and endTime are required',
      },
      { status: 400 },
    );
  }

  const page = parseInt(
    searchParams.get('page') ?? '1',
  );

  const limit = parseInt(
    searchParams.get('limit') ?? '20',
  );

  const priorityParam =
    searchParams.get('priority');

  const departmentParam =
    searchParams.get('department');

  const priority =
    priorityParam &&
    Object.values(
      TheatreBookingPriority,
    ).includes(
      priorityParam as TheatreBookingPriority,
    )
      ? (priorityParam as TheatreBookingPriority)
      : undefined;

  const department =
    departmentParam &&
    Object.values(TheatreDepartment).includes(
      departmentParam as TheatreDepartment,
    )
      ? (departmentParam as TheatreDepartment)
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(
          AvailableTheatresForTimeRangeDocument,
        ),
        variables: {
          pagination: {
            startTime,
            endTime,
            page,
            limit,
            ...(priority && {
              priority,
            }),
            ...(department && {
              department,
            }),
          },
        } as AvailableTheatresForTimeRangeQueryVariables,
      }),
    });

    const json: {
      data?: AvailableTheatresForTimeRangeQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse) {
      return errorResponse;
    }

    if (
      !json.data
        ?.availableTheatresForTimeRange
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch available theatres',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      theatres:
        json.data
          .availableTheatresForTimeRange,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 },
    );
  }
}