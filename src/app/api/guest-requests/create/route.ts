import { NextResponse } from 'next/server';
import { print } from 'graphql';

import {
  CreateGuestRequestDocument,
  CreateGuestRequestMutation,
  CreateGuestRequestMutationVariables,
  CreateGuestRequestInput,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, reasonForVisit } = body ?? {};

    if (!firstName || !lastName || !email || !phone || !reasonForVisit) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    const input: CreateGuestRequestInput = {
      firstName,
      lastName,
      email,
      phone,
      reasonForVisit,
    };

    const variables: CreateGuestRequestMutationVariables = { input };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: print(CreateGuestRequestDocument),
        variables,
      }),
    });

    const json: {
      data?: CreateGuestRequestMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.createGuestRequest) {
      return NextResponse.json(
        { error: 'Failed to submit your request' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      guestRequest: json.data.createGuestRequest,
    });
  } catch (err) {
    console.error('Error creating guest request:', err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}