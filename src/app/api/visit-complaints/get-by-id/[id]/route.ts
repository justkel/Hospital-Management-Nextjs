import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  VisitComplaintByIdDocument,
  VisitComplaintByIdQuery,
  VisitComplaintByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Missing complaint ID' }, { status: 400 });
  }

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(VisitComplaintByIdDocument),
      variables: { id } as VisitComplaintByIdQueryVariables,
    }),
  });

  const json: {
    data?: VisitComplaintByIdQuery;
    errors?: { message?: string; extensions?: { code?: string } }[];
  } = await res.json();

  const unauthenticated = json.errors?.some(
    e => e.extensions?.code === 'UNAUTHENTICATED'
  );

  if (unauthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (json.errors?.length) {
    return NextResponse.json(
      { error: json.errors[0].message ?? 'Failed to fetch complaint' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    complaint: json.data?.visitComplaintById ?? null,
  });
}