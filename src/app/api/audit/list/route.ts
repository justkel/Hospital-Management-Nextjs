import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetAuditLogsDocument,
  GetAuditLogsQuery,
  GetAuditLogsQueryVariables,
  AuditDateFilter,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

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

  const action = searchParams.get('action') ?? undefined;
  const actorId = searchParams.get('actorId') ?? undefined;
  const entity = searchParams.get('entity') ?? undefined;

  const dateFilterParam = searchParams.get('dateFilter');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  const dateFilter =
    dateFilterParam &&
      Object.values(AuditDateFilter).includes(
        dateFilterParam as AuditDateFilter
      )
      ? (dateFilterParam as AuditDateFilter)
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetAuditLogsDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(action && { action }),
            ...(actorId && { actorId }),
            ...(entity && { entity }),
            ...(dateFilter && { dateFilter }),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
          },
        } as GetAuditLogsQueryVariables,
      }),
    });

    const json: {
      data?: GetAuditLogsQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    return NextResponse.json({ audits: json.data?.auditLogs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}