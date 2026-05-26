import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetTheatresDocument,
  GetTheatresQuery,
  GetTheatresQueryVariables,
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

  const page = parseInt(
    searchParams.get('page') ?? '1',
  );

  const limit = parseInt(
    searchParams.get('limit') ?? '20',
  );

  const departmentParam =
    searchParams.get('department');

  const isActiveParam =
    searchParams.get('isActive');

  const department =
    departmentParam &&
    Object.values(TheatreDepartment).includes(
      departmentParam as TheatreDepartment,
    )
      ? (departmentParam as TheatreDepartment)
      : undefined;

  const isActive =
    typeof isActiveParam === 'string'
      ? isActiveParam === 'true'
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetTheatresDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(department && { department }),
            ...(typeof isActive === 'boolean' && {
              isActive,
            }),
          },
        } as GetTheatresQueryVariables,
      }),
    });

    const json: {
      data?: GetTheatresQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(
      json.errors,
    );

    if (errorResponse) return errorResponse;

    if (!json.data?.theatres) {
      return NextResponse.json(
        { error: 'Failed to fetch theatres' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      theatres: json.data.theatres,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}