import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  CatalogsByChargeDomainDocument,
  CatalogsByChargeDomainQuery,
  ChargeDomain,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');

  if (!domain) {
    return NextResponse.json(
      { error: 'Charge domain is required' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CatalogsByChargeDomainDocument),
        variables: {
          chargeDomain: domain as ChargeDomain,
        },
      }),
    });

    const json: {
      data?: CatalogsByChargeDomainQuery;
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
        { error: json.errors[0].message },
        { status: 400 }
      );
    }

    if (!json.data?.catalogsByChargeDomain) {
      return NextResponse.json(
        { error: 'Failed to fetch catalogs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      catalogs: json.data.catalogsByChargeDomain,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}