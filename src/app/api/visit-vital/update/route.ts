import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
    UpdateVisitVitalDocument,
    UpdateVisitVitalMutation,
    UpdateVisitVitalMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function PUT(req: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const variables: UpdateVisitVitalMutationVariables = { data: body };

    const res = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            query: print(UpdateVisitVitalDocument),
            variables,
        }),
    });

    const json: {
        data?: UpdateVisitVitalMutation;
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

    if (!json.data?.updateVisitVital) {
        return NextResponse.json(
            { error: 'Failed to update visit vital' },
            { status: 500 }
        );
    }

    return NextResponse.json({
        vital: json.data.updateVisitVital,
    });
}