import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetVisitProceduresDocument,
  GetVisitProceduresQuery,
  GetVisitProceduresQueryVariables,
  VisitProcedurePriority,
  VisitProcedureStatus,
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

  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');

  const visitId = searchParams.get('visitId');

  const statusParam = searchParams.get('status');
  const priorityParam = searchParams.get('priority');

  const status =
    statusParam &&
    Object.values(VisitProcedureStatus).includes(
      statusParam as VisitProcedureStatus
    )
      ? (statusParam as VisitProcedureStatus)
      : undefined;

  const priority =
    priorityParam &&
    Object.values(VisitProcedurePriority).includes(
      priorityParam as VisitProcedurePriority
    )
      ? (priorityParam as VisitProcedurePriority)
      : undefined;

  try {
    const variables: GetVisitProceduresQueryVariables = {
      pagination: {
        page,
        limit,
        ...(visitId && { visitId }),
        ...(status && { status }),
        ...(priority && { priority }),
      },
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetVisitProceduresDocument),
        variables,
      }),
    });

    const json: {
      data?: GetVisitProceduresQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);

    if (errorResponse) return errorResponse;

    if (!json.data?.visitProcedures) {
      return NextResponse.json(
        { error: 'Failed to fetch visit procedures' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      visitProcedures: json.data.visitProcedures,
    });
  } catch (error) {
    console.error('Get Visit Procedures Error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}