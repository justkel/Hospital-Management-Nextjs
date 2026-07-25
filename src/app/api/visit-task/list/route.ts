import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  GetVisitTasksByVisitDocument,
  GetVisitTasksByVisitQuery,
  GetVisitTasksByVisitQueryVariables,
} from '@/shared/graphql/generated/graphql';

import { handleGraphQLError } from '@/lib/handle-graphql-error';
import { parseGatewayResponse } from '@/lib/gateway-response';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json({ error: 'Missing visit ID' }, { status: 400 });
    }

    const variables: GetVisitTasksByVisitQueryVariables = { visitId };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(GetVisitTasksByVisitDocument),
        variables,
      }),
    });

    const parsed = await parseGatewayResponse<GetVisitTasksByVisitQuery>(res);
    if (!parsed.ok) return parsed.response;

    const { json } = parsed;

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitTasksByVisit) {
      return NextResponse.json(
        { error: 'Failed to fetch visit tasks' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      visitTasks: json.data.visitTasksByVisit,
    });
  } catch (error) {
    console.error('GetVisitTasksByVisit API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}