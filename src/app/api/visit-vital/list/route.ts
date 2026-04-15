import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  VisitVitalsDocument,
  VisitVitalsQuery,
  VisitVitalsQueryVariables,
} from '@/shared/graphql/generated/graphql';

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
        query: print(VisitVitalsDocument),
        variables: { visitId } as VisitVitalsQueryVariables,
      }),
    });

    const json: {
      data?: VisitVitalsQuery;
      errors?: { message?: string; extensions?: { code?: string } }[];
    } = await res.json();

    const unauthenticated = json.errors?.some(
      e => e.extensions?.code === 'UNAUTHENTICATED'
    );

    if (unauthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!json.data?.visitVitals) {
      return NextResponse.json(
        { error: 'Failed to fetch vitals' },
        { status: 500 }
      );
    }

    return NextResponse.json({ vitals: json.data.visitVitals });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}