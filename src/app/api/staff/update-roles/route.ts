import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { print } from 'graphql';
import {
  UpdateStaffRolesDocument,
  UpdateStaffRolesMutation,
  UpdateStaffRolesMutationVariables,
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

  const json: {
    data?: UpdateStaffRolesMutation;
    errors?: GraphQLErrorShape[];
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

  if (!json.data?.updateStaffRoles) {
    return NextResponse.json(
      { error: 'Failed to update staff roles' },
      { status: 500 }
    );
  }

  return NextResponse.json({ staff: json.data.updateStaffRoles });
}
