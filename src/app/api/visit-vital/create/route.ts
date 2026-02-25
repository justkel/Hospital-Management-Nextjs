import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  CreateVisitVitalDocument,
  CreateVisitVitalMutation,
  CreateVisitVitalMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variables: CreateVisitVitalMutationVariables = {
      data: body,
    };

    const res = await fetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: print(CreateVisitVitalDocument),
        variables,
      }),
    });

    const json: {
      data?: CreateVisitVitalMutation;
      errors?: {
        message: string;
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
        { error: json.errors[0].message },
        { status: 400 }
      );
    }

    if (!json.data?.createVisitVital) {
      return NextResponse.json(
        { error: 'Failed to create visit vital' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      vital: json.data.createVisitVital,
    });
  } catch (error) {
    console.error('Create Visit Vital Error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}