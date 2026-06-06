import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  CreateTheatreBlockDocument,
  CreateTheatreBlockMutation,
  CreateTheatreBlockMutationVariables,
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

  const variables: CreateTheatreBlockMutationVariables =
    {
      data: body,
    };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(CreateTheatreBlockDocument),
      variables,
    }),
  });

  const json: {
    data?: CreateTheatreBlockMutation;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse =
    handleGraphQLError(json.errors);

  if (errorResponse) return errorResponse;

  if (!json.data?.createTheatreBlock) {
    return NextResponse.json(
      { error: 'Failed to create theatre block' },
      { status: 500 },
    );
  }

  return NextResponse.json(
    json.data.createTheatreBlock,
  );
}