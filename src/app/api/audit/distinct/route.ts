import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetAuditDistinctValuesDocument,
  GetAuditDistinctValuesQuery,
  GetAuditDistinctValuesQueryVariables,
  AuditDistinctField,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fieldParam = searchParams.get('field');

  const field =
    fieldParam &&
      Object.values(AuditDistinctField).includes(
        fieldParam as AuditDistinctField
      )
      ? (fieldParam as AuditDistinctField)
      : undefined;

  if (!field) {
    return NextResponse.json(
      { error: 'Invalid distinct field' },
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
        query: print(GetAuditDistinctValuesDocument),
        variables: { field } as GetAuditDistinctValuesQueryVariables,
      }),
    });

    const json: {
      data?: GetAuditDistinctValuesQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    return NextResponse.json({
      values: json?.data?.getAuditDistinctValues,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}