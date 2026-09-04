import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
    UpdatePatientDocument,
    UpdatePatientMutation,
    UpdatePatientMutationVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const variables: UpdatePatientMutationVariables = {
        data: body,
    };

    const res = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
        ...idempotencyHeaders(req),
                ...(req.headers.get('x-idempotency-test-delay') === '2000'
                    ? { 'x-idempotency-test-delay': '2000' }
                    : {}),
                'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            query: print(UpdatePatientDocument),
            variables,
        }),
    });

    const json: {
        data?: UpdatePatientMutation;
        errors?: GraphQLErrorShape[];
        extensions?: { idempotencyState?: string };
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) {
        const idempotencyState =
          json.extensions?.idempotencyState ??
          res.headers.get('x-idempotency-state');
      if (idempotencyState) {
        errorResponse.headers.set('x-idempotency-state', idempotencyState);
      }
      return errorResponse;
    }

    if (!json.data?.updatePatient) {
      return NextResponse.json(
        { error: 'Failed to update patient' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ patient: json.data?.updatePatient });
    const idempotencyKey = req.headers.get('x-idempotency-key');
    if (idempotencyKey) {
      response.headers.set('x-idempotency-key-forwarded', idempotencyKey);
    }
    const idempotencyState =
      json.extensions?.idempotencyState ??
      res.headers.get('x-idempotency-state');
    if (idempotencyState) {
      response.headers.set('x-idempotency-state', idempotencyState);
    }
    return response;
}
