import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetVisitsByPatientUserCodeDocument,
  GetVisitsByPatientUserCodeQuery,
  GetVisitsByPatientUserCodeQueryVariables,
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
  const userCode = searchParams.get('userCode');

  if (!userCode) {
    return NextResponse.json(
      { visits: [], error: 'Missing userCode' },
      { status: 400 }
    );
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(GetVisitsByPatientUserCodeDocument),
      variables: {
        userCode: Number(userCode),
      } as GetVisitsByPatientUserCodeQueryVariables,
    }),
  });

  const json: {
    data?: GetVisitsByPatientUserCodeQuery;
    errors?: GraphQLErrorShape[];
  } = await res.json();

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.visitsByPatientUserCode) {
    return NextResponse.json(
      { error: 'Failed to fetch visits' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    visits: json.data?.visitsByPatientUserCode ?? [],
  });
}