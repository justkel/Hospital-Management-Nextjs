import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  VisitDiagnosesDocument,
  VisitDiagnosesQuery,
  VisitDiagnosesQueryVariables,
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
  const visitId = searchParams.get('visitId');

  if (!visitId) {
    return NextResponse.json({ error: 'visitId required' }, { status: 400 });
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(VisitDiagnosesDocument),
        variables: { visitId } as VisitDiagnosesQueryVariables,
      }),
    });

    const json: {
      data?: VisitDiagnosesQuery;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.visitDiagnoses) {
      return NextResponse.json(
        { error: 'Failed to fetch diagnoses' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      diagnoses: json.data.visitDiagnoses,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}