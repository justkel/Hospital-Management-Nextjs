import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  VisitComplaintByIdDocument,
  VisitComplaintByIdQuery,
  VisitComplaintByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing complaint ID' }, { status: 400 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(VisitComplaintByIdDocument),
      variables: { id } as VisitComplaintByIdQueryVariables,
    }),
  });

  const json: {
    data?: VisitComplaintByIdQuery;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.visitComplaintById) {
    return NextResponse.json(
      { error: 'Failed to fetch visit complaint' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    complaint: json.data?.visitComplaintById ?? null,
  });
}