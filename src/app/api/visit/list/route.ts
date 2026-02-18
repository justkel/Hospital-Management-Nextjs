import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  FindAllVisitsDocument,
  FindAllVisitsQuery,
  FindAllVisitsQueryVariables,
  VisitStatus,
  VisitType,
} from '@/shared/graphql/generated/graphql';

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

  const statusParam = searchParams.get('status');
  const typeParam = searchParams.get('visitType');

  const status =
    statusParam &&
    Object.values(VisitStatus).includes(statusParam as VisitStatus)
      ? (statusParam as VisitStatus)
      : undefined;

  const visitType =
    typeParam &&
    Object.values(VisitType).includes(typeParam as VisitType)
      ? (typeParam as VisitType)
      : undefined;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(FindAllVisitsDocument),
        variables: {
          pagination: {
            page,
            limit,
            ...(status && { status }),
            ...(visitType && { visitType }),
          },
        } as FindAllVisitsQueryVariables,
      }),
    });

    const json: {
      data?: FindAllVisitsQuery;
      errors?: { message?: string; extensions?: { code?: string } }[];
    } = await res.json();

    const unauthenticated = json.errors?.some(
      e => e.extensions?.code === 'UNAUTHENTICATED'
    );

    if (unauthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!json.data?.visits) {
      return NextResponse.json(
        { error: 'Failed to fetch visits' },
        { status: 500 }
      );
    }

    return NextResponse.json({ visits: json.data.visits });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
