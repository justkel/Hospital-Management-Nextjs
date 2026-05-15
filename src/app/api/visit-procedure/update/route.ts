import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  UpdateVisitProcedureDocument,
  UpdateVisitProcedureMutation,
  UpdateVisitProcedureMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variables: UpdateVisitProcedureMutationVariables = {
      data: body,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(UpdateVisitProcedureDocument),
        variables,
      }),
    });

    const json: {
      data?: UpdateVisitProcedureMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (!json.data?.updateVisitProcedure) {
      return NextResponse.json(
        { error: 'Failed to update visit procedure' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      procedure: json.data.updateVisitProcedure,
    });
  } catch (error) {
    console.error('Update Visit Procedure Error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}