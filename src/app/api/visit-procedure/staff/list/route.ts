import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetVisitProcedureStaffDocument,
  GetVisitProcedureStaffQuery,
  GetVisitProcedureStaffQueryVariables,
} from '@/shared/graphql/generated/graphql';

import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);

    const procedureId =
      searchParams.get('procedureId');

    if (!procedureId) {
      return NextResponse.json(
        { error: 'procedureId is required' },
        { status: 400 }
      );
    }

    const variables: GetVisitProcedureStaffQueryVariables =
      {
        procedureId,
      };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(
          GetVisitProcedureStaffDocument
        ),
        variables,
      }),
    });

    const json: {
      data?: GetVisitProcedureStaffQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse =
      handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (!json.data?.visitProcedureStaff) {
      return NextResponse.json(
        {
          error:
            'Failed to fetch procedure staff',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      staff:
        json.data.visitProcedureStaff,
    });
  } catch (error) {
    console.error(
      'Get Visit Procedure Staff Error:',
      error
    );

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}