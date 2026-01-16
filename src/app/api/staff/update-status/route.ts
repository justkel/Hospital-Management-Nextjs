import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  UpdateStaffStatusDocument,
  UpdateStaffStatusMutation,
  UpdateStaffStatusMutationVariables,
} from '@/shared/graphql/generated/graphql';

type GraphQLErrorShape = {
  message: string;
  extensions?: {
    code?: string;
  };
};

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const variables: UpdateStaffStatusMutationVariables = { data: body };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ query: print(UpdateStaffStatusDocument), variables }),
  });
  
  const json: {
      data?: UpdateStaffStatusMutation;
      errors?: GraphQLErrorShape[];
    } = await res.json();

  if (json.errors?.length) {
    const unauthenticated = json.errors.some(e => e.extensions?.code === 'UNAUTHENTICATED');
    if (unauthenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: json.errors[0].message }, { status: 400 });
  }

  if (!json.data?.updateStaffStatus) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }

  return NextResponse.json({ staff: json.data.updateStaffStatus });
}
