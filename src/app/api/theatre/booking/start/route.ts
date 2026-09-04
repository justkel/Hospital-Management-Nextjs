import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  StartTheatreProcedureDocument,
  StartTheatreProcedureMutation,
  StartTheatreProcedureMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken =
    (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const body = await req.json();

  const variables: StartTheatreProcedureMutationVariables =
    {
      data: body,
    };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
        ...idempotencyHeaders(req),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(StartTheatreProcedureDocument),
      variables,
    }),
  });

  const json: {
    data?: StartTheatreProcedureMutation;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse =
    handleGraphQLError(json.errors);

  if (errorResponse) return errorResponse;

  if (!json.data?.startTheatreProcedure) {
    return NextResponse.json(
      { error: 'Failed to start theatre procedure' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    json.data.startTheatreProcedure,
  );
}