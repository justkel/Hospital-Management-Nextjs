import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  UpdateVisitPrescriptionDocument,
  UpdateVisitPrescriptionMutation,
  UpdateVisitPrescriptionMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variables: UpdateVisitPrescriptionMutationVariables = {
      data: body,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(UpdateVisitPrescriptionDocument),
        variables,
      }),
    });

    const json: {
      data?: UpdateVisitPrescriptionMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.updateVisitPrescription) {
      return NextResponse.json(
        { error: 'Failed to update prescription' },
        { status: 500 }
      );
    }

    return NextResponse.json(json.data.updateVisitPrescription);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}