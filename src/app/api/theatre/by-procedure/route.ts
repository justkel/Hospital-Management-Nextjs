import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetProcedureTheatreBookingsDocument,
  GetProcedureTheatreBookingsQuery,
  GetProcedureTheatreBookingsQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();

    const accessToken =
      cookieStore.get('access_token')
        ?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(
      req.url,
    );

    const procedureId =
      searchParams.get('procedureId');

    if (!procedureId) {
      return NextResponse.json(
        {
          error:
            'Missing procedure ID',
        },
        { status: 400 },
      );
    }

    const variables: GetProcedureTheatreBookingsQueryVariables =
      {
        procedureId,
      };

    const res = await fetch(
      GATEWAY_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          query: print(
            GetProcedureTheatreBookingsDocument,
          ),
          variables,
        }),
      },
    );

    const json: {
      data?: GetProcedureTheatreBookingsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse)
      return errorResponse;

    if (
      !json.data
        ?.getProcedureTheatreBookings
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch procedure theatre bookings',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      theatreBookings:
        json.data
          .getProcedureTheatreBookings,
    });
  } catch (error) {
    console.error(
      'GetProcedureTheatreBookings API error:',
      error,
    );

    return NextResponse.json(
      {
        error:
          'Internal server error',
      },
      { status: 500 },
    );
  }
}