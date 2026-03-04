import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  GetAuditLogByIdDocument,
  GetAuditLogByIdQuery,
  GetAuditLogByIdQueryVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing audit ID' },
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
      query: print(GetAuditLogByIdDocument),
      variables: { id } as GetAuditLogByIdQueryVariables,
    }),
  });

  const json: {
    data?: GetAuditLogByIdQuery;
    errors?: {
      message?: string;
      extensions?: { code?: string };
    }[];
  } = await res.json();

  const unauthenticated = json.errors?.some(
    e => e.extensions?.code === 'UNAUTHENTICATED'
  );

  if (unauthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (json.errors?.length) {
    return NextResponse.json(
      {
        error:
          json.errors[0].message ?? 'Failed to fetch audit log',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    audit: json.data?.getAuditLogById ?? null,
  });
}