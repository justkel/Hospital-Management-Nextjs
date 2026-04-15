import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  VisitChargeExistsByDomainDocument,
  VisitChargeExistsByDomainQuery,
  VisitChargeExistsByDomainQueryVariables,
  ChargeDomain,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function GET(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const visitId = searchParams.get('visitId');
  const chargeDomainParam = searchParams.get('chargeDomain');

  if (!visitId || !chargeDomainParam) {
    return NextResponse.json(
      { error: 'visitId and chargeDomain are required' },
      { status: 400 }
    );
  }

  // convert string -> ChargeDomain enum
  const chargeDomain = chargeDomainParam as ChargeDomain;

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(VisitChargeExistsByDomainDocument),
        variables: {
          visitId,
          chargeDomain,
        } satisfies VisitChargeExistsByDomainQueryVariables,
      }),
    });

    const json: {
      data?: VisitChargeExistsByDomainQuery;
      errors?: { message?: string; extensions?: { code?: string } }[];
    } = await res.json();

    const unauthenticated = json.errors?.some(
      e => e.extensions?.code === 'UNAUTHENTICATED'
    );

    if (unauthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (json.data?.visitChargeExistsByDomain === undefined) {
      return NextResponse.json(
        { error: 'Failed to check charge existence' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: json.data.visitChargeExistsByDomain,
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}