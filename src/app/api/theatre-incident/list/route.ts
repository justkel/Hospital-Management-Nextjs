import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetTheatreIncidentsDocument,
  GetTheatreIncidentsQuery,
  GetTheatreIncidentsQueryVariables,
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

  const theatreId =
    searchParams.get('theatreId') ??
    undefined;

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
        query: print(GetTheatreIncidentsDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(severity && { severity }),
            ...(status && { status }),
            ...(type && { type }),
            ...(theatreId && { theatreId }),
          },
        } as GetTheatreIncidentsQueryVariables,
      }),
    });

    const json: {
      data?: GetTheatreIncidentsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse)
      return errorResponse;

    if (!json.data?.theatreIncidents) {
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
        json.data.theatreIncidents,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}