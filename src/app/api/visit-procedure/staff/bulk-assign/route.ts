import { idempotencyHeaders } from '@/lib/idempotency';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  BulkAssignVisitProcedureStaffDocument,
  BulkAssignVisitProcedureStaffMutation,
  BulkAssignVisitProcedureStaffMutationVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const variables: BulkAssignVisitProcedureStaffMutationVariables =
      {
        data: body,
      };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        ...idempotencyHeaders(req),
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(
          BulkAssignVisitProcedureStaffDocument
        ),
        variables,
      }),
    });

    const json: {
      data?: BulkAssignVisitProcedureStaffMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (
      !json.data
        ?.bulkAssignVisitProcedureStaff
    ) {
      return NextResponse.json(
        {
          error:
            'Failed to assign procedure staff',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      staff:
        json.data
          .bulkAssignVisitProcedureStaff,
    });
  } catch (error) {
    console.error(
      'Bulk Assign Procedure Staff Error:',
      error
    );

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}