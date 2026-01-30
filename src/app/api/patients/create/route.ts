import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
    CreatePatientDocument,
    CreatePatientMutation,
    CreatePatientMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
    const accessToken = (await cookies()).get('access_token')?.value;
    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const variables: CreatePatientMutationVariables = {
        data: body,
    };

    const res = await fetch(GATEWAY_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            query: print(CreatePatientDocument),
            variables,
        }),
    });

    const json: {
        data?: CreatePatientMutation;
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

    return NextResponse.json({
        patient: json?.data?.createPatient.patient,
        warning: json.data?.createPatient.warning,
        matches: json.data?.createPatient.matches,
    });
}
