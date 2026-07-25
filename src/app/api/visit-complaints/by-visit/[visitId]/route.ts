import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  VisitComplaintsDocument,
  VisitComplaintsQuery,
  VisitComplaintsQueryVariables,
} from '@/shared/graphql/generated/graphql';
import { handleGraphQLError } from '@/lib/handle-graphql-error';
import { parseGatewayResponse } from '@/lib/gateway-response';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request,
  context: { params: Promise<{ visitId: string }> }
) {
  try {
    const { visitId } = await context.params;

    if (!visitId) {
      return NextResponse.json({ error: 'Missing visitId' }, { status: 400 });
    }

    const accessToken = (await cookies()).get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(VisitComplaintsDocument),
        variables: { visitId } as VisitComplaintsQueryVariables,
      }),
    });

    const parsed = await parseGatewayResponse<VisitComplaintsQuery>(res);
    if (!parsed.ok) return parsed.response;

    const { json } = parsed;

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitComplaints) {
      return NextResponse.json(
        { error: 'Failed to fetch visit complaints' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      complaints: json.data?.visitComplaints ?? [],
    });
  } catch (error) {
    console.error('VisitComplaints API error:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}