import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  VisitComplaintsDocument,
  VisitComplaintsQuery,
  VisitComplaintsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request,
  context: { params: Promise<{ visitId: string }> }
) {
  const { visitId } = await context.params;

  if (!visitId) {
    return NextResponse.json({ error: 'Missing visitId' }, { status: 400 });
  }

  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(VisitComplaintsDocument),
      variables: { visitId } as VisitComplaintsQueryVariables,
    }),
  });

  const json: {
    data?: VisitComplaintsQuery;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  return NextResponse.json({
    complaints: json.data?.visitComplaints ?? [],
  });
}