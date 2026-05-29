import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetTheatreIncidentsByTheatreDocument,
  GetTheatreIncidentsByTheatreQuery,
  GetTheatreIncidentsByTheatreQueryVariables,
  TheatreIncidentSeverity,
  TheatreIncidentStatus,
  TheatreIncidentType,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL!;

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

  const theatreId =
    searchParams.get('theatreId');

  if (!theatreId) {
    return NextResponse.json(
      { error: 'Missing theatre ID' },
      { status: 400 },
    );
  }

  const page = parseInt(
    searchParams.get('page') ?? '1',
  );

  const limit = parseInt(
    searchParams.get('limit') ?? '20',
  );

  const severityParam =
    searchParams.get('severity');

  const statusParam =
    searchParams.get('status');

  const typeParam =
    searchParams.get('type');

  const severity =
    severityParam &&
    Object.values(
      TheatreIncidentSeverity,
    ).includes(
      severityParam as TheatreIncidentSeverity,
    )
      ? (severityParam as TheatreIncidentSeverity)
      : undefined;

  const status =
    statusParam &&
    Object.values(
      TheatreIncidentStatus,
    ).includes(
      statusParam as TheatreIncidentStatus,
    )
      ? (statusParam as TheatreIncidentStatus)
      : undefined;

  const type =
    typeParam &&
    Object.values(
      TheatreIncidentType,
    ).includes(
      typeParam as TheatreIncidentType,
    )
      ? (typeParam as TheatreIncidentType)
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
          GetTheatreIncidentsByTheatreDocument,
        ),
        variables: {
          theatreId,
          pagination: {
            page,
            limit,
            ...(severity && { severity }),
            ...(status && { status }),
            ...(type && { type }),
          },
        } as GetTheatreIncidentsByTheatreQueryVariables,
      }),
    });

    const json: {
      data?: GetTheatreIncidentsByTheatreQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse)
      return errorResponse;

    if (
      !json.data?.theatreIncidentsByTheatre
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch theatre incidents',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      theatreIncidents:
        json.data.theatreIncidentsByTheatre,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}