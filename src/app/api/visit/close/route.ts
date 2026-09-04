import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  CloseVisitWithValidationDocument,
  CloseVisitWithValidationMutation,
  CloseVisitWithValidationMutationVariables,
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

  const variables: CloseVisitWithValidationMutationVariables = {
    visitId: body.visitId,
  };

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CloseVisitWithValidationDocument),
        variables,
      }),
    });

    const json: {
      data?: CloseVisitWithValidationMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.closeVisitWithValidation) {
      return NextResponse.json(
        { error: 'Failed to close visit' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      visit: json.data.closeVisitWithValidation,
    });
  } catch (err) {
    console.error('Error closing visit:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 },
    );
  }
}