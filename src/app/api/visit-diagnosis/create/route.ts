import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  CreateVisitDiagnosisDocument,
  CreateVisitDiagnosisMutation,
  CreateVisitDiagnosisMutationVariables,
} from '@/shared/graphql/generated/graphql';
import {
  GraphQLErrorShape,
  handleGraphQLError,
} from '@/lib/handle-graphql-error';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variables: CreateVisitDiagnosisMutationVariables = {
      data: body,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CreateVisitDiagnosisDocument),
        variables,
      }),
    });

    const json: {
      data?: CreateVisitDiagnosisMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

    const errorResponse = handleGraphQLError(json.errors);
    if (errorResponse) return errorResponse;

    if (!json.data?.createVisitDiagnosis) {
      return NextResponse.json(
        { error: 'Failed to create visit diagnosis' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      diagnosis: json.data.createVisitDiagnosis,
    });
  } catch (error) {
    console.error('Create Visit Diagnosis Error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}