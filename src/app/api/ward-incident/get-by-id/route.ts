import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetWardIncidentByIdDocument,
  GetWardIncidentByIdQuery,
  GetWardIncidentByIdQueryVariables,
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

    const id =
      searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          error:
            'Missing ward incident ID',
        },
        { status: 400 },
      );
    }

    const variables: GetWardIncidentByIdQueryVariables =
      {
        id,
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
            GetWardIncidentByIdDocument,
          ),
          variables,
        }),
      },
    );

    const json: {
      data?: GetWardIncidentByIdQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse)
      return errorResponse;

    if (!json.data?.wardIncidentById) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch ward incident',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      wardIncident:
        json.data.wardIncidentById,
    });
  } catch (error) {
    console.error(
      'GetWardIncidentById API error:',
      error,
    );

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}