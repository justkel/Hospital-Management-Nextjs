import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  SearchPatientDocument,
  SearchPatientQuery,
  SearchPatientQueryVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { patient: [], error: 'Missing search query' },
      { status: 400 }
    );
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(SearchPatientDocument),
      variables: { query } as SearchPatientQueryVariables,
    }),
  });

  const json: {
    data?: SearchPatientQuery;
    errors?: { extensions?: { code?: string } }[];
  } = await res.json();

  const unauthenticated = json.errors?.some(
    e => e.extensions?.code === 'UNAUTHENTICATED'
  );

  if (unauthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    patients: json.data?.searchPatient ?? [],
  });
}
