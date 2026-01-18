import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  UpdateStaffPasswordDocument,
  UpdateStaffPasswordMutation,
  UpdateStaffPasswordMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const variables: UpdateStaffPasswordMutationVariables = {
    input: body,
  };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(UpdateStaffPasswordDocument),
      variables,
    }),
  });

  const json: {
    data?: UpdateStaffPasswordMutation;
    errors?: { message?: string; extensions?: { code?: string } }[];
  } = await res.json();

  const unauthenticated = json.errors?.some(
    e => e.extensions?.code === 'UNAUTHENTICATED'
  );

  if (unauthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!json.data?.updateStaffPassword) {
    return NextResponse.json(
      { error: json.errors?.[0]?.message ?? 'Failed to update password' },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
