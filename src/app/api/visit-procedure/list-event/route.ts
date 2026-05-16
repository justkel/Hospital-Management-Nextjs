import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetVisitProcedureEventsDocument,
  GetVisitProcedureEventsQuery,
  GetVisitProcedureEventsQueryVariables,
  VisitProcedureEventType,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request
) {
  const cookieStore =
    await cookies();

  const accessToken =
    cookieStore.get(
      'access_token'
    )?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { searchParams } =
    new URL(req.url);

  const page = parseInt(
    searchParams.get('page') ??
      '1'
  );

  const limit = parseInt(
    searchParams.get('limit') ??
      '20'
  );

  const procedureId =
    searchParams.get(
      'procedureId'
    );

  const typeParam =
    searchParams.get('type');

  const from =
    searchParams.get('from');

  const to =
    searchParams.get('to');

  const type =
    typeParam &&
    Object.values(
      VisitProcedureEventType
    ).includes(
      typeParam as VisitProcedureEventType
    )
      ? (typeParam as VisitProcedureEventType)
      : undefined;

  try {
    const variables: GetVisitProcedureEventsQueryVariables =
      {
        pagination: {
          page,
          limit,

          ...(procedureId && {
            procedureId,
          }),

          ...(type && {
            type,
          }),

          ...(from && {
            from,
          }),

          ...(to && {
            to,
          }),
        },
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
            GetVisitProcedureEventsDocument
          ),

          variables,
        }),
      }
    );

    const json: {
      data?: GetVisitProcedureEventsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(
        json.errors
      );

    if (errorResponse)
      return errorResponse;

    if (
      !json.data
        ?.visitProcedureEvents
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch visit procedure events',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      visitProcedureEvents:
        json.data
          .visitProcedureEvents,
    });
  } catch (error) {
    console.error(
      'Get Visit Procedure Events Error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Something went wrong',
      },
      { status: 500 }
    );
  }
}