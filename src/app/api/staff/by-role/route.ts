import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetStaffByRoleDocument,
  GetStaffByRoleQuery,
  GetStaffByRoleQueryVariables,
  StaffRole,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get('role') as StaffRole | null;

  if (!role) {
    return NextResponse.json(
      { error: 'role is required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetStaffByRoleDocument),
        variables: {
          role,
        } as GetStaffByRoleQueryVariables,
      }),
    });

    const json: {
      data?: GetStaffByRoleQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.staffByRole) {
      return NextResponse.json(
        { error: 'Failed to fetch staff by role' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      staff: json.data.staffByRole,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}