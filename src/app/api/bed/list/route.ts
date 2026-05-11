import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetBedsDocument,
  GetBedsQuery,
  GetBedsQueryVariables,
  BedClass,
  BedStatus,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore =
    await cookies();

  const accessToken =
    cookieStore.get(
      'access_token',
    )?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const { searchParams } =
    new URL(req.url);

  const page = parseInt(
    searchParams.get('page') ??
      '1',
  );

  const limit = parseInt(
    searchParams.get('limit') ??
      '10',
  );

  const wardId =
    searchParams.get('wardId');

  if (!wardId) {
    return NextResponse.json(
      {
        error:
          'Missing ward ID',
      },
      { status: 400 },
    );
  }

  const classParam =
    searchParams.get('class');

  const statusParam =
    searchParams.get('status');

  const isActiveParam =
    searchParams.get('isActive');

  const bedClass =
    classParam &&
    Object.values(
      BedClass,
    ).includes(
      classParam as BedClass,
    )
      ? (classParam as BedClass)
      : undefined;

  const status =
    statusParam &&
    Object.values(
      BedStatus,
    ).includes(
      statusParam as BedStatus,
    )
      ? (statusParam as BedStatus)
      : undefined;

  const isActive =
    isActiveParam === 'true'
      ? true
      : isActiveParam === 'false'
        ? false
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
            GetBedsDocument,
          ),
          variables: {
            pagination: {
              page,
              limit,
              wardId,
              ...(bedClass && {
                class:
                  bedClass,
              }),
              ...(status && {
                status,
              }),
              ...(typeof isActive ===
                'boolean' && {
                isActive,
              }),
            },
          } as GetBedsQueryVariables,
        }),
      },
    );

    const json: {
      data?: GetBedsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(
        json.errors,
      );

    if (errorResponse)
      return errorResponse;

    if (!json.data?.beds) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch beds',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      beds: json.data.beds,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          'Something went wrong',
      },
      { status: 500 },
    );
  }
}