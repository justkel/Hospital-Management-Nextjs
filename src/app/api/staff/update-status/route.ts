import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  UpdateStaffStatusDocument,
  UpdateStaffStatusMutation,
  UpdateStaffStatusMutationVariables,
} from '@/shared/graphql/generated/graphql';
import { GraphQLErrorShape, handleGraphQLError } from '@/lib/handle-graphql-error';

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

  const errorResponse = handleGraphQLError(json.errors);
  if (errorResponse) return errorResponse;

  if (!json.data?.updateStaffStatus) {
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }

  return NextResponse.json({ staff: json.data.updateStaffStatus });
}
