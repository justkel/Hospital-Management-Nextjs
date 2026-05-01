import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  LabResultsByLabRequestDocument,
  LabResultsByLabRequestQuery,
  LabResultsByLabRequestQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const labRequestId = searchParams.get('labRequestId');

  if (!labRequestId) {
    return NextResponse.json(
      { error: 'labRequestId is required' },
      { status: 400 }
    );
  }

  const variables: LabResultsByLabRequestQueryVariables = {
    labRequestId,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(LabResultsByLabRequestDocument),
      variables,
    }),
  });

  const json: {
    data?: LabResultsByLabRequestQuery;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.labResultsByLabRequest) {
    return NextResponse.json(
      { error: 'Failed to fetch lab results' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    labResults: json.data.labResultsByLabRequest,
  });
}