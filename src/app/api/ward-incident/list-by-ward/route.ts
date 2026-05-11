import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetWardIncidentsByWardDocument,
  GetWardIncidentsByWardQuery,
  GetWardIncidentsByWardQueryVariables,
  WardIncidentSeverity,
  WardIncidentStatus,
  WardIncidentType,
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

  const wardId =
    searchParams.get('wardId');

  if (!wardId) {
    return NextResponse.json(
      { error: 'Missing ward ID' },
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
      WardIncidentSeverity,
    ).includes(
      severityParam as WardIncidentSeverity,
    )
      ? (severityParam as WardIncidentSeverity)
      : undefined;

  const status =
    statusParam &&
    Object.values(
      WardIncidentStatus,
    ).includes(
      statusParam as WardIncidentStatus,
    )
      ? (statusParam as WardIncidentStatus)
      : undefined;

  const type =
    typeParam &&
    Object.values(
      WardIncidentType,
    ).includes(
      typeParam as WardIncidentType,
    )
      ? (typeParam as WardIncidentType)
      : undefined;

  try {
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
            GetWardIncidentsByWardDocument,
          ),
          variables: {
            wardId,
            pagination: {
              page,
              limit,
              ...(severity && {
                severity,
              }),
              ...(status && {
                status,
              }),
              ...(type && { type }),
            },
          } as GetWardIncidentsByWardQueryVariables,
        }),
      },
    );

    const json: {
      data?: GetWardIncidentsByWardQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse)
      return errorResponse;

    if (
      !json.data?.wardIncidentsByWard
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch ward incidents',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      wardIncidents:
        json.data.wardIncidentsByWard,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}