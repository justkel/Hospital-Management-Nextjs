import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  CreateVisitComplaintDocument,
  CreateVisitComplaintMutation,
  CreateVisitComplaintMutationVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const variables: CreateVisitComplaintMutationVariables = {
    data: body,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(CreateVisitComplaintDocument),
      variables,
    }),
  });

  const json: {
    data?: CreateVisitComplaintMutation;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.createVisitComplaint) {
    return NextResponse.json(
      { error: 'Failed to create visit complaint' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    complaint: json.data?.createVisitComplaint,
  });
}