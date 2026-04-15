import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  ChargeDomainMappingsDocument,
  ChargeDomainMappingsQuery,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET() {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(ChargeDomainMappingsDocument),
      }),
    });

    const json: {
      data?: ChargeDomainMappingsQuery;
      errors?: { message?: string; extensions?: { code?: string } }[];
    } = await res.json();

    const unauthenticated = json.errors?.some(
      e => e.extensions?.code === 'UNAUTHENTICATED'
    );

    if (unauthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!json.data?.chargeDomainMappings) {
      return NextResponse.json(
        { error: 'Failed to fetch mappings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      mappings: json.data.chargeDomainMappings,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}