import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  SearchStaffDocument,
  SearchStaffQuery,
  SearchStaffQueryVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ staff: [] }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ staff: [], error: 'Missing search query' }, { status: 400 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(SearchStaffDocument),
      variables: { query } as SearchStaffQueryVariables,
    }),
  });

  const json: { data?: SearchStaffQuery } = await res.json();

  return NextResponse.json({ staff: json.data?.searchStaff ?? [] });
}
