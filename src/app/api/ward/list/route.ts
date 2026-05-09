import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetWardsDocument,
  GetWardsQuery,
  GetWardsQueryVariables,
  WardClass,
  WardDepartment,
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

  const wardClassParam =
    searchParams.get('wardClass');

  const isActiveParam =
    searchParams.get('isActive');

  const department =
    departmentParam &&
    Object.values(WardDepartment).includes(
      departmentParam as WardDepartment,
    )
      ? (departmentParam as WardDepartment)
      : undefined;

  const wardClass =
    wardClassParam &&
    Object.values(WardClass).includes(
      wardClassParam as WardClass,
    )
      ? (wardClassParam as WardClass)
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
        query: print(GetWardsDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(department && { department }),
            ...(wardClass && { wardClass }),
            ...(typeof isActive === 'boolean' && {
              isActive,
            }),
          },
        } as GetWardsQueryVariables,
      }),
    });

    const json: {
      data?: GetWardsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(
      json.errors,
    );

    if (errorResponse) return errorResponse;

    if (!json.data?.wards) {
      return NextResponse.json(
        { error: 'Failed to fetch wards' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      wards: json.data.wards,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}