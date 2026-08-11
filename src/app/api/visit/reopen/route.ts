import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  ReopenVisitDocument,
  ReopenVisitMutation,
  ReopenVisitMutationVariables,
} from '@/shared/graphql/generated/graphql';
import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  if (!body.visitId) {
    return NextResponse.json(
      { error: 'visitId is required' },
      { status: 400 }
    );
  }

  const variables: ReopenVisitMutationVariables = {
    visitId: body.visitId,
  };

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(ReopenVisitDocument),
        variables,
      }),
    });

    const json: {
      data?: ReopenVisitMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.reopenVisit) {
      return NextResponse.json(
        { error: 'Failed to reopen visit' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      visit: json.data.reopenVisit,
    });
  } catch (err) {
    console.error('Error reopening visit:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}