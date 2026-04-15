import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';

import {
  CreateChargeCatalogDocument,
  CreateChargeCatalogMutation,
  CreateChargeCatalogMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const body = await req.json();

  const variables: CreateChargeCatalogMutationVariables = {
    data: body,
  };

  try {
    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CreateChargeCatalogDocument),
        variables,
      }),
    });

    const json: {
      data?: CreateChargeCatalogMutation;
      errors?: {
        message?: string;
        extensions?: { code?: string };
      }[];
    } = await res.json();

    const unauthenticated = json.errors?.some(
      e => e.extensions?.code === 'UNAUTHENTICATED'
    );

    if (unauthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (json.errors?.length) {
      return NextResponse.json(
        { error: json.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      charge: json.data?.createChargeCatalog,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}