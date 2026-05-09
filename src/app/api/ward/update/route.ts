import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  UpdateWardDocument,
  UpdateWardMutation,
  UpdateWardMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 },
    );
  }

  const body = await req.json();

  const variables: UpdateWardMutationVariables = {
    data: body,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(UpdateWardDocument),
      variables,
    }),
  });

  const json: {
    data?: UpdateWardMutation;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);

  if (errorResponse) return errorResponse;

  if (!json.data?.updateWard) {
    return NextResponse.json(
      { error: 'Failed to update ward' },
      { status: 500 },
    );
  }

  return NextResponse.json(json.data.updateWard);
}