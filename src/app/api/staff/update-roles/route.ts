import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  UpdateStaffRolesDocument,
  UpdateStaffRolesMutation,
  UpdateStaffRolesMutationVariables,
} from '@/shared/graphql/generated/graphql';

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const variables: UpdateStaffRolesMutationVariables = { data: body };

  const res = await fetch(GATEWAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      query: print(UpdateStaffRolesDocument),
      variables,
    }),
  });

  const json: { data?: UpdateStaffRolesMutation } = await res.json();
  if (!json.data?.updateStaffRoles) {
    return NextResponse.json({ error: 'Failed to update staff roles' }, { status: 500 });
  }

  return NextResponse.json({ staff: json.data.updateStaffRoles });
}
