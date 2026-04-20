import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetVisitByIdDocument,
  GetVisitByIdQuery,
  GetVisitByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing visit ID' }, { status: 400 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(GetVisitByIdDocument),
      variables: { id } as GetVisitByIdQueryVariables,
    }),
  });

  const json: {
    data?: GetVisitByIdQuery;
    errors?: GraphQLErrorShape[];
      } = await res.json();
    
      const errorResponse = handleGraphQLError(json.errors);
      if (errorResponse) return errorResponse;

  return NextResponse.json({
    visit: json.data?.visit ?? null,
  });
}
